import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// PROPERTY MAP
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

// SAFE JSON PARSER
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

  // PROPERTY STATE
  const [propertyData, setPropertyData] = useState({
    title: 'Property Description',
    priceText: '₹ 1000',
    desc: 'Default description.',
    address: 'Unknown',
    location: '-',
    type: '-',
    area: '-',
    beds: '-',
    baths: '-',
    garages: '-',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    houseId: '-',
    owner: 'Unknown'
  });

  // FORM STATE
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

  // LOAD PROPERTY INFO
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

    if (q.title || q.desc || q.image || q.priceText || q.owner) {
      setPropertyData(prev => ({
        ...prev,
        title: q.title || prev.title,
        priceText: q.priceText || prev.priceText,
        desc: q.desc || prev.desc,
        address: q.address || prev.address,
        location: q.location || prev.location,
        type: q.type ? q.type.charAt(0).toUpperCase() + q.type.slice(1) : prev.type,
        area: q.area || prev.area,
        beds: q.beds !== null && q.beds !== undefined ? String(q.beds) : prev.beds,
        baths: q.baths !== null && q.baths !== undefined ? String(q.baths) : prev.baths,
        garages: q.garages !== null && q.garages !== undefined ? String(q.garages) : prev.garages,
        image: q.image || prev.image,
        houseId: houseId || prev.houseId,
        owner: q.owner || prev.owner
      }));
    } else if (houseId && DATA[houseId]) {
      const d = DATA[houseId];
      setPropertyData({
        title: d.title,
        priceText: d.priceText,
        desc: d.desc,
        address: d.address,
        location: d.location,
        type: d.type,
        area: d.area,
        beds: d.beds,
        baths: d.baths,
        garages: d.garages,
        image: d.image,
        houseId,
        owner: d.owner
      });
    }
  }, [searchParams]);

  // TOUR BUTTON LOGIC
  const handleTourClick = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please enter your Name and Message first!');
      return;
    }
    setShowTourMenu(!showTourMenu);
    setShowTimeWrapper(true);
    setShowRequestBtn(true);
  };

  const handleTourSelect = (tour) => {
    setSelectedTour(tour);
    setShowTourMenu(false);
  };

  const handleTimeClick = () => {
    setShowTimeMenu(!showTimeMenu);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimeMenu(false);
  };

  const handleRequestTour = (e) => {
    e.preventDefault();

    if (selectedTime === 'Select Time') {
      alert("Please select a valid time!");
      return;
    }

    const buyerName = sessionStorage.getItem("loggedUser");

    if (!buyerName) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    if (buyerName === propertyData.owner) {
      alert("You cannot request a tour on your own property.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      propertyId: propertyData.houseId,
      buyerName,
      requestDate: new Date().toISOString(),
      tourDate: selectedTour,
      tourTime: selectedTime,
      status: "Pending"
    };

    const allRequests = getStoredJSON('allTourRequests');

    const exists = allRequests.some(
      (r) => r.propertyId === propertyData.houseId && r.buyerName === buyerName
    );

    if (exists) {
      alert("You already requested a tour for this property.");
      return;
    }

    allRequests.push(newRequest);
    localStorage.setItem('allTourRequests', JSON.stringify(allRequests));

    alert(`Tour request sent successfully for ${selectedTour} at ${selectedTime}!`);
    setShowRequestBtn(false);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert("Please fill Name & Message");
      return;
    }
    alert("Message sent successfully!");
  };

  const propertyStatus =
    propertyData.priceText?.toLowerCase().includes('/month') ? 'Rent' : 'Sale';

  const extractStateFromTitle = (title) => {
    if (!title) return "-";
    const parts = title.split(",");
    return parts[parts.length - 1].trim();
  };

  const stateFromTitle = extractStateFromTitle(propertyData.title);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors">
      <Navbar />

      {/* BREADCRUMB */}
      <div className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link> /{' '}
        <Link to="/allproperties" className="hover:text-black dark:hover:text-white">Properties</Link> /{' '}
        <span>{propertyData.title}</span>
      </div>

      {/* IMAGE */}
      <section className="w-full md:w-1/2 mx-auto mt-4">
        <img
          src={propertyData.image}
          alt={propertyData.title}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
      </section>

      {/* MAIN CONTENT */}
      <section className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">

        {/* LEFT */}
        <div className="flex-1">
          <div className="flex items-center text-green-600 text-3xl font-bold mb-4">
            {propertyData.priceText}
          </div>
          <h2 className="text-2xl font-semibold mb-2">{propertyData.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">{propertyData.desc}</p>

          <p className="mt-4">
            <span className="font-semibold">Address:</span> {propertyData.address}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="w-full lg:w-1/3 border-2 border-gray-400 dark:border-gray-600 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-center">Quick Summary</h3>

          <ul className="space-y-2">
            <li><span className="font-semibold">Property ID:</span> {propertyData.houseId}</li>
            <li><span className="font-semibold">Location:</span> {stateFromTitle}</li>
            <li><span className="font-semibold">Type:</span> {propertyData.type}</li>
            <li><span className="font-semibold">Status:</span> {propertyStatus}</li>
            <li><span className="font-semibold">Area:</span> {propertyData.area}</li>
            <li><span className="font-semibold">Beds:</span> {propertyData.beds}</li>
            <li><span className="font-semibold">Baths:</span> {propertyData.baths}</li>
            <li><span className="font-semibold">Garages:</span> {propertyData.garages}</li>
          </ul>
        </div>

      </section>

      {/* OWNER + ENQUIRY BOX */}
      <div className="max-w-6xl mx-auto 
        bg-white dark:bg-gray-800 
        text-gray-800 dark:text-gray-100 
        p-8 md:p-10 shadow-lg rounded-2xl 
        flex flex-col md:flex-row gap-10 my-10 transition-colors">

        {/* LEFT OWNER DETAILS */}
        <div className="w-full md:w-5/12 pr-6 
        md:border-r border-gray-200 dark:border-gray-700 
        space-y-4 transition-colors">

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
            Owner Details
          </h2>

          <div className="flex items-start space-x-4">
            <div className="w-[80px] h-[100px] flex-shrink-0 rounded-md overflow-hidden shadow-sm">
              <img src="/image.png" className="max-w-[90px] absolute z-50 rounded-2xl" alt="Owner" />
            </div>

            <div className="flex flex-col space-y-1">
              <h3 className="text-lg font-bold text-blue-600 py-6">BOB</h3>
              
            </div>
          </div>

          <div className="pt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              <span className="font-semibold text-gray-600 dark:text-gray-400">Properties Listed:</span>{' '}
              <span className="font-bold text-gray-900 dark:text-gray-200">3</span>
            </p>

            <p>
              <span className="font-semibold text-gray-600 dark:text-gray-400">Localities:</span>{' '}
              <span className="text-gray-800 dark:text-gray-200">Kalwa, Baran, Hardaspur, Heera Bagh</span>
            </p>

            <p>
              <span className="font-semibold text-gray-600 dark:text-gray-400">Address:</span>{' '}
              <span className="text-gray-800 dark:text-gray-200">A Tarik Adalat Bazar, Patiala</span>
            </p>
          </div>
        </div>

        {/* RIGHT ENQUIRY FORM */}
        <div className="w-full md:w-7/12 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-300 dark:border-gray-700 pb-2">
            Send Enquiry to Owner
          </h2>

          <form id="enquiryForm" className="space-y-5 text-sm" onSubmit={handleSendEmail}>

            {/* YOU ARE */}
            <div className="flex flex-wrap items-center gap-6 text-gray-700 dark:text-gray-300">
              <span className="font-medium">You are</span>
              <label className="flex items-center space-x-2">
                <input type="radio" name="user_type" value="individual"
                  checked={formData.userType === 'individual'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })} />
                <span>Individual</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="user_type" value="dealer"
                  checked={formData.reasonToBuy === 'dealer'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })} />
                <span>Dealer</span>
              </label>
            </div>

            {/* REASON TO BUY */}
            <div className="flex flex-wrap items-center gap-6 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Your reason to buy is</span>

              <label className="flex items-center space-x-2">
                <input type="radio" name="reason_to_buy" value="investment"
                  checked={formData.reasonToBuy === 'investment'}
                  onChange={(e) => setFormData({ ...formData, reasonToBuy: e.target.value })} />
                <span>Investment</span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="radio" name="reason_to_buy" value="self_use"
                  checked={formData.reasonToBuy === 'self_use'}
                  onChange={(e) => setFormData({ ...formData, reasonToBuy: e.target.value })} />
                <span>Self Use</span>
              </label>
            </div>

            {/* NAME + MESSAGE */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full md:w-5/12 border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                  p-2 h-12 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <div className="relative w-full md:w-7/12">
                <textarea
                  id="area"
                  name="message"
                  placeholder="I am interested in this property."
                  className="w-full h-32 border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                    p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <span className="absolute bottom-1 right-2 text-xs text-gray-400">Max 400 chars</span>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="sm:w-2/12 border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                  p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                  p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* CHECKBOX */}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <label className="flex items-start space-x-2">
                <input type="checkbox" defaultChecked className="mt-1" />
                <span>I agree to the{' '}
                  <a className="text-blue-600 dark:text-blue-400 underline">Terms</a> and{' '}
                  <a className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* BUTTON SET INCLUDING REQUEST TOUR */}
            <div className="flex flex-wrap gap-4 items-center">

              {/* SEND EMAIL */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white 
                  py-2.5 px-8 rounded-md text-sm shadow-lg">
                Send Email & SMS
              </button>

              {/* TOUR SELECT DROPDOWN */}
              <div className="relative inline-block">
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md"
                  onClick={handleTourClick}
                >
                  {selectedTour}
                </button>

                {showTourMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-lg z-10">
                    {['Today', 'Tomorrow', 'Next Week'].map((t) => (
                      <a
                        key={t}
                        className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTourSelect(t);
                        }}
                      >
                        {t}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* TIME SELECT DROPDOWN */}
              {showTimeWrapper && (
                <div className="relative inline-block">
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md"
                    onClick={handleTimeClick}
                  >
                    {selectedTime}
                  </button>

                  {showTimeMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-md shadow-lg z-10">
                      {['10:00 AM', '12:30 PM', '03:00 PM', '05:30 PM'].map((time) => (
                        <a
                          key={time}
                          className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handleTimeSelect(time);
                          }}
                        >
                          {time}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FINAL REQUEST BUTTON */}
              {showRequestBtn && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-semibold"
                  onClick={handleRequestTour}
                >
                  Request
                </button>
              )}

            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ViewDetail;
