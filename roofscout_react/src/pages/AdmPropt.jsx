import { useTheme } from '../hooks/useTheme';
// src/pages/AdmPropt.jsx
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function AdmPropt() {
  const navigate = useNavigate();
  const location = useLocation();

  // BUY context
  const {
    getCombinedProperties,
    hideProperty,
    loading,
    updateProperty,
    adminProperties,
    hiddenIds,
  } = useContext(PropertyContext);

  // RENT CONTEXT
  const {
    getCombinedRentProperties,
    hideRentProperty,
    loadingRent,
    updateRentProperty,
    adminRentProperties,
    hiddenRentIds,
  } = useContext(RentContext);

  const loadingAny = loading || loadingRent;

  const [mode, setMode] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 3;
  const [search, setSearch] = useState("");

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("rs-theme", theme);
  }, [theme]);

  // ----------------------------------------------------------
  // PLOTS ONLY
  // ----------------------------------------------------------

  const buyPlots = useMemo(() => {
    return (getCombinedProperties({ mode: "buy" }) || []).filter(
      (p) =>
        !hiddenIds.includes(p.id) &&
        (p.type || "").toLowerCase() === "plot"
    );
  }, [getCombinedProperties, hiddenIds]);

  const rentPlots = useMemo(() => {
    return (getCombinedRentProperties({}) || []).filter(
      (p) =>
        !hiddenRentIds.includes(p.id) &&
        (p.type || "").toLowerCase() === "plot"
    );
  }, [getCombinedRentProperties, hiddenRentIds]);

  const adminPlots = useMemo(() => {
    const buys = (adminProperties || []).filter(
      (p) =>
        !hiddenIds.includes(p.id) &&
        (p.type || "").toLowerCase() === "plot"
    );

    const rents = (adminRentProperties || []).filter(
      (p) =>
        !hiddenRentIds.includes(p.id) &&
        (p.type || "").toLowerCase() === "plot"
    );

    const map = new Map();
    buys.forEach((p) => map.set(String(p.id), p));
    rents.forEach((p) => map.set(String(p.id), p));

    return Array.from(map.values());
  }, [adminProperties, adminRentProperties, hiddenIds, hiddenRentIds]);

  const allPlots = useMemo(() => {
    const map = new Map();
    buyPlots.forEach((p) => map.set(String(p.id), p));
    rentPlots.forEach((p) => {
      if (!map.has(String(p.id))) map.set(String(p.id), p);
    });
    return Array.from(map.values());
  }, [buyPlots, rentPlots]);

  // MODE SELECTION
  const modeList = useMemo(() => {
    if (mode === "buy") return buyPlots;
    if (mode === "rent") return rentPlots;
    if (mode === "admin") return adminPlots;
    return allPlots;
  }, [mode, buyPlots, rentPlots, adminPlots, allPlots]);

  // SEARCH
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return modeList;

    return modeList.filter((p) => {
      return (
        String(p.id).toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.district || "").toLowerCase().includes(q) ||
        (p.state || "").toLowerCase().includes(q) ||
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

  // DELETE
  const handleDelete = (id) => {
    const isBuy = buyPlots.some((p) => p.id === id);
    const isRent = rentPlots.some((p) => p.id === id);

    if (isBuy) hideProperty(id);
    if (isRent) hideRentProperty(id);
  };

  // SAVE
  const handleSaveFromCard = (updated) => {
    const isBuy = buyPlots.some((p) => p.id === updated.id);
    const isRent = rentPlots.some((p) => p.id === updated.id);

    if (isBuy) updateProperty(updated.id, updated);
    if (isRent) updateRentProperty(updated.id, updated);
  };

  // VIEW DETAILS
  const navigateToDetails = (property) => {
    const params = new URLSearchParams({
      houseId: property.id,
      title: property.title,
      desc: property.description || "",
      priceText: property.priceText || "",
      image: property.image || "",
      type: property.type || "",
      area: property.area || "",
      owner: property.owner || "",
      location: property.state || property.district || "",
    });
    navigate(`/viewdetail?${params.toString()}`);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* NAV */}
      <div
        className={`sticky top-0 z-50 h-20 flex justify-between items-center px-6 shadow-md ${
          theme === "dark" ? "bg-gray-800/70" : "bg-white/70 backdrop-blur"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-10 w-10 rounded-full" alt="logo" />
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-yellow-500">Roof</span>
                <span className="text-blue-600 dark:text-teal-400">Scout</span>
              </h1>
              <p className="text-sm opacity-70">Plot Admin</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-2 border rounded"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="#" onClick={(e) => { e.preventDefault(); import("../supabase").then(({ localAuth }) => { localAuth.signOut(); localStorage.removeItem("role"); window.location.href = "/login"; }); }}
            className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"
          >Logout</Link>
        </div>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`transition-all duration-300 ${
            collapsed ? "w-20" : "w-72"
          } bg-gray-900 text-white p-4 min-h-screen`}
        >
          <SidebarItem to="/AdminDashboard" icon={<Info />} text="Info" collapsed={collapsed} />
          <SidebarItem to="/AdmHouses" icon={<Home />} text="Houses" collapsed={collapsed} />
          <SidebarItem
            to="/AdmPropt"
            icon={<Building2 />}
            text="Properties"
            collapsed={collapsed}
            active
          />

          {!collapsed && (
            <div className="mt-6 text-xs text-gray-300">
              <p className="font-semibold">Plot Stats</p>
              <p>Total: {allPlots.length}</p>
              <p>Visible: {filtered.length}</p>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Available Plots</h1>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/postproperty")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add Plot
              </button>

              {/* FILTER BUTTONS FIXED */}
              <div className="flex bg-gray-900 rounded p-1 shadow-inner">
                {[
                  { key: "all", label: "ALL" },
                  { key: "buy", label: "BUY" },
                  { key: "rent", label: "RENT" },
                  { key: "admin", label: "ADMIN" },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => {
                      setMode(btn.key);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all
                      ${
                        mode === btn.key
                          ? "bg-white text-gray-900 shadow"
                          : "text-gray-300 hover:bg-gray-800"
                      }
                    `}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search plots..."
                className="border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </header>

          {loadingAny ? (
            <div className="text-center py-16">Loading...</div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">No plots found.</div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onViewDetails={navigateToDetails}
                    onSave={handleSaveFromCard}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-lg font-semibold">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, text, collapsed, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded-md text-sm text-gray-100 hover:bg-white/5 transition
        ${collapsed ? "justify-center" : ""}
        ${active ? "bg-white/5 scale-[1.02]" : ""}`}
    >
      <div className="w-8 h-8 flex items-center justify-center rounded bg-white/5">
        {icon}
      </div>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}

export default AdmPropt;
