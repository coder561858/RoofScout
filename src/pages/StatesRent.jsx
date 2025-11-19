import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 🔵 Fetch + Merge Rent APIs (same pattern as Sell page)
async function fetchAllRentProperties() {
  const urls = [
    "https://mocki.io/v1/1cec7da3-3a48-4c04-b874-2a20acf7e63e",
    "https://mocki.io/v1/70c72499-a443-4fe4-9c74-714824d37ff4",
    "https://mocki.io/v1/3687324e-18cc-4c72-a6dd-dd7279223666",
    "https://mocki.io/v1/61c4110e-fad8-45c5-b073-762f866cc904"
  ];

  let finalData = {};

  try {
    const responses = await Promise.all(urls.map(url => fetch(url)));
    const jsonArrays = await Promise.all(responses.map(res => res.json()));

    jsonArrays.forEach(data => {
      Object.keys(data).forEach(state => {
        finalData[state] = data[state];
      });
    });

    return finalData;
  } catch (error) {
    console.error("Rent API Fetch Error:", error);
    return {};
  }
}

function StatesRent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [allStates, setAllStates] = useState({});
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', price: 'all' });
  const [sortType, setSortType] = useState("none");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Format API price text to desired rent label
  const formatRentPrice = (txt = "") => {
    let s = String(txt);
    // Normalize spacing around '/'
    s = s.replace(/\s*\/\s*/g, '/');
    // Convert common variants to '/month'
    s = s.replace(/\/month/i, '/month');
    s = s.replace(/per\s*month/i, '/month');
    s = s.replace(/per\s*mon/i, '/month');
    s = s.replace(/\s+month/i, '/month');
    // Collapse duplicates just in case
    s = s.replace(/(?:\/month)+/i, '/month');
    // If no '/month' present, append it
    if (!/\/month/i.test(s)) {
      s = s.trim() + ' / month';
    }
    return s.trim();
  };

  // Load all properties from APIs
  useEffect(() => {
    async function load() {
      const mergedData = await fetchAllRentProperties();
      // Normalize rent pricing to ~₹10,000 / month for demo
      const adjusted = Object.fromEntries(
        Object.entries(mergedData).map(([state, arr]) => [
          state,
          (arr || []).map((prop) => ({
            ...prop,
            dataPrice: 10,
            priceText: '₹10,000 / month',
          })),
        ])
      );

      setAllStates(adjusted);
      const selectedState = (searchParams.get('state') || 'punjab').toLowerCase();
      const data = adjusted[selectedState] || [];
      setFilteredProperties(data);
    }
    load();
  }, [searchParams]);

  // Sorting Logic
  const sortData = (data) => {
    if (sortType === "low") return [...data].sort((a, b) => a.dataPrice - b.dataPrice);
    if (sortType === "high") return [...data].sort((a, b) => b.dataPrice - a.dataPrice);
    if (sortType === "area") return [...data].sort((a, b) => a.area - b.area);
    return data;
  };

  // Apply Filters
  const applyFilters = () => {
    const selectedState = (searchParams.get('state') || 'punjab').toLowerCase();
    let filtered = (allStates[selectedState] || []).filter(prop => {
      let matchType = filters.type === 'all' || prop.type === filters.type;
      let matchPrice = true;

      const p = prop.dataPrice;

      switch (filters.price) {
        case '1': matchPrice = p < 15; break;
        case '2': matchPrice = p >= 15 && p < 30; break;
        case '3': matchPrice = p >= 30 && p < 50; break;
        case '4': matchPrice = p >= 50; break;
        default: matchPrice = true;
      }

      return matchType && matchPrice;
    });

    setPage(1);
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    const state = (searchParams.get('state') || 'punjab').toLowerCase();
    setFilters({ type: 'all', price: 'all' });
    setSortType("none");
    setFilteredProperties(allStates[state] || []);
    setPage(1);
  };

  // Pagination Data
  const sortedData = sortData(filteredProperties);
  const startIndex = (page - 1) * perPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(sortedData.length / perPage);

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
              <label className="block mb-1 font-semibold">Price Range (per month)</label>
              <select
                value={filters.price}
                onChange={e => setFilters({ ...filters, price: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="1">Below ₹15,000/month</option>
                <option value="2">₹15,000 - ₹30,000/month</option>
                <option value="3">₹30,000 - ₹50,000/month</option>
                <option value="4">Above ₹50,000/month</option>
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
              <p className="text-gray-600 dark:text-gray-300">{formatRentPrice(prop.priceText)}</p>
              <p className="font-bold mt-1">Area: {prop.area} sq ft</p>
              <p className="text-sm">Type: {prop.type.toUpperCase()}</p>

              <button
                onClick={() =>
                  navigate(`/viewdetail?houseId=${prop.id}&title=${encodeURIComponent(prop.title)}&priceText=${encodeURIComponent(formatRentPrice(prop.priceText))}&image=${encodeURIComponent(prop.image)}&area=${prop.area}&type=${prop.type}`)
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

export default StatesRent;