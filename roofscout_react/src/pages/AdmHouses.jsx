import { useTheme } from '../hooks/useTheme';
// src/pages/AdmHouses.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropertyCard from "../components/propertyCard";
import { PropertyContext } from "../contexts/PropertyContext";
import { RentContext } from "../contexts/PropertyContextRent";

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

  // BUY context
  const {
    getCombinedProperties,
    hideProperty,
    loading,
    updateProperty,
    adminProperties: adminBuyProperties = [],
    apiProperties = [],
    hiddenIds = [],
  } = useContext(PropertyContext);

  // RENT context
  const {
    getCombinedRentProperties,
    hideRentProperty,
    loadingRent,
    updateRentProperty,
    adminRentProperties = [],
    apiRentProperties = [],
    hiddenRentIds = [],
  } = useContext(RentContext);

  const loadingAny = loading || loadingRent;

  const [mode, setMode] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 3; // EXACTLY 3 CARDS PER PAGE
  const [search, setSearch] = useState("");

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("rs-theme", theme);
  }, [theme]);

  // BUY ONLY houses
  const buyItems = useMemo(() => {
    const list = getCombinedProperties({ mode: "buy" }) || [];
    return list.filter(
      (p) =>
        !hiddenIds.includes(p.id) &&
        (p.type || "").toLowerCase() === "house"
    );
  }, [getCombinedProperties, hiddenIds]);

  // RENT ITEMS — REMOVE PLOTS (so AdmHouses never shows plot)
  const rentItems = useMemo(() => {
    return (getCombinedRentProperties({}) || [])
      .filter((p) => !hiddenRentIds.includes(p.id))
      .filter((p) => (p.type || "").toLowerCase() !== "plot");
  }, [getCombinedRentProperties, hiddenRentIds]);

  // ADMIN ONLY (both admin buy & admin rent merged)
  const adminOnlyItems = useMemo(() => {
    const buys = (adminBuyProperties || []).filter((p) => !hiddenIds.includes(p.id));
    const rents = (adminRentProperties || []).filter(
      (p) => !hiddenRentIds.includes(p.id)
    );

    const map = new Map();
    buys.forEach((p) => map.set(String(p.id), p));
    rents.forEach((p) => map.set(String(p.id), p));

    return Array.from(map.values());
  }, [
    adminBuyProperties,
    adminRentProperties,
    hiddenIds,
    hiddenRentIds,
  ]);

  // ALL = buy houses + rent (non-plots)
  const allMerged = useMemo(() => {
    const map = new Map();

    buyItems.forEach((p) => map.set(String(p.id), p));
    rentItems.forEach((p) => {
      const key = String(p.id);
      if (!map.has(key)) map.set(key, p);
    });

    return Array.from(map.values());
  }, [buyItems, rentItems]);

  // MODE SWITCHING
  const modeList = useMemo(() => {
    if (mode === "all") return allMerged;
    if (mode === "buy") return buyItems;
    if (mode === "rent") return rentItems;
    if (mode === "admin") return adminOnlyItems;
    return allMerged;
  }, [mode, allMerged, buyItems, rentItems, adminOnlyItems]);

  // SEARCH
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return modeList;

    return modeList.filter((p) => {
      return (
        String(p.id || "").toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.state || p.district || "").toLowerCase().includes(q) ||
        (p.priceText || "").toLowerCase().includes(q)
      );
    });
  }, [modeList, search]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const listingsCount = allMerged.length;
  const visibleCount = filtered.length;

  // VIEW DETAILS — pass owner and ownerName so ViewDetail always gets it
  const handleViewDetails = (property) => {
    const params = new URLSearchParams({
      houseId: property.id || "",
      title: property.title || "",
      desc: property.description || "",
      priceText: property.priceText || "",
      image: property.image || "",
      owner: property.owner || "",
      ownerName: property.owner || "", // safe backup
      address: property.address || property.location || property.district || "",
      location: property.state || property.district || "",
      type: property.type || "",
      area: property.area || "",
      beds: property.beds ? String(property.beds) : "",
      baths: property.baths ? String(property.baths) : "",
      garages: property.garages ? String(property.garages) : "",
    });

    navigate(`/viewdetail?${params.toString()}`);
  };

  // DELETE (hide)
  const handleDelete = (id) => {
    const isBuy = buyItems.some((p) => String(p.id) === String(id));
    const isRent = rentItems.some((p) => String(p.id) === String(id));

    if (isBuy) hideProperty(id);
    if (isRent) hideRentProperty(id);
    // if in both, both hide functions will run
  };

  // SAVE (update)
  const handleSaveFromCard = (updated) => {
    const isBuy = buyItems.some((p) => String(p.id) === String(updated.id));
    const isRent = rentItems.some((p) => String(p.id) === String(updated.id));

    if (isBuy) updateProperty(updated.id, updated);
    if (isRent) updateRentProperty(updated.id, updated);
  };

  // UI
  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* TOP NAV */}
      <div
        className={`sticky top-0 z-50 h-20 flex justify-between items-center px-6 shadow-md ${
          theme === "dark" ? "bg-gray-800/70" : "bg-white/70 backdrop-blur"
        }`}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => setCollapsed((c) => !c)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-10 w-10 rounded-full" alt="RoofScout" />
            <div>
              <h1 className="text-xl font-bold">
                <Link to="/"><span className="text-yellow-500">Roof</span> <span className="text-blue-600 dark:text-teal-400">Scout</span></Link>
              </h1>
              <p className="text-sm opacity-70">Property Admin</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} className="p-2 rounded border">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link to="#" onClick={(e) => { e.preventDefault(); import("../supabase").then(({ localAuth }) => { localAuth.signOut(); localStorage.removeItem("role"); window.location.href = "/login"; }); }} className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">Logout</Link>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="flex">
        {/* SIDEBAR */}
        <aside className={`transition-all duration-300 ${collapsed ? "w-20" : "w-72"} bg-gray-900 text-white p-4 min-h-screen`}>
          <nav className="flex flex-col gap-2">
            <SidebarItem to="/AdminDashboard" icon={<Info />} text="Info" collapsed={collapsed} />
            <SidebarItem to="/AdmHouses" icon={<Home />} text="Houses" collapsed={collapsed} active />
            <SidebarItem to="/AdmPropt" icon={<Building2 />} text="Properties" collapsed={collapsed} />
          </nav>

          {!collapsed && (
            <div className="mt-6 text-xs text-gray-300">
              <p className="font-semibold">Quick Stats</p>
              <p>Listings: <span className="font-semibold text-white">{listingsCount}</span></p>
              <p>Visible: <span className="font-semibold text-white">{visibleCount}</span></p>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Available Properties</h1>
              <p className="text-gray-500 dark:text-gray-300 mt-1">Browse and manage house listings.</p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/postproperty")} className="px-4 py-2 bg-green-600 text-white rounded">Add Property</button>

              <div className="hidden sm:flex items-center rounded bg-gray-200 dark:bg-gray-800 p-1">
                <button onClick={() => { setMode("all"); setPage(1); }} className={`px-3 py-2 rounded ${mode === "all" ? "bg-white shadow text-black" : ""}`}>All</button>
                <button onClick={() => { setMode("buy"); setPage(1); }} className={`px-3 py-2 rounded ${mode === "buy" ? "bg-white shadow text-black" : ""}`}>Buy</button>
                <button onClick={() => { setMode("rent"); setPage(1); }} className={`px-3 py-2 rounded ${mode === "rent" ? "bg-white shadow text-black" : ""}`}>Rent</button>
                <button onClick={() => { setMode("admin"); setPage(1); }} className={`px-3 py-2 rounded ${mode === "admin" ? "bg-white shadow text-black" : ""}`}>Admin</button>
              </div>

              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search houses..." className="border px-3 py-2 rounded w-64 bg-white dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div key={location.pathname + mode + page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
              {loadingAny ? (
                <div className="text-center py-16 text-gray-500">Loading properties...</div>
              ) : (
                <>
                  {paginated.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No properties to display.</div>
                  ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {paginated.map((prop) => (
                        <PropertyCard
                          key={prop.id}
                          property={prop}
                          onViewDetails={handleViewDetails}
                          onSave={handleSaveFromCard}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}

                  {/* PAGINATION */}
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 font-semibold">Prev</button>
                    <div className="text-sm font-medium">Page <strong>{page}</strong> of <strong>{totalPages}</strong></div>
                    <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 font-semibold">Next</button>
                  </div>
                </>
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
      <div className="w-8 h-8 flex items-center justify-center rounded bg-white/5">
        {icon}
      </div>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}

export default AdmHouses;
