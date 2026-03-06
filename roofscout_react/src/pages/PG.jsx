import { useTheme } from '../hooks/useTheme';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { PropertyContext } from "../contexts/PropertyContext";
import { RentContext } from "../contexts/PropertyContextRent";
import { useContext } from "react";
import { Sun, Moon, Menu, Home, Tag, Wifi } from 'lucide-react';
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
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${Number(val).toLocaleString('en-IN')}`;
}

// Price Input component
function PriceInput({ value, onValueChange }) {
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

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monthly Rent in ₹</span>
        <span className="font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {formatINR(value)}<span className="text-sm text-gray-400 font-normal">/mo per bed</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-purple-500">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={commitText}
          onKeyDown={e => e.key === 'Enter' && commitText()}
          placeholder="Enter rent..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 text-lg font-semibold focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
        />
      </div>
    </div>
  );
}

function PG() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProperties } = useContext(PropertyContext);
  const { refreshRentProperties } = useContext(RentContext);
  const editId = searchParams.get('editId');
  const [isEditing, setIsEditing] = useState(false);

  const [theme, setTheme] = useTheme();

  const [formData, setFormData] = useState({
    pgName: '',
    state: 'Punjab',
    address: '',
    bestFor: 'boys',
    sharingType: 'single',
    price: 6000,
    amenities: {
      food: false,
      wifi: false,
      ac: false,
      laundry: false,
      power: false,
      housekeeping: false,
    }
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAmenityToggle = (key) =>
    setFormData({ ...formData, amenities: { ...formData.amenities, [key]: !formData.amenities[key] } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { pgName, state, address, bestFor, sharingType, price, amenities } = formData;
    const { data: sessionData } = localAuth.getSession();
    const session = sessionData.session;
    if (!session?.user) {
      alert("You must be logged in to list a PG.");
      navigate("/login");
      return;
    }

    try {
      const propertyPayload = {
        title: pgName,
        type: "pg",
        listingType: "Rent",
        price: Number(price),
        bhk: sharingType,
        furnishing: "Fully-Furnished",
        amenities,
        area: 0,
        bedrooms: 1,
        bathrooms: 1,
        state,
        address,
        description: `${bestFor} ${sharingType} sharing PG`,
        status: "Available",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
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
        alert("PG Listing Submitted!");
        refreshRentProperties();
        navigate("/userdashboard");
      } else {
        alert(`Error: ${result.message || "Failed to save PG listing."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving PG property due to a network or server issue.");
    }
  };

  const AMENITY_LABELS = {
    food: { label: 'Meals / Food', icon: '🍽️' },
    wifi: { label: 'Wi-Fi', icon: '📶' },
    ac: { label: 'Air Conditioning', icon: '❄️' },
    laundry: { label: 'Laundry', icon: '👕' },
    power: { label: 'Power Backup', icon: '⚡' },
    housekeeping: { label: 'Housekeeping', icon: '🧹' },
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 " +
    "bg-white dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 " +
    "focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 " +
    "focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400 dark:placeholder-gray-500";
  const labelCls = "block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark'
      ? 'bg-gray-900 text-gray-100'
      : 'bg-gradient-to-br from-slate-100 via-purple-50 to-pink-50'
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
              <p className="text-xs text-gray-400 dark:text-gray-500">PG Listing</p>
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
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              List Your PG / Co-Living Space
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Reach students, professionals & travellers — zero commission on every booking.
            </p>
          </div>

          <div className={`rounded-3xl shadow-xl border overflow-hidden ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700/60' : 'bg-white/90 border-gray-200/60'
            }`}>
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <SectionCard color="blue" icon={Home} title="Basic Information">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="pgName" className={labelCls}>PG / Co-Living Name</label>
                      <input
                        id="pgName" type="text" required
                        placeholder="e.g., Green Valley PG for Boys"
                        className={inputCls}
                        value={formData.pgName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className={labelCls}>State</label>
                        <select id="state" className={inputCls} value={formData.state} onChange={handleChange} required>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bestFor" className={labelCls}>Best For</label>
                        <select id="bestFor" className={inputCls} value={formData.bestFor} onChange={handleChange}>
                          <option value="boys">Boys Only</option>
                          <option value="girls">Girls Only</option>
                          <option value="coliving">Co-living (All)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className={labelCls}>Full Address</label>
                      <textarea
                        id="address" rows="3" required
                        placeholder="Enter the full PG address including city and pincode"
                        className={`${inputCls} resize-none`}
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard color="purple" icon={Tag} title="Room & Pricing Details">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="sharingType" className={labelCls}>Sharing Type</label>
                      <select id="sharingType" className={inputCls} value={formData.sharingType} onChange={handleChange}>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="triple">Triple</option>
                        <option value="4+">4+ Sharing</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Price per Bed</label>
                      <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-700/30" : "bg-purple-50/50"} border ${theme === "dark" ? "border-gray-600/40" : "border-purple-100/60"} transition-all`}>
                        <PriceInput
                          value={formData.price}
                          onValueChange={v => setFormData({ ...formData, price: v })}
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
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                      >
                        <span>{icon}</span>{label}
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-[.99] transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  {isEditing ? 'Update PG Listing' : 'Submit PG Listing'}
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
    blue: "from-blue-500/10 to-indigo-500/5 border-blue-200/60 dark:border-blue-800/40",
    purple: "from-purple-500/10 to-pink-500/5 border-purple-200/60 dark:border-purple-800/40",
    amber: "from-amber-500/10 to-orange-500/5 border-amber-200/60 dark:border-amber-800/40",
  };
  const iconColors = { blue: "text-blue-500", purple: "text-purple-500", amber: "text-amber-500" };
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

export default PG;
