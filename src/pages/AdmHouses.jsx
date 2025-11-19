// src/pages/AdmHouses.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { PropertyContext } from "../contexts/PropertyContext";
import {
  Menu,
  Sun,
  Moon,
  Home,
  Users,
  Building2,
  User,
  CreditCard,
  Info,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AdmHouses() {
  const navigate = useNavigate();
  const location = useLocation();

  const { getCombinedProperties, hideProperty, loading, updateProperty } =
    useContext(PropertyContext);

  const [mode, setMode] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 3;
  const [search, setSearch] = useState("");

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("rs-theme") || "light");
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("rs-theme", theme);
  }, [theme]);

  // ----------------------
  // Combined houses list (before applying RENT-only fine tuning)
  // ----------------------
  const combinedHousesBeforeRentFilter = useMemo(() => {
    // getCombinedProperties respects mode for buy/rent/admin/all filtering at context level,
    // but we want to ensure only houses here and then apply rent detection logic.
    const all = getCombinedProperties({ mode });
    return all.filter((p) => (p.type || "").toLowerCase() === "house");
  }, [getCombinedProperties, mode]);

  // ----------------------
  // Robust rent detection
  // ----------------------
  const isLikelyRent = (p) => {
    const type = (p.type || "").toLowerCase();
    const pt = (p.priceText || "").toLowerCase();
    // match rent indicators: explicit type 'rent'/'pg', 'rent' word in priceText,
    // /month, per month, night (for nightly rent), weekly, etc.
    return (
      type === "rent" ||
      type === "pg" ||
      /(^|\s)rent($|\s|[:|,])/i.test(pt) ||
      pt.includes("/month") ||
      pt.includes("per month") ||
      pt.includes("night") ||
      pt.includes("per night") ||
      pt.includes("/night") ||
      pt.includes("weekly") ||
      pt.includes("/week")
    );
  };

  // ----------------------
  // allCombined -> actual list used by UI (rent-only logic + fallback)
  // ----------------------
  const { allCombined, fallbackUsed } = useMemo(() => {
    let all = combinedHousesBeforeRentFilter.slice(); // copy

    if (mode === "rent") {
      const rentOnly = all.filter((p) => isLikelyRent(p));

      // fallback: if no explicit rent items found then show all houses
      if (rentOnly.length === 0) {
        return { allCombined: all, fallbackUsed: true };
      }
      return { allCombined: rentOnly, fallbackUsed: false };
    }

    // mode === 'buy' should exclude rent-type items (prefer buy-only)
    if (mode === "buy") {
      const buyOnly = all.filter((p) => !isLikelyRent(p));
      return { allCombined: buyOnly, fallbackUsed: false };
    }

    // mode === 'admin' -> show only admin properties (context already handles admin mode)
    // mode === 'all' -> show all houses
    return { allCombined: all, fallbackUsed: false };
  }, [combinedHousesBeforeRentFilter, mode]);

  // ----------------------
  // SEARCH
  // ----------------------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allCombined;
    return allCombined.filter(
      (p) =>
        String(p.id || "").toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q) ||
        (p.state || p.district || "").toLowerCase().includes(q)
    );
  }, [allCombined, search]);

  // ----------------------
  // PAGINATION
  // ----------------------
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);
  const paginated = filtered.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  // Quick stats counts (listings = total houses before rent filtering, visible = filtered count)
  const listingsCount = combinedHousesBeforeRentFilter.length;
  const visibleCount = filtered.length;

  // ----------------------
  // HANDLERS
  // ----------------------
  const handleViewDetails = (property) => {
    const params = new URLSearchParams({
      houseId: property.id || "",
      title: property.title || "",
      desc: property.description || "",
      address: property.address || "",
      priceText: property.priceText || "",
      image: property.image || "",
      owner: property.owner || "",
      location: property.state || property.district || "",
      type: property.type || "",
      area: property.area || "",
      beds: property.beds ? String(property.beds) : "",
      baths: property.baths ? String(property.baths) : "",
      garages: property.garages ? String(property.garages) : "",
    });
    navigate(`/ViewDetail?${params.toString()}`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Hide property ${id}? This will remove it from public listings.`)) hideProperty(id);
  };

  const handleSaveFromCard = (updated) => {
    updateProperty(updated.id, updated);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      {/* NAVBAR */}
      <div className={`backdrop-blur-md ${theme === "dark" ? "bg-gray-800/70" : "bg-white/60"} sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"><Menu size={20}/></button>
          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="RoofScout" />
            <div>
              <h1 className="text-xl font-bold tracking-tight"><Link to="/"><span className="text-yellow-400">Roof</span> <span className="text-blue-500">Scout</span></Link></h1>
              <p className="text-sm opacity-70">Property Listings</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowNotifs(v => !v)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"><Bell/></button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg border ${theme==='dark'?'bg-gray-800':'bg-white'}`}>
                  <div className="p-3 text-sm">
                    <p className="font-semibold">Notifications</p>
                    <ul className="mt-2 space-y-2">
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">3 new property requests</li>
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">2 properties hidden</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setTheme(t => t==='dark'?'light':'dark')} className="px-3 py-2 border rounded hover:shadow">
            {theme==='dark'?<Sun size={16}/>:<Moon size={16}/>} 
          </button>

          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">Logout</Link>
        </div>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className={`transition-all duration-300 ${collapsed?'w-20':'w-72'} bg-gray-900 min-h-screen p-4 text-white`}> 
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img src="/logoRS.jpg" className="h-10 w-10 rounded-full" alt="logo" />
                <div>
                  <h4 className="font-bold">RoofScout</h4>
                  <p className="text-xs text-gray-300">Property Admin</p>
                </div>
              </div>
            )}
            <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded bg-white/5 hover:bg-white/10">{collapsed?<ChevronRight size={18}/>:<ChevronLeft size={18}/>}</button>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem to="/AdminDashboard" icon={<Info/>} text="Info" collapsed={collapsed} />
            <SidebarItem to="/AdmHouses" icon={<Home/>} text="Houses" collapsed={collapsed} active />
            <SidebarItem to="/AdmClient1" icon={<Users/>} text="Buyer/Seller" collapsed={collapsed} />
            <SidebarItem to="/AdmPropt" icon={<Building2/>} text="Properties" collapsed={collapsed} />
            <SidebarItem to="/AdmTenant" icon={<User/>} text="Tenants" collapsed={collapsed} />
            <SidebarItem to="/AdmPayment" icon={<CreditCard/>} text="Payment" collapsed={collapsed} />
          </nav>

          <div className="mt-8 text-xs text-gray-300">
            {!collapsed ? (
              <>
                <p className="font-medium">Quick Stats</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <p>Listings: <span className="font-semibold text-white">{listingsCount}</span></p>
                  <p>Visible: <span className="font-semibold text-white">{visibleCount}</span></p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">RS</div>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname + mode + page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.35}}>

              <header className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Available Houses</h1>
                  <p className="text-gray-500 dark:text-gray-300 mt-1">Browse and manage house listings.</p>
                  {/* show fallback notice if rent filter used but no explicit rent items existed */}
                  {mode === "rent" && fallbackUsed && (
                    <p className="text-sm text-yellow-400 mt-2">No explicit rent properties found — showing all houses as fallback.</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => navigate("/postproperty")} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">List Property</button>

                  <div className="hidden sm:flex items-center rounded bg-gray-200 dark:bg-gray-700 p-1">
                    <button onClick={() => { setMode('all'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='all'?'bg-white shadow text-black':''}`}>All</button>
                    <button onClick={() => { setMode('buy'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='buy'?'bg-white shadow text-black':''}`}>Buy</button>
                    <button onClick={() => { setMode('rent'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='rent'?'bg-white shadow text-black':''}`}>Rent</button>
                    <button onClick={() => { setMode('admin'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='admin'?'bg-white shadow text-black':''}`}>Admin</button>
                  </div>

                  <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} placeholder="Search by id, title, address or state" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded-md text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </header>

              {loading ? (
                <div className="text-center py-16 text-gray-500">Loading properties...</div>
              ) : (
                <div className="space-y-8">
                  {paginated.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No properties to display.</div>
                  ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {paginated.map((prop) => (
                        <motion.div key={prop.id} whileHover={{ scale: 1.02 }} className="h-full flex flex-col">
                          <PropertyCard
                            property={prop}
                            onViewDetails={handleViewDetails}
                            onSave={handleSaveFromCard}
                            onDelete={handleDelete}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* PAGINATION */}
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 font-semibold">Prev</button>
                    <div className="text-sm font-medium">Page <strong>{page}</strong> of <strong>{totalPages}</strong></div>
                    <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 font-semibold">Next</button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, text, collapsed, active }) {
  return (
    <Link to={to} className={`flex items-center gap-3 p-2 rounded-md text-sm text-gray-100 hover:bg-white/5 transition ${collapsed ? "justify-center" : ""} ${active ? "bg-white/5 scale-[1.02]" : ""}`}>
      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5">{icon}</div>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}

export default AdmHouses;
