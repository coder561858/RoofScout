import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// PROPERTY MAP (STATIC FALLBACK)
const DATA = {
  '4060': {
    title: 'Mansa, Punjab',
    priceText: '₹2-10 Cr',
    desc: 'Spacious property in Mansa with good connectivity and amenities.',
    address: 'Mansa, Punjab',
    location: 'Mansa, Punjab',
    type: 'House',
    area: '2200 sqft',
    owner: 'Admin',
    image: '/house1pb.jpg',
    beds: 4,
    baths: 3,
    garages: 2
  },
  '4061': {
    title: '405 Dera Bassi, Punjab',
    priceText: '₹5-19 Cr',
    desc: 'Large family home in Dera Bassi with expansive grounds.',
    address: '405 Dera Bassi, Punjab',
    location: 'Dera Bassi, Punjab',
    type: 'House',
    area: '3500 sqft',
    owner: 'Admin',
    image: '/house2pb.jpg',
    beds: 5,
    baths: 4,
    garages: 3
  },
  '4062': {
    title: '324 Tara Place, Punjab',
    priceText: '₹50-90 Lacs',
    desc: 'Comfortable home at Tara Place, ideal for small families.',
    address: '324 Tara Place, Punjab',
    location: 'Tara Place, Punjab',
    type: 'House',
    area: '1200 sqft',
    owner: 'Admin',
    image: '/house3pb.jpg',
    beds: 2,
    baths: 1,
    garages: 1
  },
  '5060': {
    title: 'Mansa Plot, Punjab',
    priceText: '₹5 Cr',
    desc: 'Open plot in Mansa suitable for development.',
    address: 'Mansa, Punjab',
    location: 'Mansa, Punjab',
    type: 'Plot',
    area: '5000 sqft',
    owner: 'Admin',
    image: 'https://th.bing.com/th/id/OIP.rtBKbxWD-cO_JbfK9Rl8KgHaFj?w=222&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  }
};

// SAFE JSON LOCALSTORAGE PARSER
const getStoredJSON = (key, defaultVal = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

function ViewDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // PROPERTY DATA
  const [propertyData, setPropertyData] = useState({
    title: '',
    priceText: '',
    desc: '',
    address: '',
    location: '',
    type: '',
    area: '',
    beds: '',
    baths: '',
    garages: '',
    image: '',
    houseId: '',
    owner: 'Unknown'
  });

  // FIXED PHONE NUMBER LOGIC
  const FIXED_PHONE = "9123456789";
  const [phoneVisible, setPhoneVisible] = useState(false);

  // FORM DATA
  const [formData, setFormData] = useState({
    userType: '',
    reasonToBuy: '',
    name: '',
    message: '',
    countryCode: '+91',
    phone: ''
  });

  // TOUR STATES
  const [showTourMenu, setShowTourMenu] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [selectedTour, setSelectedTour] = useState('Request a Tour');
  const [selectedTime, setSelectedTime] = useState('Select Time');
  const [showTimeWrapper, setShowTimeWrapper] = useState(false);
  const [showRequestBtn, setShowRequestBtn] = useState(false);

  // LOAD PARAMS
  useEffect(() => {
    const houseId = searchParams.get('houseId');

    const q = {
      title: searchParams.get('title'),
      desc: searchParams.get('desc'),
      address: searchParams.get('address'),
      priceText: searchParams.get('priceText'),
      image: searchParams.get('image'),
      owner: searchParams.get('owner'),
      location: searchParams.get('location') || searchParams.get('district'),
      type: searchParams.get('type'),
      area: searchParams.get('area'),
      beds: searchParams.get('beds'),
      baths: searchParams.get('baths'),
      garages: searchParams.get('garages')
    };

    if (q.title) {
      setPropertyData({
        title: q.title,
        priceText: q.priceText,
        desc: q.desc,
        address: q.address,
        location: q.location,
        type: q.type,
        area: q.area,
        beds: q.beds,
        baths: q.baths,
        garages: q.garages,
        image: q.image,
        houseId,
        owner: q.owner
      });
    } else if (houseId && DATA[houseId]) {
      setPropertyData({ houseId, ...DATA[houseId] });
    }
  }, [searchParams]);

  // OWNER STATS
  const [ownerStats, setOwnerStats] = useState({
    totalProperties: 0,
    localities: [],
    address: ""
  });

  useEffect(() => {
    if (!propertyData.owner) return;

    let allProps = getStoredJSON("allProperties", []);

    allProps.push({
      owner: propertyData.owner,
      location: propertyData.location,
      address: propertyData.address
    });

    const owned = allProps.filter(
      p => (p.owner || "").toLowerCase() === propertyData.owner.toLowerCase()
    );

    const loc = [...new Set(owned.map(p => p.location).filter(Boolean))];

    setOwnerStats({
      totalProperties: owned.length,
      localities: loc,
      address: owned[0]?.address || propertyData.address
    });
  }, [propertyData.owner]);

  // TOUR LOGIC
  const handleTourClick = () => {
    if (!formData.name.trim() || !formData.message.trim()) {
      alert("Enter name and message first!");
      return;
    }
    setShowTourMenu(true);
    setShowTimeWrapper(true);
    setShowRequestBtn(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    alert("Message Sent!");
  };

  const handleRequestTour = () => {
    alert("Tour Request Sent!");
  };

  const propertyStatus =
    propertyData.priceText?.toLowerCase().includes("/month") ? "Rent" : "Sale";

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Navbar />

      {/* BREADCRUMB */}
      <div className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/">Home</Link> / <Link to="/allproperties">Properties</Link> /{" "}
        <span>{propertyData.title}</span>
      </div>

      {/* MAIN IMAGE */}
      <section className="w-full md:w-1/2 mx-auto mt-4">
        <img
          src={propertyData.image}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
      </section>

      {/* MAIN DETAILS */}
      <section className="max-w-6xl mx-auto p-6 md:p-8 flex lg:flex-row flex-col gap-10">
        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-3xl text-green-600 font-bold">{propertyData.priceText}</h1>
          <h2 className="text-2xl font-semibold mt-2">{propertyData.title}</h2>
          <p className="mt-2">{propertyData.desc}</p>

          <p className="mt-4">
            <strong>Address:</strong> {propertyData.title}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="w-full lg:w-1/3 p-4 border-2 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-center mb-4">Quick Summary</h3>

          <ul className="space-y-2">
            <li><strong>Property ID:</strong> {propertyData.houseId}</li>
            <li><strong>Location:</strong> {propertyData.location}</li>
            <li><strong>Type:</strong> {propertyData.type}</li>
            <li><strong>Status:</strong> {propertyStatus}</li>
            <li><strong>Area:</strong> {propertyData.area}</li>
            <li><strong>Beds:</strong> {propertyData.beds}</li>
            <li><strong>Baths:</strong> {propertyData.baths}</li>
            <li><strong>Garages:</strong> {propertyData.garages}</li>
          </ul>
        </div>
      </section>

      {/* OWNER + ENQUIRY */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-10">

        {/* OWNER BOX */}
        <div className="w-full md:w-5/12 pr-6 border-r dark:border-gray-700">
          <h2 className="text-2xl font-semibold border-b pb-2">Owner Details</h2>

          <div className="flex items-start gap-4 mt-4">
            <img src="/image.png" className="w-[80px] h-[100px] rounded-xl" />

            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-blue-600">{propertyData.owner}</h3>

              {/* PHONE NUMBER + UNDO */}
              {!phoneVisible ? (
                <button
                  className="bg-teal-500 text-white px-4 py-1.5 rounded text-sm"
                  onClick={() => setPhoneVisible(true)}
                >
                  View Phone Number
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-semibold text-green-600">
                    📞 {FIXED_PHONE}
                  </div>

                  <button
                    className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded text-xs"
                    onClick={() => setPhoneVisible(false)}
                  >
                    Hide
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm space-y-2">
            <p><strong>Properties Listed:</strong> {ownerStats.totalProperties}</p>
            <p><strong>Localities:</strong> {ownerStats.localities.join(", ") || "N/A"}</p>
            <p><strong>Address:</strong> {ownerStats.address || "Not Provided"}</p>
          </div>
        </div>

        {/* ENQUIRY FORM */}
        <div className="w-full md:w-7/12 space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2">Send Enquiry to Owner</h2>

          <form className="space-y-5 text-sm" onSubmit={handleSendEmail}>
            <div className="flex gap-4 items-center">
              <span>You are</span>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="individual"
                  checked={formData.userType === 'individual'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                />
                Individual
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="dealer"
                  checked={formData.userType === 'dealer'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                />
                Dealer
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full md:w-5/12 border p-2 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <textarea
                className="w-full md:w-7/12 border p-2 h-32 rounded resize-none"
                placeholder="I am interested in this property."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="sm:w-2/12 border p-2 rounded"
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              >
                <option value="+91">IND (+91)</option>
                <option value="+1">US (+1)</option>
                <option value="+44">UK (+44)</option>
              </select>

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border p-2 rounded"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-md"
            >
              Apply Property
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ViewDetail;
