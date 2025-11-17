import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: ''
  });
  const [profileImage, setProfileImage] = useState('https://avatar.iran.liara.run/public/boy?username=Ash');

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
    const savedImage = localStorage.getItem('userProfileImage');
    
    if (savedProfile) {
      setFormData({
        name: savedProfile.name || '',
        address: savedProfile.address || '',
        phone: savedProfile.phone || '',
        email: savedProfile.email || '',
        password: ''
      });
    }
    
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const { name, address, phone, email } = formData;
    
    const userProfileData = {
      name,
      address,
      phone,
      email
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));
    
    if (profileImage && profileImage.startsWith('data:')) {
      localStorage.setItem('userProfileImage', profileImage);
    }
    
    alert('Profile changes saved!');
    setFormData({ ...formData, password: '' });
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-green-100 to-pink-200 min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center text-4xl font-bold">
            <h1 className="font-bold text-2xl text-yellow-500">
              <Link to="/">Roof</Link>
            </h1>
            <h1 className="font-bold text-2xl text-blue-600">
              <Link to="/">Scout</Link>
            </h1>
          </div>
        </nav>
      </header>

      <div className="flex items-start justify-center min-h-screen py-10 px-4">
        <div className="w-full md:w-[60%] lg:w-[50%] bg-white border-0 shadow-2xl rounded-lg">
          <div className="p-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold">Edit Your Profile</h1>
            <p className="text-gray-600">Update your photo and personal details here.</p>
          </div>
          <hr className="mx-4" />

          <div className="w-full flex flex-col md:flex-row p-4 md:p-8 gap-8">
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <div className="bg-gray-100 border-0 shadow-md h-[150px] w-[150px] rounded-full overflow-hidden">
                <img
                  id="profileImagePreview"
                  src={profileImage}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="pfp"
                  className="text-gray-600 font-semibold bg-gray-200 hover:bg-gray-300 py-2 px-6 rounded-lg cursor-pointer"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  id="pfp"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-700 font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="border-2 p-2 rounded w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="address" className="text-gray-700 font-semibold mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="border-2 p-2 rounded w-full"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="pno" className="text-gray-700 font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="pno"
                  className="border-2 p-2 rounded w-full"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="mail" className="text-gray-700 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="mail"
                  className="border-2 p-2 rounded w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="pass" className="text-gray-700 font-semibold mb-1">
                  Change Password
                </label>
                <input
                  type="password"
                  id="pass"
                  className="border-2 p-2 rounded w-full"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <hr className="mx-4" />

          <div className="flex flex-col sm:flex-row justify-end p-4 gap-4">
            <button
              id="backBtn"
              className="text-gray-700 font-semibold p-2 bg-gray-200 hover:bg-gray-300 rounded-xl w-full sm:w-auto"
              onClick={() => navigate('/userdashboard')}
            >
              Back to Dashboard
            </button>
            <button
              id="saveBtn"
              className="text-white font-semibold p-2 bg-blue-600 hover:bg-blue-700 rounded-xl w-full sm:w-auto"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

