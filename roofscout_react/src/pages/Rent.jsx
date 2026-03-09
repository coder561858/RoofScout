import { useTheme } from '../hooks/useTheme';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { PropertyContext } from "../contexts/PropertyContext";
import { RentContext } from "../contexts/PropertyContextRent";
import { useContext } from "react";
import { Sun, Moon, Menu, Home, Tag, Wifi, Image } from 'lucide-react';
import { localAuth } from "../supabase";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

function formatINR(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${Number(val).toLocaleString('en-IN')}`;
}

// Price Input component
function PriceInput({ value, onValueChange, color = "blue" }) {
  const [text, setText] = useState(String(value));
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setText(String(value));
    }
  }, [value]);

  const commitText = () => {
    const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      onValueChange(parsed);
      setText(String(parsed));
    } else {
      setText(String(value));
    }
  };

  const gradients = { blue: "from-blue-500 to-cyan-500", emerald: "from-emerald-500 to-teal-500" };
  const focusRings = { blue: "focus:border-blue-500 focus:ring-blue-500/20", emerald: "focus:border-emerald-500 focus:ring-emerald-500/20" };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount in ₹</span>
        <span className={`font-bold text-lg bg-gradient-to-r ${gradients[color]} bg-clip-text text-transparent`}>
          {formatINR(value)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${color === "blue" ? "text-blue-500" : "text-emerald-500"}`}>₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={commitText}
          onKeyDown={e => e.key === 'Enter' && commitText()}
          placeholder="Enter amount..."
          className={`flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 text-lg font-semibold focus:outline-none ${focusRings[color]} focus:ring-2 transition-all shadow-sm`}
        />
      </div>
    </div>
  );
}

function Rent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProperties } = useContext(PropertyContext);
  const { refreshRentProperties } = useContext(RentContext);
  const editId = searchParams.get('editId');
  const [isEditing, setIsEditing] = useState(false);

  const [theme, setTheme] = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment / Flat',
    state: 'Punjab',
    address: '',
    bhk: '1 BHK',
    furnishing: 'Semi-Furnished',
    rent: 10000,
    deposit: 20000,
    amenities: {
      parking: false,
      ac: false,
      backup: false,
      kitchen: false,
      security: false,
      balcony: false,
    }
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (editId) {
      const userProperties = JSON.parse(localStorage.getItem('userProperties')) || [];
      const propertyToEdit = userProperties.find(p => p.id === Number(editId));
      if (propertyToEdit && propertyToEdit.type === 'Rent') {
        setIsEditing(true);
        setFormData({
          title: propertyToEdit.title || '',
          type: propertyToEdit.propertyType || 'Apartment / Flat',
          state: propertyToEdit.state || 'Punjab',
          address: propertyToEdit.address || '',
          bhk: propertyToEdit.bhk || '1 BHK',
          furnishing: propertyToEdit.furnishing || 'Semi-Furnished',
          rent: Number(propertyToEdit.price) || 10000,
          deposit: Number(propertyToEdit.deposit) || 20000,
          amenities: propertyToEdit.amenities || formData.amenities
        });
      }
    }
  }, [editId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAmenityToggle = (key) =>
    setFormData({ ...formData, amenities: { ...formData.amenities, [key]: !formData.amenities[key] } });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, type, state, address, bhk, furnishing, rent, deposit, amenities } = formData;
    const { data: sessionData } = localAuth.getSession();
    const session = sessionData.session;
    if (!session?.user) {
      alert("You must be logged in to list a property.");
      navigate("/login");
      return;
    }

    try {
      const propertyPayload = {
        title,
        type: type.toLowerCase(),
        listingType: "Rent",
        price: Number(rent),
        deposit: Number(deposit),
        bhk,
        furnishing,
        amenities,
        area: 0,
        bedrooms: parseInt(bhk) || 0,
        bathrooms: 0,
        state,
        address,
        description: `${bhk} ${furnishing} property for rent`,
        status: "Available",
        image: selectedImage || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        owner: {
          name: session.user.name || session.user.username,
          email: session.user.email,
          phone: "9876543210"
        },
        userId: session.user.id
      };

      const response = await fetch("http://localhost:5000/api/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Rental property submitted!");
        refreshRentProperties();
        navigate("/userdashboard");
      } else {
        alert(`Error: ${result.message || "Failed to save rental property."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving rental property due to network or server issue");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 " +
    "bg-white dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 " +
    "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 " +
    "focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400 dark:placeholder-gray-500";
  const labelCls = "block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5";

  const AMENITY_LABELS = {
    parking: { label: "Parking", icon: "🚗" },
    ac: { label: "Air Conditioning", icon: "❄️" },
    backup: { label: "Power Backup", icon: "⚡" },
    kitchen: { label: "Kitchen", icon: "🍳" },
    security: { label: "Security", icon: "🔒" },
    balcony: { label: "Balcony", icon: "🌿" },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gray-900 text-gray-100'
      : 'bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-50'
      }`}>

      <nav className={`sticky top-0 z-50 flex justify-between items-center h-16 px-6 backdrop-blur-lg shadow-sm border-b transition-colors ${theme === 'dark' ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/70 border-gray-200/60'
        }`}>
        <div className="flex items-center gap-4">
          <Link to="/userdashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logoRS.jpg" className="h-9 w-9 rounded-full ring-2 ring-yellow-400/40" alt="RoofScout" />
            <div>
              <p className="text-base font-extrabold leading-none">
                <span className="text-yellow-500">Roof</span>
                <span className="text-blue-600 dark:text-teal-400">Scout</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Rent Property</p>
            </div>
          </Link>
        </div>
        <button
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${theme === 'dark'
            ? 'bg-gray-700/60 border-gray-600 text-yellow-300 hover:bg-gray-600/60'
            : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </nav>

      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              {isEditing ? 'Edit Rental Listing' : 'List Your Property for Rent'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Provide the details below to find the perfect tenant — completely free.
            </p>
          </div>

          <div className={`rounded-3xl shadow-xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/60' : 'bg-white/90 border-gray-200/60'
            }`}>
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <SectionCard color="blue" icon={Home} title="Property Details">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className={labelCls}>Property Title</label>
                      <input
                        id="title" type="text" required
                        placeholder="e.g., Cozy 2BHK in Bandra"
                        className={inputCls}
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className={labelCls}>Property Type</label>
                      <select id="type" className={inputCls} value={formData.type} onChange={handleChange} required>
                        <option>Apartment / Flat</option>
                        <option>Independent House / Villa</option>
                        <option>Builder Floor</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="state" className={labelCls}>State</label>
                      <select id="state" className={inputCls} value={formData.state} onChange={handleChange} required>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="bhk" className={labelCls}>BHK Type</label>
                      <select id="bhk" className={inputCls} value={formData.bhk} onChange={handleChange} required>
                        <option>1 BHK</option>
                        <option>2 BHK</option>
                        <option>3 BHK</option>
                        <option>4+ BHK</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="address" className={labelCls}>Full Address</label>
                    <textarea
                      id="address" rows="3" required
                      placeholder="Enter full address including city and pincode"
                      className={`${inputCls} resize-none`}
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </SectionCard>

                <SectionCard color="green" icon={Tag} title="Rental & Configuration">
                  <div className="mb-1">
                    <label htmlFor="furnishing" className={labelCls}>Furnishing Status</label>
                    <select id="furnishing" className={inputCls} value={formData.furnishing} onChange={handleChange} required>
                      <option>Semi-Furnished</option>
                      <option>Fully-Furnished</option>
                      <option>Unfurnished</option>
                    </select>
                  </div>

                  <div className="mt-4 space-y-5">
                    <div>
                      <label className={labelCls}>Monthly Rent</label>
                      <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-700/30" : "bg-blue-50/50"} border ${theme === "dark" ? "border-gray-600/40" : "border-blue-100/60"} transition-all`}>
                        <PriceInput
                          value={formData.rent}
                          onValueChange={v => setFormData({ ...formData, rent: v })}
                          color="blue"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Security Deposit</label>
                      <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-700/30" : "bg-emerald-50/50"} border ${theme === "dark" ? "border-gray-600/40" : "border-emerald-100/60"} transition-all`}>
                        <PriceInput
                          value={formData.deposit}
                          onValueChange={v => setFormData({ ...formData, deposit: v })}
                          color="emerald"
                        />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard color="amber" icon={Wifi} title="Amenities">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(AMENITY_LABELS).map(([key, { label, icon }]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleAmenityToggle(key)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${formData.amenities[key]
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                      >
                        <span>{icon}</span>{label}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard color="purple" icon={Image} title="Upload Photos">
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${theme === 'dark' ? 'border-gray-600 hover:border-purple-400/60' : 'border-gray-300 hover:border-purple-400'
                    }`}>
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Upload property photo</p>
                    <input
                      type="file" id="propertyPhotos" name="propertyPhotos" accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                                  file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-purple-100 file:text-purple-700
                                  hover:file:bg-purple-200
                                  dark:file:bg-purple-900/50 dark:file:text-purple-300
                                  dark:hover:file:bg-purple-800/50 cursor-pointer"
                    />
                    {selectedImage && (
                      <div className="mt-4 relative inline-block">
                        <img src={selectedImage} alt="Preview" className="h-32 w-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-600" />
                        <button
                          type="button"
                          onClick={() => setSelectedImage(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:scale-[.99] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {isEditing ? 'Update Rental' : 'Submit Rental Listing'}
                  <span className="text-lg">→</span>
                </button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                  By submitting, you agree to our Terms of Service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ color, icon: Icon, title, children }) {
  const colors = {
    blue: "from-blue-500/10 to-cyan-500/5 border-blue-200/60 dark:border-blue-800/40",
    green: "from-emerald-500/10 to-teal-500/5 border-emerald-200/60 dark:border-emerald-800/40",
    amber: "from-amber-500/10 to-orange-500/5 border-amber-200/60 dark:border-amber-800/40",
    purple: "from-purple-500/10 to-pink-500/5 border-purple-200/60 dark:border-purple-800/40",
  };
  const iconColors = { blue: "text-blue-500", green: "text-emerald-500", amber: "text-amber-500", purple: "text-purple-500" };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${colors[color]} p-6 mb-4`}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={20} className={iconColors[color]} />
        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default Rent;