import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// All Properties
const PROPERTIES = [
  { id: 'A001', title: 'Sector 14 , Chandigarh', priceText: '₹15-32 Lacs', price: 15, area: 900, type: 'house', image: '/house1.jpg' },
  { id: 'A002', title: '405 Lock House , Sector 12 , Chandigarh', priceText: '₹1-7 Cr', price: 100, area: 3000, type: 'house', image: '/house2ch.jpg' },
  { id: 'A003', title: '324 Tara Place, Sector 16 , Chandigarh', priceText: '₹50-84 Lacs', price: 60, area: 1200, type: 'house', image: '/house3ch.png' },
  { id: 'A004', title: '44 Timber Road, Chandigarh', priceText: '₹15-35 Cr', price: 1500, area: 6000, type: 'house', image: '/house4ch.jpg' },
  { id: 'A005', title: 'Sector 26, Chandigarh', priceText: '₹5-19 Cr', price: 500, area: 3500, type: 'house', image: '/house5ch.jpg' },
  { id: 'A006', title: 'PGI road , Sector 16 , Chandigarh', priceText: '₹16-27 Lacs', price: 170, area: 1100, type: 'house', image: '/house6ch.jpg' },
  { id: 'A007', title: 'Mansa , Punjab', priceText: '₹5 Cr', price: 500, area: 4200, type: 'house', image: '/house1pb.jpg' },
  { id: 'A008', title: '405 Dera Bassi, Punjab', priceText: '₹5 Cr', price: 500, area: 3500, type: 'house', image: '/house2pb.jpg' },
  { id: 'A009', title: '324 Tara Place, Pune', priceText: '₹5 Cr', price: 500, area: 1200, type: 'house', image: '/house3pb.jpg' },
  { id: 'A010', title: '324 Tara Place, Pune', priceText: '₹5 Cr', price: 500, area: 1800, type: 'house', image: '/house4pb.jpg' },
  { id: 'A011', title: '324 Tara Place, Pune', priceText: '₹5 Cr', price: 500, area: 4200, type: 'house', image: '/house5pb.jpg' },
  { id: 'A012', title: '324 Tara Place, Pune', priceText: '₹5 Cr', price: 500, area: 5000, type: 'house', image: '/house6pb.jpg' },
  { id: '5060', title: 'Mansa , Punjab', priceText: '₹5 Cr', price: 500, area: 5000, type: 'plot', image: 'https://th.bing.com/th/id/OIP.rtBKbxWD-cO_JbfK9Rl8KgHaFj?w=222&h=180' },
  { id: '5061', title: '405 Dera Bassi, Punjab', priceText: '₹5 Cr', price: 500, area: 5000, type: 'plot', image: 'https://th.bing.com/th/id/OIP.fjA63g4LynWtnfeCIwuO0wHaEK?w=265&h=180' },
  { id: '5062', title: '324 Tara Place, Punjab', priceText: '₹5 Cr', price: 500, area: 5000, type: 'plot', image: 'https://th.bing.com/th/id/OIP.8XehqTzGtglzlbPglw_jxQHaEJ?w=328&h=184' },
  { id: '5063', title: '324 Tara Place, Punjab', priceText: '₹5 Cr', price: 500, area: 5000, type: 'plot', image: 'https://th.bing.com/th/id/OIP.t5si8dD57J5rZX4fWK5jagAAAA?w=224&h=180' },
  { id: '5064', title: '324 Tara Place, Punjab', priceText: '₹4 Cr', price: 400, area: 5000, type: 'plot', image: 'https://th.bing.com/th/id/OIP.S-nsr8yVkJzy9AFgomOHYwAAAA?w=230&h=180' },
  { id: '5065', title: '324 Tara Place, Punjab', priceText: '₹2 Cr', price: 200, area: 5000, type: 'plot', image: 'https://th.bing.com/th/id/OIP.5k9mVM1IqxncdzJL8fA5jgHaFj?w=254&h=191' },
];

function AllProperties() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: "all",
    price: "all"
  });

  const [sortType, setSortType] = useState("none");
  const [filteredProperties, setFilteredProperties] = useState(PROPERTIES);

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Apply Filters
  const applyFilters = () => {
    let filtered = PROPERTIES.filter((prop) => {
      let matchType = filters.type === "all" || prop.type === filters.type;
      let matchPrice = true;

      const p = prop.price;

      switch (filters.price) {
        case "1": matchPrice = p < 50; break;
        case "2": matchPrice = p >= 50 && p < 200; break;
        case "3": matchPrice = p >= 200 && p < 500; break;
        case "4": matchPrice = p >= 500; break;
        default: matchPrice = true;
      }

      return matchType && matchPrice;
    });

    setPage(1);
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setFilters({ type: "all", price: "all" });
    setSortType("none");
    setFilteredProperties(PROPERTIES);
    setPage(1);
  };

  // Sorting
  const sortData = (data) => {
    if (sortType === "low") return [...data].sort((a, b) => a.price - b.price);
    if (sortType === "high") return [...data].sort((a, b) => b.price - a.price);
    if (sortType === "area") return [...data].sort((a, b) => a.area - b.area);
    return data;
  };

  const sortedData = sortData(filteredProperties);

  const startIndex = (page - 1) * perPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(sortedData.length / perPage);

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 mt-6 dark:text-white">
        <h1 className="text-3xl font-bold mb-6">All Properties</h1>

        {/* FILTER SECTION */}
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg mb-8 shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Property Type */}
            <div>
              <label className="block mb-1 font-semibold">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
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
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="1">Below ₹50 Lacs</option>
                <option value="2">₹50 Lacs - ₹2 Cr</option>
                <option value="3">₹2 Cr - ₹5 Cr</option>
                <option value="4">Above ₹5 Cr</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block mb-1 font-semibold">Sort By</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
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
            <div
              key={idx}
              className="border rounded-2xl shadow p-4 bg-gray-200 dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <img src={prop.image} className="w-full h-48 object-cover rounded" alt="" />
              <h2 className="text-xl font-semibold mt-2">{prop.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{prop.priceText}</p>
              <p className="font-bold mt-1">Area: {prop.area} sq ft</p>
              <p className="text-sm">Type: {prop.type.toUpperCase()}</p>

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

export default AllProperties;
