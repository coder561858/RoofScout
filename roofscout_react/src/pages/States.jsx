// src/pages/States.jsx
import { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PropertyContext } from '../contexts/PropertyContext';

function States() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { apiProperties, hiddenIds, loading, getCombinedProperties } = useContext(PropertyContext);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', price: 'all' });
  const [sortType, setSortType] = useState("none");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Load props from context and apply initial state filter
  useEffect(() => {
    const selectedState = (searchParams.get('state') || 'punjab').toLowerCase();
    // Use context apiProperties but also include admin properties if needed - here we only show apiProperties for state page
    const data = apiProperties.filter(p => {
      const st = String(p.state || p.district || '').toLowerCase();
      return st.includes(selectedState);
    }).filter(p => !hiddenIds.includes(p.id));
    setFilteredProperties(data);
    setPage(1);
  }, [apiProperties, searchParams, hiddenIds]);

  // Sorting
  const sortData = (data) => {
    if (sortType === "low") return [...data].sort((a, b) => (a.dataPrice || 0) - (b.dataPrice || 0));
    if (sortType === "high") return [...data].sort((a, b) => (b.dataPrice || 0) - (a.dataPrice || 0));
    if (sortType === "area") return [...data].sort((a, b) => (a.area || 0) - (b.area || 0));
    return data;
  };

  // Apply Filters
  const applyFilters = () => {
    const selectedState = (searchParams.get('state') || 'punjab').toLowerCase();
    let filtered = (apiProperties || []).filter(prop => {
      const st = String(prop.state || prop.district || '').toLowerCase();
      if (!st.includes(selectedState)) return false;

      let matchType = filters.type === 'all' || (prop.type && prop.type === filters.type);
      let matchPrice = true;

      const p = prop.dataPrice || 0;

      switch (filters.price) {
        case '1': matchPrice = p < 50; break;
        case '2': matchPrice = p >= 50 && p < 200; break;
        case '3': matchPrice = p >= 200 && p < 500; break;
        case '4': matchPrice = p >= 500; break;
        default: matchPrice = true;
      }

      return matchType && matchPrice && !hiddenIds.includes(prop.id);
    });

    setPage(1);
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    const state = (searchParams.get('state') || 'punjab').toLowerCase();
    setFilters({ type: 'all', price: 'all' });
    setSortType("none");
    setFilteredProperties(apiProperties.filter(p => String(p.state || p.district || '').toLowerCase().includes(state) && !hiddenIds.includes(p.id)));
    setPage(1);
  };

  // Pagination Data
  const sortedData = sortData(filteredProperties);
  const startIndex = (page - 1) * perPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + perPage);
  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 mt-6 dark:text-white">

        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          Properties in {searchParams.get('state')?.toUpperCase()}
        </h1>

        {/* FILTER SECTION */}
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg mb-8 shadow">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Property Type */}
            <div>
              <label className="block mb-1 font-semibold">Property Type</label>
              <select
                value={filters.type}
                onChange={e => setFilters({ ...filters, type: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="house">House</option>
                <option value="plot">Plot</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block mb-1 font-semibold">Price Range</label>
              <select
                value={filters.price}
                onChange={e => setFilters({ ...filters, price: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="1">Below ₹50 Lacs</option>
                <option value="2">₹50 Lacs - ₹2 Cr</option>
                <option value="3">₹2 Cr - ₹5 Cr</option>
                <option value="4">Above ₹5 Cr</option>
              </select>
            </div>

            {/* Sort Feature */}
            <div>
              <label className="block mb-1 font-semibold">Sort By</label>
              <select
                value={sortType}
                onChange={e => setSortType(e.target.value)}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="none">Default</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
                <option value="area">Area: Low → High</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3">
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                Clear
              </button>
            </div>

          </div>
        </div>

        {/* PROPERTY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">

          {paginatedData.map((prop, idx) => (
            <div key={idx}
             className="border rounded-2xl shadow p-4 bg-gray-200 dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <img src={prop.image} className="w-full h-48 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{prop.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{prop.priceText}</p>
              <p className="font-bold mt-1">Area: {prop.area} sq ft</p>
              <p className="text-sm">Type: {prop.type?.toUpperCase()}</p>

              <button
                onClick={() =>
                  navigate(`/viewdetail?houseId=${prop.id}&title=${prop.title}&priceText=${prop.priceText}&image=${prop.image}&area=${prop.area}&type=${prop.type}`)
                }
                className="mt-3 bg-blue-600 text-white px-3 py-2 rounded"
              >
                View Details
              </button>
            </div>
          ))}

        </div>

        {/* NO RESULTS */}
        {paginatedData.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-300 text-xl mt-10">
            No properties found.
          </p>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 my-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-lg font-semibold">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
}

export default States;
