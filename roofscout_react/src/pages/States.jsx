import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PropertyContext } from "../contexts/PropertyContext";

const TYPE_META = {
  plot: { label: "Plot / Land", icon: "🌿", color: "from-green-500 to-teal-500" },
  flat: { label: "Flat / Apartment", icon: "🏢", color: "from-blue-500 to-cyan-500" },
  "builder-floor": { label: "Builder Floor", icon: "🏗️", color: "from-orange-500 to-amber-500" },
  villa: { label: "Villa / House", icon: "🏡", color: "from-purple-500 to-pink-500" },
  rent: { label: "Rent", icon: "🔑", color: "from-indigo-500 to-violet-500" },
  pg: { label: "PG / Co-living", icon: "🛏️", color: "from-rose-500 to-pink-500" },
};
function getBadge(type) { return TYPE_META[type]?.color || "from-gray-500 to-slate-500"; }
function getIcon(type) { return TYPE_META[type]?.icon || "🏠"; }
function getLabel(type) { return TYPE_META[type]?.label || (type || "").toUpperCase(); }

function States() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { apiProperties, hiddenIds } = useContext(PropertyContext);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({ type: "all", price: "all" });
  const [sortType, setSortType] = useState("none");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const stateName = searchParams.get("state") || "punjab";

  useEffect(() => {
    const selectedState = stateName.toLowerCase();

    // Filter properties based on state/location
    const match = apiProperties.filter((p) => {
      const pState = (p.state || "").toLowerCase();
      const pLoc = (p.location || "").toLowerCase();

      const stateMatch = pState.includes(selectedState) || pLoc.includes(selectedState);
      return stateMatch && !hiddenIds.includes(p.id);
    });

    setFilteredProperties(match);
    setPage(1);
  }, [apiProperties, searchParams, stateName, hiddenIds]);

  const sortData = (data) => {
    if (sortType === "low") return [...data].sort((a, b) => a.dataPrice - b.dataPrice);
    if (sortType === "high") return [...data].sort((a, b) => b.dataPrice - a.dataPrice);
    if (sortType === "area") return [...data].sort((a, b) => a.area - b.area);
    return data;
  };

  const sorted = sortData(filteredProperties);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

  const selectCls =
    "w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 " +
    "bg-white dark:bg-gray-700/70 text-gray-800 dark:text-gray-100 " +
    "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 " +
    "focus:ring-2 focus:ring-blue-500/20 transition-all text-sm";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden bg-blue-600 dark:bg-teal-600 py-12 px-6">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="relative max-w-6xl mx-auto text-center">
            <p className="text-blue-200 text-xs uppercase tracking-widest font-semibold mb-2">RoofScout — Buy Properties</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
              Properties in <span className="text-yellow-400">{stateName.charAt(0).toUpperCase() + stateName.slice(1)}</span>
            </h1>
            <p className="text-blue-100/80 mt-3 text-base">
              {filteredProperties.length} listings found
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* ── FILTER BAR ── */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Property Type</label>
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className={selectCls}>
                  <option value="all">🏘️ All Types</option>
                  <option value="plot">🌿 Plot / Land</option>
                  <option value="flat">🏢 Flat / Apartment</option>
                  <option value="builder-floor">🏗️ Builder Floor</option>
                  <option value="villa">🏡 Villa / House</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Price Range</label>
                <select value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })} className={selectCls}>
                  <option value="all">💰 All Prices</option>
                  <option value="1">Below ₹50 Lacs</option>
                  <option value="2">₹50 Lacs – ₹2 Cr</option>
                  <option value="3">₹2 Cr – ₹5 Cr</option>
                  <option value="4">Above ₹5 Cr</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
                <select value={sortType} onChange={(e) => setSortType(e.target.value)} className={selectCls}>
                  <option value="none">⚡ Default</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                  <option value="area">Area: Low → High</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const sel = stateName.toLowerCase();
                    const all = [...apiProperties];
                    let filtered = all.filter((p) => {
                      const pState = (p.state || "").toLowerCase();
                      const pLoc = (p.location || "").toLowerCase();
                      const stateMatch = pState.includes(sel) || pLoc.includes(sel);

                      const matchType = filters.type === "all" || p.type === filters.type;
                      const p2 = p.dataPrice || p.price; // Backend uses `price`, mock uses `dataPrice`
                      let matchPrice = true;
                      switch (filters.price) {
                        case "1": matchPrice = p2 < 5000000; break;
                        case "2": matchPrice = p2 >= 5000000 && p2 < 20000000; break;
                        case "3": matchPrice = p2 >= 20000000 && p2 < 50000000; break;
                        case "4": matchPrice = p2 >= 50000000; break;
                      }
                      return stateMatch && matchType && matchPrice && !hiddenIds.includes(p.id);
                    });
                    setFilteredProperties(filtered); setPage(1);
                  }}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white font-semibold rounded-xl transition-all shadow-md text-sm"
                >Apply</button>
                <button
                  onClick={() => {
                    setFilters({ type: "all", price: "all" }); setSortType("none");
                    const sel = stateName.toLowerCase();
                    const all = [...apiProperties];
                    setFilteredProperties(all.filter((p) => ((p.state || "").toLowerCase().includes(sel) || (p.location || "").toLowerCase().includes(sel)) && !hiddenIds.includes(p.id)));
                    setPage(1);
                  }}
                  className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all text-sm border border-gray-200 dark:border-gray-600"
                >Clear</button>
              </div>
            </div>
          </div>

          {/* ── CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginated.map((p) => (
              <div key={p.id} className="group bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                  {p.image && p.image !== "/default.jpg" ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">{getIcon(p.type)}</div>
                  )}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getBadge(p.type)} shadow-md`}>
                    {getIcon(p.type)} {getLabel(p.type)}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-sm font-extrabold shadow-lg">
                    {p.priceText}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-base font-bold text-gray-800 dark:text-white leading-snug line-clamp-2 mb-1">{p.title}</h2>
                  {p.location && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">📍 {p.location}</p>}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.area > 0 && <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">📐 {p.area} sq ft</span>}
                    {p.beds && <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-800/50">🛏️ {p.beds} Bed</span>}
                    {p.baths && <span className="inline-flex items-center gap-1 text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-100 dark:border-cyan-800/50">🚿 {p.baths} Bath</span>}
                  </div>
                  <button
                    onClick={() => navigate(
                      `/viewdetail?houseId=${p.id}` +
                      `&title=${encodeURIComponent(p.title)}` +
                      `&priceText=${encodeURIComponent(p.priceText || "")}` +
                      `&desc=${encodeURIComponent(p.desc || "")}` +
                      `&address=${encodeURIComponent(p.address || "")}` +
                      `&image=${encodeURIComponent(p.image || "")}` +
                      `&location=${encodeURIComponent((p.district || "") + ", " + (p.state || ""))}` +
                      `&type=${encodeURIComponent(p.type || "")}` +
                      `&area=${encodeURIComponent(p.area || "")}` +
                      `&beds=${encodeURIComponent(p.beds || "")}` +
                      `&baths=${encodeURIComponent(p.baths || "")}` +
                      `&garages=${encodeURIComponent(p.garages || "")}` +
                      `&owner=${encodeURIComponent(p.owner || "Owner")}`
                    )}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 dark:bg-teal-500 dark:hover:bg-teal-400 active:scale-[.98] transition-all shadow-md shadow-blue-500/20 dark:shadow-teal-500/20 flex items-center justify-center gap-2"
                  >View Details →</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── EMPTY ── */}
          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="text-7xl opacity-30">🏚️</div>
              <p className="text-xl font-semibold text-gray-400 dark:text-gray-500">No properties found in {stateName}</p>
              <p className="text-sm text-gray-400 dark:text-gray-600">Try adjusting your filters</p>
            </div>
          )}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 my-8">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">← Prev</button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${p === page ? "bg-blue-600 dark:bg-teal-500 text-white shadow-md shadow-blue-500/30 dark:shadow-teal-500/30" : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"}`}>{p}</button>
                ))}
              </div>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">Next →</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default States;
