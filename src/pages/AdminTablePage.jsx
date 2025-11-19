import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation to get state passed from navigate

function AdminTablePage({ config }) {
  const {
    pageTitle,
    searchPlaceholder,
    tableHeaders,
    tableRowRender, // Function to render a table row
    detailsPanelRender, // Function to render the details panel
    initialData,
    idKey = 'id', // Default key for unique ID, customizable
    filterKey = 'name', // Default key for filtering, customizable
  } = config;

  const [data, setData] = useState(initialData); // Main data for the table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Effect to filter data based on search term
  useEffect(() => {
    const filtered = initialData.filter(item =>
      item[filterKey]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
    // Hide details if search is cleared or no results
    if (searchTerm === "" || filtered.length === 0) {
      setSelectedItem(null);
    }
  }, [searchTerm, initialData, filterKey]); // Re-run when searchTerm or initialData/filterKey changes

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="bg-gray-100 font-sans">
      {/* Navbar - (You might want to make this a separate reusable component) */}
      <div className="nav flex justify-between h-20 items-center shadow-lg p-4 bg-gray-700">
        <div className="flex items-center text-4xl font-bold">
          <img src="/logoRS.jpg" alt="RoofScout Logo" className="h-16 w-16 mr-2 rounded-full" />
          <h1 className="font-bold text-2xl text-yellow-500">
            <Link to="/">Roof</Link>
          </h1>
          <h1 className="font-bold text-2xl text-blue-600">
            <Link to="/">Scout</Link>
          </h1>
        </div>
        <div className="flex space-x-4 text-white">
          <span>Admin</span>
          <Link to="/" className="hover:text-blue-400">Logout</Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - (You might want to make this a separate reusable component) */}
        {/* NOTE: Sidebar links will need to be updated to pass data for AdminTablePage. */}
        {/* For now, it's just a placeholder, we'll update it in App.jsx */}
        <aside className="bg-gray-900 text-white w-64 min-h-screen p-4 space-y-4">
          <Link to="/AdminDashboard" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
            <i className="fa-solid fa-circle-info text-blue-700"></i><span>Info</span>
          </Link>
          {/* Example of how links will be updated (exact paths will be determined in App.jsx) */}
          <Link to="/admin/houses" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
            <i className="fa-solid fa-house text-blue-400"></i><span>Houses</span>
          </Link>
          <Link to="/admin/clients" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
            <i className="fa-solid fa-user text-purple-400"></i><span>Buyer/Seller</span>
          </Link>
          <Link to="/admin/properties" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
            <i className="fa-regular fa-building text-amber-400"></i><span>Properties</span>
          </Link>
          <Link to="/admin/tenants" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
            <i className="fa-solid fa-user text-cyan-400"></i><span>Tenants</span>
          </Link>
          <Link to="/admin/payments" className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded">
            <i className="fa-regular fa-money-bill-1 text-green-500"></i><span>Payment</span>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">{pageTitle}</h2>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="border border-gray-400 bg-gray-100 focus:outline-none focus:border-blue-500 p-1 text-sm w-64"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <p className="text-gray-500 mb-4 text-sm">{pageTitle.replace('All ', '')} Details...</p>

          <div className="grid grid-cols-2 gap-8">
            {/* Table Section */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index} className="px-4 py-2 border">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map(item => (
                      <tr
                        key={item[idKey]}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(item)}
                      >
                        {tableRowRender(item)}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={tableHeaders.length} className="px-4 py-2 text-center text-gray-500">No {pageTitle.toLowerCase().replace('all ', '')} found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Details Section */}
            <div className={`p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-700 ${selectedItem ? '' : 'hidden'}`}>
              {selectedItem ? (
                // Use the provided render function for details
                detailsPanelRender(selectedItem, setSelectedItem) // Pass setSelectedItem if details need to modify it
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2">Select an item to view details</h3>
                  <p className="text-gray-500">Click on any row from the table to view details.</p>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminTablePage;