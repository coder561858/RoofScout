import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Rent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('editId');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment / Flat',
    state: 'punjab', // --- (NEW) Default State ---
    address: '',
    bhk: '1 BHK',
    furnishing: 'Semi-Furnished',
    rent: '',
    deposit: '',
    amenities: {
      parking: false,
      ac: false,
      backup: false,
      kitchen: false,
      security: false,
      balcony: false
    }
  });

  useEffect(() => {
    if (editId) {
      const userProperties = JSON.parse(localStorage.getItem('userProperties')) || [];
      const propertyToEdit = userProperties.find(prop => prop.id === Number(editId));
      
      if (propertyToEdit && propertyToEdit.type === 'Rent') {
        setIsEditing(true);
        setFormData({
          title: propertyToEdit.title || '',
          type: propertyToEdit.propertyType || 'Apartment / Flat',
          state: propertyToEdit.state || 'punjab', // Load state
          address: propertyToEdit.address || '',
          bhk: propertyToEdit.bhk || '1 BHK',
          furnishing: propertyToEdit.furnishing || 'Semi-Furnished',
          rent: propertyToEdit.price || '',
          deposit: propertyToEdit.deposit || '',
          amenities: propertyToEdit.amenities || formData.amenities
        });
      }
    }
  }, [editId]);

  const handleAmenityChange = (amenity) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity]
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, type, state, address, bhk, furnishing, rent, deposit, amenities } = formData;
    const photos = e.target.propertyPhotos?.files || [];

    // --- (FIX 1) Authentication Check ---
    const currentOwner = sessionStorage.getItem('loggedUser');
    if (!currentOwner) {
      alert('You must be logged in to list a property.');
      navigate('/login');
      return;
    }

    let existingProperties = JSON.parse(localStorage.getItem('userProperties')) || [];

    if (isEditing) {
      const propertyIndex = existingProperties.findIndex(prop => prop.id === Number(editId));
      if (propertyIndex > -1) {
        existingProperties[propertyIndex] = {
          ...existingProperties[propertyIndex],
          title,
          propertyType: type,
          state: state, // Update state
          address,
          bhk,
          furnishing,
          price: rent,
          deposit,
          amenities,
          details: `${bhk}, ${furnishing}`,
          photoCount: photos.length > 0 ? photos.length : existingProperties[propertyIndex].photoCount
        };
        alert('Property Updated Successfully!');
      } else {
        alert('Error: Could not update property.');
        return;
      }
    } else {
      const newProperty = {
        id: Date.now(),
        type: 'Rent',
        title,
        propertyType: type,
        state: state.toLowerCase(), // Save state
        address,
        bhk,
        furnishing,
        price: rent,
        deposit,
        amenities,
        details: `${bhk}, ${furnishing}`,
        photoCount: photos.length,
        owner: currentOwner, // Save Owner
        status: 'Active'
      };
      existingProperties.push(newProperty);
      alert('Property for Rent Submitted and Saved!');
    }

    localStorage.setItem('userProperties', JSON.stringify(existingProperties));
    navigate('/userdashboard');
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-300 to-blue-100 min-h-screen">
      <div className="flex items-center justify-center py-10 px-4">
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-2xl">
          <div className="text-center p-6">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              List Your Property for Rent
            </h1>
            <p className="text-gray-600 mt-2">Provide the details below to find the perfect tenant.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-blue-100 shadow-lg m-4 rounded-lg p-4">
              <div className="text-2xl text-gray-700 font-bold flex items-center gap-2">
                <i className="ri-home-heart-line"></i>
                <p>Property Details</p>
              </div>
              <hr className="my-3 border-blue-200" />

              <div className="flex flex-col md:flex-row w-full gap-4">
                <div className="w-full flex flex-col">
                  <label htmlFor="propertyTitle" className="font-semibold text-gray-600 mb-1">
                    Property Title
                  </label>
                  <input
                    type="text"
                    id="propertyTitle"
                    placeholder="e.g., Modern 2BHK Apartment"
                    className="p-2 border-2 rounded h-12"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="propertyType" className="font-semibold text-gray-600 mb-1">
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    className="border-2 h-12 rounded p-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option>Apartment / Flat</option>
                    <option>Independent House / Villa</option>
                    <option>Builder Floor</option>
                  </select>
                </div>
              </div>

              {/* --- (NEW) State Dropdown --- */}
              <div className="flex flex-col mt-4">
                <label htmlFor="state" className="font-semibold text-gray-600 mb-1">State</label>
                <select
                  id="state"
                  className="border-2 h-12 rounded p-2"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                >
                  <option value="punjab">Punjab</option>
                  <option value="goa">Goa</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="haryana">Haryana</option>
                  <option value="delhi">Delhi</option>
                  {/* Add others */}
                </select>
              </div>

              <div className="flex flex-col mt-4">
                <label htmlFor="propertyAddress" className="font-semibold text-gray-600 mb-1">
                  Full Address
                </label>
                <textarea
                  id="propertyAddress"
                  rows="3"
                  className="border-2 p-2 rounded"
                  placeholder="Enter full address including city and pin code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="bg-green-100 shadow-lg m-4 rounded-lg p-4">
              <div className="text-2xl text-gray-700 font-bold flex items-center gap-2">
                <i className="ri-price-tag-3-line"></i>
                <p>Rental & Configuration</p>
              </div>
              <hr className="my-3 border-green-200" />

              <div className="flex flex-col md:flex-row w-full gap-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="bhkType" className="font-semibold text-gray-600 mb-1">BHK Type</label>
                  <select
                    id="bhkType"
                    className="border-2 rounded h-12 p-2"
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    required
                  >
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4+ BHK</option>
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="furnishingStatus" className="font-semibold text-gray-600 mb-1">
                    Furnishing
                  </label>
                  <select
                    id="furnishingStatus"
                    className="border-2 rounded h-12 p-2"
                    value={formData.furnishing}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                    required
                  >
                    <option>Semi-Furnished</option>
                    <option>Fully-Furnished</option>
                    <option>Unfurnished</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="monthlyRent" className="font-semibold text-gray-600 mb-1">
                    Monthly Rent (₹)
                  </label>
                  <input
                    type="text"
                    id="monthlyRent"
                    className="border-2 rounded h-12 p-2"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="securityDeposit" className="font-semibold text-gray-600 mb-1">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="text"
                    id="securityDeposit"
                    className="border-2 rounded h-12 p-2"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-100 shadow-lg m-4 rounded-lg p-4">
              <div className="text-2xl text-gray-700 font-bold flex items-center gap-2">
                <i className="ri-service-line"></i>
                <p>Amenities</p>
              </div>
              <hr className="my-3 border-yellow-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="amenityParkingRent"
                    checked={formData.amenities.parking}
                    onChange={() => handleAmenityChange('parking')}
                  />
                  Parking
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="amenityACRent"
                    checked={formData.amenities.ac}
                    onChange={() => handleAmenityChange('ac')}
                  />
                  Air Conditioning
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="amenityBackupRent"
                    checked={formData.amenities.backup}
                    onChange={() => handleAmenityChange('backup')}
                  />
                  Power Backup
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="amenityKitchenRent"
                    checked={formData.amenities.kitchen}
                    onChange={() => handleAmenityChange('kitchen')}
                  />
                  Modular Kitchen
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="amenitySecurityRent"
                    checked={formData.amenities.security}
                    onChange={() => handleAmenityChange('security')}
                  />
                  Gated Security
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="amenityBalconyRent"
                    checked={formData.amenities.balcony}
                    onChange={() => handleAmenityChange('balcony')}
                  />
                  Balcony
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 m-4 p-4">
              <div className="text-2xl text-gray-700 font-bold flex items-center gap-2">
                <i className="ri-image-add-line"></i>
                <p>Upload Photos</p>
              </div>
              <hr className="my-3 border-purple-200" />
              <div className="mt-4">
                <input
                  type="file"
                  id="propertyPhotos"
                  name="propertyPhotos"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  multiple
                />
              </div>
            </div>

            <div className="w-full flex justify-center p-6">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl"
              >
                {isEditing ? 'Update Property' : 'Submit Property'}
                <span className="text-white/90">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Rent;