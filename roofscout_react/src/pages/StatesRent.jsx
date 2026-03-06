import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { RentContext } from "../contexts/PropertyContextRent";

const TYPE_META = {
  house: { label: "House", icon: "🏡", color: "from-purple-500 to-pink-500" },
  plot: { label: "Plot / Land", icon: "🌿", color: "from-green-500 to-teal-500" },
  flat: { label: "Flat", icon: "🏢", color: "from-blue-500 to-cyan-500" },
  rent: { label: "Rent", icon: "🔑", color: "from-indigo-500 to-violet-500" },
  pg: { label: "PG / Co-living", icon: "🛏️", color: "from-rose-500 to-pink-500" },
};
function getBadge(type) { return TYPE_META[type]?.color || "from-gray-500 to-slate-500"; }
function getIcon(type) { return TYPE_META[type]?.icon || "🏠"; }
function getLabel(type) { return TYPE_META[type]?.label || (type || "").toUpperCase(); }

function StatesRent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCombinedRentProperties, hiddenRentIds } = useContext(RentContext);

  const [allStates, setAllStates] = useState({});
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', price: 'all' });
  const [sortType, setSortType] = useState("none");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const stateName = searchParams.get('state') || 'punjab';

  const formatRentPrice = (txt = "") => {
    let s = String(txt).replace(/\s*\/\s*/g, '/').replace(/\/month/i, '/month')
      .replace(/per\s*month/i, '/month').replace(/per\s*mon/i, '/month')
      .replace(/\s+month/i, '/month').replace(/(?:\/month)+/i, '/month');
    if (!/\/month/i.test(s)) s = s.trim() + ' / month';
    return s.trim();
  };

  useEffect(() => {
    // 1. Fetch contexts
    const props = getCombinedRentProperties() || [];
    // 2. Filter hidden
    const visibleProps = props.filter(p => !hiddenRentIds.includes(p.id));

    // 3. Reconstruct into state-bucketed object like before for 'allStates'
    const adjusted = {};
    visibleProps.forEach(prop => {
      // Normalize state name 
      const sName = (prop.state || "").toLowerCase().trim() || "unknown";
      if (!adjusted[sName]) adjusted[sName] = [];

      // Default formatting exactly as the old static code did:
      adjusted[sName].push({
        ...prop,
        dataPrice: prop.dataPrice || 10,
        priceText: prop.priceText || '₹10,000 / month'
      });
    });

    setAllStates(adjusted);
    setFilteredProperties(adjusted[stateName.toLowerCase()] || []);
  }, [searchParams, getCombinedRentProperties, hiddenRentIds, stateName]);

  const sortData = (data) => {
    if (sortType === "low") return [...data].sort((a, b) => a.dataPrice - b.dataPrice);
    if (sortType === "high") return [...data].sort((a, b) => b.dataPrice - a.dataPrice);
    if (sortType === "area") return [...data].sort((a, b) => a.area - b.area);
    return data;
  };

  const applyFilters = () => {
    const sel = stateName.toLowerCase();

    // Get all properties across all state keys (or just the merged API properties)
    const allProps = Object.values(allStates).flat();

    let filtered = allProps.filter(prop => {
      // 1. Match State
      const pState = (prop.state || "").toLowerCase();
      const pLoc = (prop.location || "").toLowerCase();
      const stateMatch = pState.includes(sel) || pLoc.includes(sel);

      // 2. Match Type
      const matchType = filters.type === 'all' || prop.type === filters.type;

      // 3. Match Price (Backend uses `price`, mock uses `dataPrice`)
      const p = prop.dataPrice || (prop.price / 1000); // converting to 'k' scale for rent
      let matchPrice = true;
      switch (filters.price) {
        case '1': matchPrice = p < 15; break;
        case '2': matchPrice = p >= 15 && p < 30; break;
        case '3': matchPrice = p >= 30 && p < 50; break;
        case '4': matchPrice = p >= 50; break;
      }

      return stateMatch && matchType && matchPrice;
    });
    setFilteredProperties(filtered); setPage(1);
  };

  const clearFilters = () => {
    setFilters({ type: 'all', price: 'all' }); setSortType("none");
    const sel = stateName.toLowerCase();
    const allProps = Object.values(allStates).flat();
    setFilteredProperties(allProps.filter(prop => {
      const pState = (prop.state || "").toLowerCase();
      const pLoc = (prop.location || "").toLowerCase();
      return pState.includes(sel) || pLoc.includes(sel);
    }));
    setPage(1);
  };

  const sortedData = sortData(filteredProperties);
  const paginatedData = sortedData.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(sortedData.length / perPage);

  const selectCls =
    "w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 " +
    "bg-white dark:bg-gray-700/70 text-gray-800 dark:text-gray-100 " +
    "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 " +
    "focus:ring-2 focus:ring-blue-500/20 transition-all text-sm";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 py-12 px-6">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="relative max-w-6xl mx-auto text-center">
            <p className="text-cyan-200 text-xs uppercase tracking-widest font-semibold mb-2">RoofScout — Rental Properties</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
              Rentals in <span className="text-yellow-400">{stateName.charAt(0).toUpperCase() + stateName.slice(1)}</span>
            </h1>
            <p className="text-cyan-100/80 mt-3 text-base">
              {filteredProperties.length} rental listings found
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* ── FILTER BAR ── */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Property Type</label>
                <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className={selectCls}>
                  <option value="all">🏘️ All Types</option>
                  <option value="house">🏡 House</option>
                  <option value="plot">🌿 Plot</option>
                  <option value="flat">🏢 Flat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Price Range (per month)</label>
                <select value={filters.price} onChange={e => setFilters({ ...filters, price: e.target.value })} className={selectCls}>
                  <option value="all">💰 All Prices</option>
                  <option value="1">Below ₹15,000/month</option>
                  <option value="2">₹15,000 – ₹30,000/month</option>
                  <option value="3">₹30,000 – ₹50,000/month</option>
                  <option value="4">Above ₹50,000/month</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
                <select value={sortType} onChange={e => setSortType(e.target.value)} className={selectCls}>
                  <option value="none">⚡ Default</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                  <option value="area">Area: Low → High</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={applyFilters} className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-md text-sm">Apply</button>
                <button onClick={clearFilters} className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all text-sm border border-gray-200 dark:border-gray-600">Clear</button>
              </div>
            </div>
          </div>

          {/* ── CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedData.map((prop, idx) => (
              <div key={prop.id || idx} className="group bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                  {prop.image ? (
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">{getIcon(prop.type)}</div>
                  )}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getBadge(prop.type)} shadow-md`}>
                    {getIcon(prop.type)} {getLabel(prop.type)}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-sm font-extrabold shadow-lg">
                    {formatRentPrice(prop.priceText)}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-base font-bold text-gray-800 dark:text-white leading-snug line-clamp-2 mb-1">{prop.title}</h2>
                  {prop.location && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">📍 {prop.location}</p>}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prop.area > 0 && <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">📐 {prop.area} sq ft</span>}
                    {prop.beds && <span className="inline-flex items-center gap-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-800/50">🛏️ {prop.beds} Bed</span>}
                    {prop.baths && <span className="inline-flex items-center gap-1 text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-100 dark:border-cyan-800/50">🚿 {prop.baths} Bath</span>}
                  </div>
                  <button
                    onClick={() => navigate(`/viewdetail?houseId=${prop.id}&title=${encodeURIComponent(prop.title)}&priceText=${encodeURIComponent(formatRentPrice(prop.priceText))}&image=${encodeURIComponent(prop.image || "")}&area=${prop.area}&type=${prop.type}`)}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[.98] transition-all shadow-md flex items-center justify-center gap-2"
                  >View Details →</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── EMPTY ── */}
          {paginatedData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="text-7xl opacity-30">🏚️</div>
              <p className="text-xl font-semibold text-gray-400 dark:text-gray-500">No rentals found in {stateName}</p>
              <p className="text-sm text-gray-400 dark:text-gray-600">Try adjusting your filters</p>
            </div>
          )}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 my-8">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">← Prev</button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${p === page ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md" : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"}`}>{p}</button>
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

export default StatesRent;