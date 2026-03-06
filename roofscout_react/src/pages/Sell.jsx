import { useTheme } from '../hooks/useTheme';
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { PropertyContext } from "../contexts/PropertyContext";
import { useContext } from "react";
import { Sun, Moon, Menu, Home, Tag, Image } from "lucide-react";
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

// Format price for display
function formatPrice(val) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${Number(val).toLocaleString("en-IN")}`;
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
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price in ₹</span>
        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          {formatPrice(value)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-blue-500">₹</span>
        <input
          type="text"
          inputMode="numeric"
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={commitText}
          onKeyDown={e => e.key === 'Enter' && commitText()}
          placeholder="Enter price..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 text-lg font-semibold focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
        />
      </div>
    </div>
  );
}

function Sell() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProperties } = useContext(PropertyContext);
  const editId = searchParams.get("editId");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "plot",
    state: "Punjab",
    address: "",
    price: 5000000,
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
  });

  const [theme, setTheme] = useTheme();

  useEffect(() => {
    if (editId) setIsEditing(true);
  }, [editId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, type, state, address, price, bedrooms, bathrooms, size, description } = formData;

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
        listingType: "Sell",
        price: Number(price),
        area: Number(size) || 0,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        state,
        address,
        description,
        status: "Available",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
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
        alert("Property submitted successfully!");
        refreshProperties();
        navigate("/userdashboard");
      } else {
        alert(`Error: ${result.message || "Failed to save property."}`);
      }
    } catch (err) {
      console.error("Error saving property:", err);
      alert("Error saving property due to a network or server issue.");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 " +
    "bg-white dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 " +
    "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 " +
    "focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400 dark:placeholder-gray-500";
  const labelCls = "block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark"
      ? "bg-gray-900 text-gray-100"
      : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50"
      }`}>

      <nav className={`sticky top-0 z-50 flex justify-between items-center h-16 px-6 backdrop-blur-lg shadow-sm border-b transition-colors ${theme === "dark" ? "bg-gray-900/80 border-gray-700/50" : "bg-white/70 border-gray-200/60"
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
              <p className="text-xs text-gray-400 dark:text-gray-500">Sell Property</p>
            </div>
          </Link>
        </div>
        <button
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${theme === "dark"
            ? "bg-gray-700/60 border-gray-600 text-yellow-300 hover:bg-gray-600/60"
            : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </nav>

      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              {isEditing ? "Edit Property Listing" : "List Your Property for Sale"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Fill out the details below to put your property on the market — it's 100% free.
            </p>
          </div>

          <div className={`rounded-3xl shadow-xl border overflow-hidden ${theme === "dark" ? "bg-gray-800/80 border-gray-700/60" : "bg-white/90 border-gray-200/60"
            }`}>
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <SectionCard color="blue" icon={Home} title="Basic Information">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className={labelCls}>Property Title</label>
                      <input
                        id="title" type="text" required
                        placeholder="e.g., Modern 2BHK Apartment"
                        className={inputCls}
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className={labelCls}>Property Type</label>
                      <select id="type" className={inputCls} value={formData.type} onChange={handleChange} required>
                        <option value="plot">Plot / Land</option>
                        <option value="flat">Flat / Apartment</option>
                        <option value="builder-floor">Independent / Builder Floor</option>
                        <option value="villa">Independent House / Villa</option>
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
                      <label htmlFor="size" className={labelCls}>Total Size (sq. ft.)</label>
                      <input
                        id="size" type="number" min="0"
                        placeholder="e.g., 1200"
                        className={inputCls}
                        value={formData.size}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="address" className={labelCls}>Full Address</label>
                    <textarea
                      id="address" rows="3" required
                      placeholder="Enter the full property address including city and pincode"
                      className={`${inputCls} resize-none`}
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </SectionCard>

                <SectionCard color="amber" icon={Tag} title="Details & Price">
                  <div className="mb-5">
                    <label className={labelCls}>Listing Price</label>
                    <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-700/30" : "bg-blue-50/50"} border ${theme === "dark" ? "border-gray-600/40" : "border-blue-100/60"} transition-all`}>
                      <PriceInput
                        value={formData.price}
                        onValueChange={v => setFormData({ ...formData, price: v })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bedrooms" className={labelCls}>Bedrooms</label>
                      <input
                        id="bedrooms" type="number" min="0"
                        placeholder="e.g., 3"
                        className={inputCls}
                        value={formData.bedrooms}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="bathrooms" className={labelCls}>Bathrooms</label>
                      <input
                        id="bathrooms" type="number" min="0"
                        placeholder="e.g., 2"
                        className={inputCls}
                        value={formData.bathrooms}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="description" className={labelCls}>Description</label>
                    <textarea
                      id="description" rows="3"
                      placeholder="Tell buyers what makes your property special..."
                      className={`${inputCls} resize-none`}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </SectionCard>

                <SectionCard color="purple" icon={Image} title="Upload Photos">
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${theme === "dark" ? "border-gray-600 hover:border-purple-400/60" : "border-gray-300 hover:border-purple-400"
                    }`}>
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Upload property photos (optional)</p>
                    <input
                      id="photos" name="photos" type="file" multiple accept="image/*"
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                                  file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-purple-100 file:text-purple-700
                                  hover:file:bg-purple-200
                                  dark:file:bg-purple-900/50 dark:file:text-purple-300
                                  dark:hover:file:bg-purple-800/50 cursor-pointer"
                    />
                  </div>
                </SectionCard>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[.99] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {isEditing ? "Update Property" : "Submit Property"}
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
    amber: "from-amber-500/10 to-orange-500/5 border-amber-200/60 dark:border-amber-800/40",
    purple: "from-purple-500/10 to-pink-500/5 border-purple-200/60 dark:border-purple-800/40",
  };
  const iconColors = {
    blue: "text-blue-500",
    amber: "text-amber-500",
    purple: "text-purple-500",
  };
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

export default Sell;
