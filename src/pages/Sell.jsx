import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function Sell() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('editId');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'plot',
    state: 'punjab', // Default state
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    description: ''
  });

  useEffect(() => {
    if (editId) {
      const userProperties = JSON.parse(localStorage.getItem('userProperties')) || [];
      const propertyToEdit = userProperties.find(prop => prop.id === Number(editId));
      
      if (propertyToEdit && propertyToEdit.type === 'Sell') {
        setIsEditing(true);
        setFormData({
          title: propertyToEdit.title || '',
          type: propertyToEdit.propertyType || 'plot',
          state: propertyToEdit.state || 'punjab',
          address: propertyToEdit.address || '',
          price: propertyToEdit.price || '',
          bedrooms: propertyToEdit.bedrooms || '',
          bathrooms: propertyToEdit.bathrooms || '',
          size: propertyToEdit.size || '',
          description: propertyToEdit.description || ''
        });
      }
    }
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, type, state, address, price, bedrooms, bathrooms, size, description } = formData;
    const photos = e.target.photos?.files || [];

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
          state: state,
          address,
          price,
          bedrooms,
          bathrooms,
          size,
          description,
          details: `${bedrooms} Bed, ${bathrooms} Bath, ${size} sqft`,
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
        type: 'Sell',
        title,
        propertyType: type,
        state: state.toLowerCase(),
        address,
        price,
        bedrooms,
        bathrooms,
        size,
        description,
        details: `${bedrooms} Bed, ${bathrooms} Bath, ${size} sqft`,
        photoCount: photos.length,
        owner: currentOwner,
        status: 'Active'
      };
      existingProperties.push(newProperty);
      alert('Property for Sale Submitted and Saved!');
    }

    localStorage.setItem('userProperties', JSON.stringify(existingProperties));
    navigate('/userdashboard');
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-green-100 to-pink-200 min-h-screen">
      <div className="flex items-start justify-center py-10">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl mx-4">
          <div className="px-6 py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-700 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
              List Your Property On RoofScout
            </h1>
            <p className="text-center text-gray-600 mt-2">
              Fill out the details below to put your property on the market.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-blue-100 shadow-inner m-4 rounded-lg">
              <div className="flex items-center gap-2 text-2xl mt-4 p-4 text-gray-700 font-bold">
                <i className="ri-home-4-line"></i>
                <p>Basic Information</p>
              </div>

              <div className="md:flex md:space-x-4">
                <div className="flex flex-col w-full p-4">
                  <label htmlFor="property-title" className="text-gray-700 font-semibold">
                    Property Title
                  </label>
                  <input
                    id="property-title"
                    type="text"
                    placeholder="eg. Modern 2BHK Apartment"
                    className="border-2 rounded h-12 p-2 w-full"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col w-full p-4">
                  <label htmlFor="listing-type" className="text-gray-700 font-semibold">
                    Property Type
                  </label>
                  <select
                    id="listing-type"
                    className="border-2 rounded h-12 p-2 w-full"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="plot">Plot / Land</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="builder-floor">Independent / Builder Floor</option>
                    <option value="villa">Independent House / Villa</option>
                  </select>
                </div>
              </div>

              {/* --- State Dropdown --- */}
              <div className="p-4">
                <label htmlFor="state" className="text-gray-700 font-semibold">State</label>
                <select
                  id="state"
                  className="border-2 rounded h-12 p-2 w-full"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                >
                  <option value="punjab">Punjab</option>
                  <option value="goa">Goa</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="haryana">Haryana</option>
                  <option value="delhi">Delhi</option>
                  <option value="maharashtra">Maharashtra</option>
                </select>
              </div>

              <div className="p-4">
                <label htmlFor="address" className="text-gray-700 font-semibold">Full Address</label>
                <textarea
                  id="address"
                  placeholder="Enter the full property address"
                  rows="3"
                  className="border-2 rounded p-2 w-full"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <hr className="my-6 mx-6" />

            <div className="bg-yellow-100 shadow-lg m-4 rounded-lg">
              <div className="flex gap-2 text-2xl mt-4 p-4 text-gray-700 font-bold">
                <i className="ri-price-tag-3-line"></i>
                <p>Details & Price</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pb-4">
                <div className="flex flex-col">
                  <label htmlFor="price" className="text-gray-700 font-semibold">Price (in ₹)</label>
                  <input
                    id="price"
                    type="text"
                    className="border-2 rounded h-12 p-2 w-full"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="bedrooms" className="text-gray-700 font-semibold">Bedrooms</label>
                  <input
                    id="bedrooms"
                    type="text"
                    className="border-2 rounded h-12 p-2 w-full"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="bathrooms" className="text-gray-700 font-semibold">Bathrooms</label>
                  <input
                    id="bathrooms"
                    type="text"
                    className="border-2 rounded h-12 p-2 w-full"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4">
                <label htmlFor="size" className="text-gray-700 font-semibold">
                  Total Size (in sq. ft.)
                </label>
                <input
                  id="size"
                  type="text"
                  className="border-2 rounded h-12 p-2 w-full"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  required
                />
              </div>

              <div className="p-4 pb-6">
                <label htmlFor="description" className="text-gray-700 font-semibold">Description</label>
                <textarea
                  id="description"
                  placeholder="Tell us more about your property..."
                  rows="3"
                  className="border-2 rounded p-2 w-full"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <hr className="my-6 mx-6" />

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 m-4 rounded-lg shadow-sm p-4">
              <div className="flex gap-2 items-center text-2xl text-gray-700 font-bold mb-4">
                <i className="ri-multi-image-line"></i>
                <p>Upload Photos</p>
              </div>

              <div className="p-4">
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full md:w-auto"
                />
              </div>

              <div className="flex justify-center px-6 pb-8">
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl active:scale-[.99] focus:outline-none focus:ring-4 focus:ring-emerald-400/40 transition"
                >
                  {isEditing ? 'Update Property' : 'Submit Property'}
                  <span className="text-white/90">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sell;