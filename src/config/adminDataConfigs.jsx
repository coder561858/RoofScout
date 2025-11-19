import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Reusable functions for action buttons (or define them within the config directly)
const handleCommonAction = (itemName, action) => {
  alert(`${action} for ${itemName}... (Not implemented)`);
};

// --- Houses Configuration (same as before) ---
export const housesConfig = {
  pageTitle: 'Available Houses',
  searchPlaceholder: 'Search Houses...',
  idKey: 'id',
  filterKey: 'title',
  tableHeaders: ['ID', 'Title', 'Owner', 'District', 'Status', 'Actions'],
  initialData: [
    {
      id: '4060',
      title: '324 Tara Place, Pune',
      description: 'Citadel Apartments is among the best located and best maintained properties in Rohnert Park...',
      owner: 'Admin',
      district: 'Pune',
      date: '2022-11-18',
      image: '/house1pb.jpg',
      area: '1200',
      type: 'house',
      priceText: '₹50-90 Lacs',
      status: 'Available'
    },
    {
      id: '4061',
      title: '410 Garden Row, Pune',
      description: 'Comfortable family home with modern amenities and a bright courtyard...',
      owner: 'Admin',
      district: 'Pune',
      date: '2022-11-18',
      image: '/house3ch.png',
      area: '1800',
      type: 'house',
      priceText: '₹1-5 Cr',
      status: 'Occupied'
    },
    {
      id: '4062',
      title: '502 Lakeview Drive, Pune',
      description: 'Spacious 4BR with scenic views and renovated kitchen...',
      owner: 'Admin',
      district: 'Pune',
      date: '2022-11-18',
      image: '/house5ch.jpg',
      area: '4200',
      type: 'house',
      priceText: '₹5-12 Cr',
      status: 'Available'
    },
    {
      id: '4063',
      title: '211 Cedar Lane, Pune',
      description: 'Cozy bungalow with ample garden and parking space...',
      owner: 'Admin',
      district: 'Pune',
      date: '2022-11-18',
      image: '/house4pb.jpg',
      area: '5000',
      type: 'house',
      priceText: '₹4-6 Cr',
      status: 'Available'
    },
  ],
  tableRowRender: (house) => (
    <>
      <td className="px-4 py-2 border">{house.id}</td>
      <td className="px-4 py-2 border">{house.title}</td>
      <td className="px-4 py-2 border">{house.owner}</td>
      <td className="px-4 py-2 border">{house.district}</td>
      <td className={`px-4 py-2 border ${house.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
        {house.status}
      </td>
      <td className="px-4 py-2 border">
        <button onClick={(e) => { e.stopPropagation(); handleCommonAction(house.title, 'View'); }} className="text-blue-600 hover:underline mx-1">View</button>
        <button onClick={(e) => { e.stopPropagation(); handleCommonAction(house.title, 'Edit'); }} className="text-yellow-600 hover:underline mx-1">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); handleCommonAction(house.title, 'Delete'); }} className="text-red-600 hover:underline mx-1">Delete</button>
      </td>
    </>
  ),
  detailsPanelRender: (house, setSelectedItem) => (
    <div className="flex items-start space-x-6">
      <img src={house.image} alt={house.title} className="h-40 w-40 rounded-lg object-cover shadow" />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{house.title}</h2>
        <p className="text-sm text-blue-600 mb-2">{house.district}</p>
        <p><strong>Owner:</strong> {house.owner}</p>
        <p><strong>Area:</strong> {house.area} sqft</p>
        <p><strong>Type:</strong> {house.type}</p>
        <p><strong>Price:</strong> {house.priceText}</p>
        <p><strong>Status:</strong> <span className={`${house.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{house.status}</span></p>
        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{house.description}</p>
        <div className="mt-4 flex space-x-3">
          <button onClick={() => handleCommonAction(house.title, 'Book')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Book House</button>
          <button onClick={() => handleCommonAction(house.title, 'Message')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Message Owner</button>
        </div>
      </div>
    </div>
  ),
};

// --- Clients (Buyer/Seller) Configuration (same as before) ---
export const clientsConfig = {
  pageTitle: 'All Client Library',
  searchPlaceholder: 'Search The User...',
  idKey: 'id',
  filterKey: 'name',
  tableHeaders: ['ID', 'Name', 'Photo', 'Email'],
  initialData: [
    { id: 1, name: "Admin", email: "Admin@gmail.com", photo: "https://i.pravatar.cc/100?img=1", phone: "8978675689", location: "Nashik, Dindori", gender: "Male", type: "Admin", dob: "2000-05-13" },
    { id: 2, name: "Raman Desai", email: "raman@gmail.com", photo: "https://i.pravatar.cc/100?img=2", phone: "6789675678", location: "Nashik, Dindori", gender: "Male", type: "Agent", dob: "1999-11-21" },
    { id: 3, name: "Suhas Pande", email: "suhas@gmail.com", photo: "https://i.pravatar.cc/100?img=3", phone: "7869678967", location: "Nashik, Dindori", gender: "Male", type: "Student", dob: "2002-08-10" },
    { id: 4, name: "Swati Misra", email: "swati@gmail.com", photo: "https://i.pravatar.cc/100?img=4", phone: "8465757575", location: "Pune, Goreg", gender: "Female", type: "Tenant", dob: "2001-03-02" },
    { id: 5, name: "Rohit Sharma", email: "Rohit@gmail.com", photo: "https://i.pravatar.cc/100?img=5", phone: "7789855757", location: "Nashik, Niphad", gender: "Male", type: "Student", dob: "2002-11-13" }
  ],
  tableRowRender: (client) => (
    <>
      <td className="px-4 py-2 border">{client.id}</td>
      <td className="px-4 py-2 border">{client.name}</td>
      <td className="px-4 py-2 border">
        <img src={client.photo} className="h-10 w-10 rounded-full" alt={`${client.name}'s photo`} />
      </td>
      <td className="px-4 py-2 border">{client.email}</td>
    </>
  ),
  detailsPanelRender: (client, setSelectedItem) => (
    <div className="flex items-start space-x-6">
      <img src={client.photo} alt={client.name} className="h-40 w-40 rounded-lg object-cover shadow" />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
        <p className="text-sm text-blue-600 mb-2">{client.location}</p>
        <p><strong>Birth Date:</strong> {client.dob}</p>
        <p><strong>Gender:</strong> {client.gender}</p>
        <p><strong>Type:</strong> {client.type}</p>
        <p><strong>Phone:</strong> {client.phone}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <div className="mt-4 flex space-x-3">
          <button onClick={() => handleCommonAction(client.name, 'Cancel Agreement')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Cancel Agreement</button>
          <button onClick={() => handleCommonAction(client.name, 'Show Owner')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Show Owner</button>
          <button onClick={() => handleCommonAction(client.name, 'Is Check')} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm">Is Check</button>
        </div>
        <div className="mt-4 text-gray-600 text-sm leading-relaxed">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos tempora praesentium neque voluptatem voluptate modi? Labore provident ex voluptatum deserunt.</p>
        </div>
      </div>
    </div>
  ),
};

// --- Properties Configuration (same as before) ---
export const propertiesConfig = {
  pageTitle: 'Available Properties',
  searchPlaceholder: 'Search Properties...',
  idKey: 'id',
  filterKey: 'title',
  tableHeaders: ['ID', 'Title', 'Type', 'Owner', 'District', 'Status', 'Actions'],
  initialData: [
    {
      id: '2001', title: '566 Pound Apartment, Nashik', type: 'Apartment',
      description: 'The apartment is fully furnished and ready to move in...',
      owner: 'Swati Misra', district: 'Nashik', date: '2023-01-10', image: '/flat1.jpg',
      area: '800', price: '₹20-30 Lacs', status: 'Available'
    },
    {
      id: '2002', title: 'Ganga Sagar House 388, Nashik', type: 'House',
      description: 'A beautiful house with a spacious garden, ideal for families.',
      owner: 'Raman Desai', district: 'Nashik', date: '2023-03-01', image: '/house2pb.jpg',
      area: '1500', price: '₹40-60 Lacs', status: 'Rented'
    },
    {
      id: '2003', title: 'Luxury Villa 123, Pune', type: 'Villa',
      description: 'Experience luxury living in this sprawling villa with modern amenities.',
      owner: 'Suhas Pande', district: 'Pune', date: '2023-02-15', image: '/house3ch.png',
      area: '2500', price: '₹1-2 Cr', status: 'Available'
    },
  ],
  tableRowRender: (property) => (
    <>
      <td className="px-4 py-2 border">{property.id}</td>
      <td className="px-4 py-2 border">{property.title}</td>
      <td className="px-4 py-2 border">{property.type}</td>
      <td className="px-4 py-2 border">{property.owner}</td>
      <td className="px-4 py-2 border">{property.district}</td>
      <td className={`px-4 py-2 border ${property.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
        {property.status}
      </td>
      <td className="px-4 py-2 border">
        <button onClick={(e) => { e.stopPropagation(); handleCommonAction(property.title, 'View'); }} className="text-blue-600 hover:underline mx-1">View</button>
        <button onClick={(e) => { e.stopPropagation(); handleCommonAction(property.title, 'Edit'); }} className="text-yellow-600 hover:underline mx-1">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); handleCommonAction(property.title, 'Delete'); }} className="text-red-600 hover:underline mx-1">Delete</button>
      </td>
    </>
  ),
  detailsPanelRender: (property, setSelectedItem) => (
    <div className="flex items-start space-x-6">
      <img src={property.image} alt={property.title} className="h-40 w-40 rounded-lg object-cover shadow" />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
        <p className="text-sm text-blue-600 mb-2">{property.district}</p>
        <p><strong>Type:</strong> {property.type}</p>
        <p><strong>Owner:</strong> {property.owner}</p>
        <p><strong>Area:</strong> {property.area} sqft</p>
        <p><strong>Price:</strong> {property.price}</p>
        <p><strong>Status:</strong> <span className={`${property.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{property.status}</span></p>
        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{property.description}</p>
        <div className="mt-4 flex space-x-3">
          <button onClick={() => handleCommonAction(property.title, 'Approve')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">Approve Listing</button>
          <button onClick={() => handleCommonAction(property.title, 'Reject')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Reject Listing</button>
        </div>
      </div>
    </div>
  ),
};

// --- Tenants Configuration (same as before) ---
export const tenantsConfig = {
  pageTitle: 'All Tenants',
  searchPlaceholder: 'Search The Tenant...',
  idKey: 'id',
  filterKey: 'name',
  tableHeaders: ['ID', 'Name', 'Email', 'House', 'Status'],
  initialData: [
    { id: 1, name: "Swati Misra", email: "swati@gmail.com", house: "566 Pound Apartment, Nashik", phone: "8465757575", status: "Done", checked: true, photo: "https://i.pravatar.cc/100?img=4", rentDuration: "12 Months", startDate: "2024-05-10" },
    { id: 2, name: "Rohit Sharma", email: "rohit@gmail.com", house: "324 Tara Place, Pune", phone: "7789855757", status: "Done", checked: true, photo: "https://i.pravatar.cc/100?img=5", rentDuration: "6 Months", startDate: "2024-09-01" },
    { id: 3, name: "Nitish Rana", email: "nitish@gmail.com", house: "34 Azad Nagar,Rajura, Punjab", phone: "7789855757", status: "Dismiss", checked: false, photo: "https://i.pravatar.cc/100?img=2", rentDuration: "3 Months", startDate: "2024-05-28" },
    { id: 4, name: "Suhas Pande", email: "suhas@gmail.com", house: "Ganga Sagar House 388, Nashik", phone: "7869678967", status: "Done", checked: true, photo: "https://i.pravatar.cc/100?img=3", rentDuration: "9 Months", startDate: "2024-03-15" },
  ],
  tableRowRender: (tenant) => (
    <>
      <td className="px-4 py-2 border">{tenant.id}</td>
      <td className="px-4 py-2 border">{tenant.name}</td>
      <td className="px-4 py-2 border">{tenant.email}</td>
      <td className="px-4 py-2 border">{tenant.house}</td>
      <td className={`px-4 py-2 border ${tenant.status === "Done" ? "text-green-600" : "text-red-600"}`}>
        {tenant.status}
      </td>
    </>
  ),
  detailsPanelRender: (tenant, setSelectedItem) => (
    <div className="flex items-start space-x-6">
      <img src={tenant.photo} alt={tenant.name} className="h-40 w-40 rounded-lg object-cover shadow" />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{tenant.name}</h2>
        <p className="text-sm text-blue-600 mb-2">{tenant.house}</p>
        <p><strong>Email:</strong> {tenant.email}</p>
        <p><strong>Phone:</strong> {tenant.phone}</p>
        <p><strong>Status:</strong> <span className={`${tenant.status === "Done" ? "text-green-600" : "text-red-600"}`}>{tenant.status}</span></p>
        <p><strong>Admin Check:</strong> {tenant.checked ? "✅ Verified" : "❌ Pending"}</p>
        <p><strong>Rent Duration:</strong> {tenant.rentDuration}</p>
        <p><strong>Start Date:</strong> {tenant.startDate}</p>

        <div className="mt-4 flex space-x-3">
          <button onClick={() => handleCommonAction(tenant.name, 'Cancel Rent')} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Cancel Rent</button>
          <button onClick={() => handleCommonAction(tenant.name, 'Contact Tenant')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Contact Tenant</button>
        </div>
        <div className="mt-4 text-gray-600 text-sm leading-relaxed">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia eveniet dolore, sequi ex natus, nobis laboriosam?</p>
        </div>
      </div>
    </div>
  ),
};


// --- Payments Configuration ---
// NEW: Define a separate component for the Payment Details Panel
const PaymentDetailsPanel = ({ bill, setSelectedItem }) => {
  const navigate = useNavigate(); // This is now correctly inside a functional component

  const handleUpdateBillStatus = (billId, newStatus) => {
    const defaultBills = [ // Re-define default bills here or pass as prop if truly dynamic
      { id: 'Bill_5852', from: '19 Nov,2022', to: '19 Dec,2022', amount: 45.0, status: 'Unpaid' },
      { id: 'Bill_3207', from: '19 Dec,2022', to: '19 Jan,2023', amount: 45.0, status: 'Unpaid' },
      { id: 'Bill_5472', from: '19 Jan,2023', to: '19 Feb,2023', amount: 45.0, status: 'Paid' }
    ];
    let currentBills = JSON.parse(localStorage.getItem('bills')) || defaultBills;

    const updatedBills = currentBills.map(b =>
      b.id === billId ? { ...b, status: newStatus } : b
    );
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    // Update the selected item in the parent state so the details panel re-renders
    setSelectedItem(prev => ({ ...prev, status: newStatus }));

    // IMPORTANT: To make the *table* update immediately without a full page refresh,
    // the AdminTablePage needs a way to refresh its internal 'data' state.
    // This is a limitation of passing `initialData` directly.
    // For a simple fix, consider calling window.location.reload()
    // or restructuring AdminTablePage to accept a `refreshData` function prop.
    // For now, assume a page refresh or re-navigation would show the change.
    // A better solution for a real app would involve a global state manager or
    // passing a setter from AdminTablePage to update its internal `data` state directly.
  };

  return (
    <div className="flex items-start space-x-6">
      <img src="/bill-icon.png" alt="Bill Icon" className="h-40 w-40 rounded-lg object-cover shadow" /> {/* Placeholder image */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{bill.id}</h2>
        <p><strong>From:</strong> {bill.from}</p>
        <p><strong>To:</strong> {bill.to}</p>
        <p><strong>Amount:</strong> ₱{bill.amount.toFixed(2)}</p>
        <p><strong>Status:</strong> <span className={`${bill.status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>{bill.status}</span></p>
        <div className="mt-4 flex space-x-3">
          {bill.status === 'Unpaid' && (
            <button
              onClick={() => handleUpdateBillStatus(bill.id, 'Paid')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Mark as Paid
            </button>
          )}
          <button
            onClick={() => navigate('/adm-viewbill', { state: { bill: bill } })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            View Full Bill (PDF)
          </button>
        </div>
        <div className="mt-4 text-gray-600 text-sm leading-relaxed">
          <p>Details about the payment agreement and terms.</p>
        </div>
      </div>
    </div>
  );
};

export const paymentsConfig = {
  pageTitle: 'BILL TABLE',
  searchPlaceholder: 'Search Bills...',
  idKey: 'id',
  filterKey: 'id',
  initialData: (() => {
    const defaultBills = [
      { id: 'Bill_5852', from: '19 Nov,2022', to: '19 Dec,2022', amount: 45.0, status: 'Unpaid' },
      { id: 'Bill_3207', from: '19 Dec,2022', to: '19 Jan,2023', amount: 45.0, status: 'Unpaid' },
      { id: 'Bill_5472', from: '19 Jan,2023', to: '19 Feb,2023', amount: 45.0, status: 'Paid' }
    ];
    try {
      const storedBills = localStorage.getItem('bills');
      return storedBills ? JSON.parse(storedBills) : defaultBills;
    } catch (error) {
      console.error("Failed to parse bills from localStorage", error);
      return defaultBills;
    }
  })(),
  tableHeaders: ['Bill No', 'Date', 'Amount', 'Status', 'Action'],
  tableRowRender: (bill) => (
    <>
      <td className="px-4 py-2 border">{bill.id}</td>
      <td className="px-4 py-2 border">
        {bill.from} <span className="mx-1 text-gray-500">to</span> {bill.to}
      </td>
      <td className="px-4 py-2 border">₱{bill.amount.toFixed(2)}</td>
      <td className={`px-4 py-2 border font-semibold ${bill.status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
        {bill.status}
      </td>
      <td className="px-4 py-2 border">
        <button onClick={(e) => { e.stopPropagation(); handleCommonAction(bill.id, 'View Bill'); }} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">View Bill</button>
      </td>
    </>
  ),
  detailsPanelRender: (bill, setSelectedItem) => (
    // Render the new component, passing the necessary props
    <PaymentDetailsPanel bill={bill} setSelectedItem={setSelectedItem} />
  ),
};