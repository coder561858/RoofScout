import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function PG() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('editId');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    pgName: '',
    address: '',
    bestFor: 'boys',
    sharingType: 'single',
    price: '',
    amenities: {
      food: false,
      wifi: false,
      ac: false,
      laundry: false,
      power: false,
      housekeeping: false
    }
  });

  useEffect(() => {
    if (editId) {
      const userProperties = JSON.parse(localStorage.getItem('userProperties')) || [];
      const propertyToEdit = userProperties.find(prop => prop.id === Number(editId));
      
      if (propertyToEdit && propertyToEdit.type === 'PG') {
        setIsEditing(true);
        setFormData({
          pgName: propertyToEdit.title || '',
          address: propertyToEdit.address || '',
          bestFor: propertyToEdit.details?.includes('boys') ? 'boys' : 
                   propertyToEdit.details?.includes('girls') ? 'girls' : 'coliving',
          sharingType: propertyToEdit.details?.includes('Single') ? 'single' :
                       propertyToEdit.details?.includes('Double') ? 'double' :
                       propertyToEdit.details?.includes('Triple') ? 'triple' : '4+',
          price: propertyToEdit.price || '',
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
    const { pgName, address, bestFor, sharingType, price, amenities } = formData;
    const photos = e.target.pgPhotos?.files || [];

    let existingProperties = JSON.parse(localStorage.getItem('userProperties')) || [];

    if (isEditing) {
      const propertyIndex = existingProperties.findIndex(prop => prop.id === Number(editId));
      if (propertyIndex > -1) {
        existingProperties[propertyIndex] = {
          ...existingProperties[propertyIndex],
          title: pgName,
          address,
          details: `Best for ${bestFor}, ${sharingType} sharing`,
          price,
          amenities,
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
        type: 'PG',
        title: pgName,
        address,
        details: `Best for ${bestFor}, ${sharingType} sharing`,
        price,
        amenities,
        photoCount: photos.length,
        status: 'Pending Approval'
      };
      existingProperties.push(newProperty);
      alert('PG Listing Submitted and Saved!');
    }

    localStorage.setItem('userProperties', JSON.stringify(existingProperties));
    navigate('/userdashboard');
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-green-100 to-pink-200 min-h-screen">
      <div className="flex items-center justify-center my-10">
        <div className="w-full md:w-[50%] bg-white border-0 shadow-2xl rounded-lg">
          <div className="flex items-center justify-center text-2xl md:text-4xl font-bold pt-4">
            <h1 className="bg-gradient-to-r from-blue-700 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent mt-2">
              List Your PG / Co-Living Space
            </h1>
          </div>
          <div className="flex items-center justify-center mt-2 mb-8">
            <p className="text-gray-600">
              Fill out the details below to list your Paying Guest accommodation
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-blue-100 shadow-lg m-4 rounded-lg">
              <div className="text-2xl mt-4 p-4 text-gray-700 font-bold">
                <div className="flex gap-2">
                  <i className="ri-home-4-line"></i>
                  <p>Basic Information</p>
                </div>
              </div>
              <div className="flex flex-col text-gray-600 px-4 font-semibold">
                <label htmlFor="pgname">PG Name / Title</label>
                <input
                  type="text"
                  id="pgname"
                  className="border-2 rounded h-12 p-2"
                  value={formData.pgName}
                  onChange={(e) => setFormData({ ...formData, pgName: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col px-4 py-4">
                <label htmlFor="address" className="text-gray-600 font-semibold">Full Address</label>
                <textarea
                  name=""
                  id="address"
                  rows="3"
                  className="border-2 rounded p-2"
                  placeholder="Enter the full property address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="bg-green-100 shadow-lg m-4 pb-4 rounded-lg">
              <div className="text-2xl text-gray-700 font-bold p-4 mt-4">
                <div className="flex gap-2">
                  <i className="ri-price-tag-3-line"></i>
                  <p>Room & Pricing Details</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 px-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="bestfor" className="text-gray-600 font-semibold">Best For</label>
                  <select
                    name=""
                    id="bestfor"
                    className="border-2 rounded h-12 p-2"
                    value={formData.bestFor}
                    onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                    required
                  >
                    <option value="boys">Boys only</option>
                    <option value="girls">Girls only</option>
                    <option value="coliving">Co-Living (Unisex)</option>
                  </select>
                </div>

                <div className="flex flex-col w-full">
                  <label htmlFor="stype" className="text-gray-600 font-semibold">Sharing Type</label>
                  <select
                    name=""
                    id="stype"
                    className="border-2 rounded h-12 p-2"
                    value={formData.sharingType}
                    onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                    <option value="4+">4 or more</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-col w-full">
                  <label htmlFor="price" className="text-gray-600 font-semibold">Price per Bed (₹)</label>
                  <input
                    type="text"
                    id="price"
                    className="border-2 rounded h-12 p-2"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-100 shadow-lg m-4 rounded-lg">
              <div className="text-2xl text-gray-700 font-bold px-4 pt-4 mt-4">
                <div className="flex gap-2">
                  <i className="ri-service-line"></i>
                  <p>Amenities & Services</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
                <label htmlFor="food" className="flex gap-2">
                  <input
                    type="checkbox"
                    id="food"
                    checked={formData.amenities.food}
                    onChange={() => handleAmenityChange('food')}
                  />
                  Food Included
                </label>
                <label htmlFor="wifi" className="flex gap-2">
                  <input
                    type="checkbox"
                    id="wifi"
                    checked={formData.amenities.wifi}
                    onChange={() => handleAmenityChange('wifi')}
                  />
                  Wi-Fi
                </label>
                <label htmlFor="ac" className="flex gap-2">
                  <input
                    type="checkbox"
                    id="ac"
                    checked={formData.amenities.ac}
                    onChange={() => handleAmenityChange('ac')}
                  />
                  AC Rooms
                </label>
                <label htmlFor="laundry" className="flex gap-2">
                  <input
                    type="checkbox"
                    id="laundry"
                    checked={formData.amenities.laundry}
                    onChange={() => handleAmenityChange('laundry')}
                  />
                  Laundry Service
                </label>
                <label htmlFor="power" className="flex gap-2">
                  <input
                    type="checkbox"
                    id="power"
                    checked={formData.amenities.power}
                    onChange={() => handleAmenityChange('power')}
                  />
                  Power Backup
                </label>
                <label htmlFor="housekeeping" className="flex gap-2">
                  <input
                    type="checkbox"
                    id="housekeeping"
                    checked={formData.amenities.housekeeping}
                    onChange={() => handleAmenityChange('housekeeping')}
                  />
                  Housekeeping
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 m-4">
              <div className="text-2xl text-gray-700 font-bold px-4 mt-4">
                <div className="flex gap-2">
                  <i className="ri-image-add-line"></i>
                  <p>Upload Photos</p>
                </div>
              </div>
              <div className="text-blue-600 p-4 py-4">
                <input
                  type="file"
                  id="pgPhotos"
                  name="pgPhotos"
                  className="file:border-2 file:rounded file:text-white file:bg-black"
                  multiple
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 mx-auto flex justify-center px-6 pb-8">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-green-400 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl"
              >
                {isEditing ? 'Update Property' : 'Submit Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PG;

