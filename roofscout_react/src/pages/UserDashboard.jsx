// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

// function UserDashboard() {
//   const [loggedUser, setLoggedUser] = useState('');
//   const [activeTab, setActiveTab] = useState('appliedHouses');
//   const [userProfile, setUserProfile] = useState(null);
//   const [tourRequests, setTourRequests] = useState([]);

//   const navigate = useNavigate();

//   const getStoredJSON = (key, defaultVal = null) => {
//     try {
//       const item = localStorage.getItem(key);
//       return item ? JSON.parse(item) : defaultVal;
//     } catch (error) {
//       console.error(`Error parsing JSON from localStorage key "${key}":`, error);
//       return defaultVal;
//     }
//   };

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem('loggedUser');
//     if (!storedUser) {
//       navigate('/login');
//       return;
//     }
//     setLoggedUser(storedUser);

//     const savedProfile = getStoredJSON('userProfile');
//     const savedImage = localStorage.getItem('userProfileImage');
//     if (savedProfile) {
//       setUserProfile({ ...savedProfile, image: savedImage });
//     }

//     const allRequests = getStoredJSON('allTourRequests', []);
//     setTourRequests(allRequests);
//   }, [navigate]);

//   const handleLogout = () => {
//     sessionStorage.removeItem('loggedUser');
//     localStorage.removeItem('userProfile');
//     localStorage.removeItem('userProfileImage');
//     navigate('/login');
//   };

//   const handleTourRequestStatus = (requestId, newStatus) => {
//     const updatedRequests = tourRequests.map(req => 
//       req.id === requestId ? { ...req, status: newStatus } : req
//     );
//     setTourRequests(updatedRequests);
//     localStorage.setItem('allTourRequests', JSON.stringify(updatedRequests));
//   };

//   const displayUserProperties = () => {
//     const userProperties = getStoredJSON('userProperties', []);
//     const myProperties = userProperties.filter(prop => prop.owner === loggedUser);

//     if (myProperties.length === 0) {
//       return <p className="text-gray-600">You haven't listed any properties yet.</p>;
//     }

//     return myProperties.map((property) => {
//       const requestsForThisProperty = tourRequests.filter(
//         req => req.propertyId === property.id
//       );

//       let editPageUrl = '';
//       switch (property.type) {
//         case 'PG': editPageUrl = '/pg'; break;
//         case 'Rent': editPageUrl = '/rent'; break;
//         case 'Sell': editPageUrl = '/sell'; break;
//         default: editPageUrl = '#';
//       }
//       const editLink = `${editPageUrl}?editId=${property.id}`;
//       const iconClass = property.type === 'PG' ? 'ri-hotel-bed-line' : 
//                         property.type === 'Rent' ? 'ri-building-2-line' : 
//                         'ri-home-sale-line';
      
//       return (
//         <div key={property.id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
//           <div className="flex flex-col sm:flex-row gap-4 items-center">
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center text-blue-600 flex-shrink-0 transition-transform duration-300 hover:scale-110">
//               <i className={`${iconClass} text-3xl`}></i>
//             </div>
//             <div className="flex-grow text-center sm:text-left">
//               <h4 className="font-bold text-lg text-gray-800">{property.title || 'N/A'}</h4>
//               <p className="text-sm text-gray-600">{property.type} - {property.details || 'N/A'}</p>
//               <p className="text-sm text-gray-700 font-semibold mt-1">Price: ₹{property.price || 'N/A'}</p>
//             </div>
//             <div className="text-center sm:text-right flex-shrink-0 mt-2 sm:mt-0">
//               <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
//                 property.status === 'Active' ? 'bg-green-100 text-green-700' :
//                 'bg-red-100 text-red-700'
//               }`}>
//                 {property.status || 'Unknown'}
//               </span>
//               <Link to={editLink} className="block text-xs text-blue-600 hover:text-blue-700 hover:underline mt-2 font-medium transition-colors">
//                 View/Edit
//               </Link>
//             </div>
//           </div>

//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <i className="ri-calendar-check-line text-blue-600"></i>
//               Tour Requests for this Property
//             </h5>
//             {requestsForThisProperty.length === 0 ? (
//               <p className="text-sm text-gray-500 italic">No tour requests yet.</p>
//             ) : (
//               <div className="space-y-3">
//                 {requestsForThisProperty.map(req => (
//                   <div key={req.id} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors duration-200">
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{req.buyerName}</p>
//                       <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                         <i className="ri-calendar-line"></i>
//                         Date: {new Date(req.requestDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2 mt-2 sm:mt-0">
//                       <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                         req.status === 'Approved' ? 'bg-green-100 text-green-700' :
//                         req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
//                         'bg-yellow-100 text-yellow-700'
//                       }`}>
//                         {req.status}
//                       </span>
//                       {req.status === 'Pending' && (
//                         <>
//                           <button 
//                             onClick={() => handleTourRequestStatus(req.id, 'Approved')}
//                             className="bg-green-500 text-white text-xs px-3 py-1.5 rounded hover:bg-green-600 font-medium transition-all duration-200 hover:shadow-md"
//                           >
//                             Approve
//                           </button>
//                           <button 
//                             onClick={() => handleTourRequestStatus(req.id, 'Rejected')}
//                             className="bg-red-500 text-white text-xs px-3 py-1.5 rounded hover:bg-red-600 font-medium transition-all duration-200 hover:shadow-md"
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     });
//   };

//   const displayAppliedProperties = () => {
//     const appliedProperties = getStoredJSON('appliedProperties', []);
//     return appliedProperties.length === 0 ? (
//       <p className="text-gray-600">You haven't applied for any houses yet.</p>
//     ) : (
//       appliedProperties.map((application, index) => (
//         <div key={application.id || index} className="border rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-4 items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
//           <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center text-green-600 flex-shrink-0 transition-transform duration-300 hover:scale-110">
//             <i className="ri-building-2-line text-3xl"></i>
//           </div>
//           <div className="flex-grow text-center sm:text-left">
//             <h4 className="font-bold text-lg text-gray-800">{application.title || 'Property Application'}</h4>
//             <p className="text-sm text-gray-600">
//               Applied on: {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'N/A'}
//             </p>
//           </div>
//           <div className="text-center sm:text-right flex-shrink-0 mt-2 sm:mt-0 flex flex-col items-center sm:items-end gap-2">
//             <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
//               application.status === 'Approved' ? 'bg-green-100 text-green-700' :
//               application.status === 'Paid' ? 'bg-cyan-100 text-cyan-700' :
//               application.status === 'Rejected' ? 'bg-red-100 text-red-700' :
//               application.status === 'Viewed' ? 'bg-blue-100 text-blue-700' :
//               'bg-yellow-100 text-yellow-700'
//             }`}>
//               {application.status || 'Pending'}
//             </span>
//             {application.status === 'Approved' && (
//               <Link 
//                 to={`/payment/${application.id}`} 
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:shadow-md"
//               >
//                 Pay Now
//               </Link>
//             )}
//             {application.status === 'Paid' && (
//               <p className="text-sm font-medium text-green-700 flex items-center gap-1">
//                 <i className="ri-checkbox-circle-fill"></i>
//                 Payment Complete
//               </p>
//             )}
//           </div>
//         </div>
//       ))
//     );
//   };

//   return (
//     <div className="bg-gradient-to-br from-blue-100 via-green-100 to-pink-200 font-sans min-h-screen">
//       <header className="bg-white text-white shadow-md">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
//           <div className="flex items-center text-xl font-bold">
//             <h1 className="font-bold text-2xl text-yellow-500 mr-1">
//               <Link to="/">Roof</Link>
//             </h1>
//             <h1 className="font-bold text-2xl text-blue-600">
//               <Link to="/">Scout</Link>
//             </h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-all duration-200 font-medium hover:shadow-md"
//             >
//               Logout
//             </button>
//           </div>
//         </nav>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 hover:shadow-xl transition-shadow duration-300">
//           <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-md flex-shrink-0 transition-transform duration-300 hover:scale-105">
//             <img
//               src={userProfile?.image || `https://avatar.iran.liara.run/public/boy?username=${loggedUser}`}
//               alt="User Profile"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="flex-grow text-center md:text-left">
//             <h2 className="text-2xl font-bold text-gray-800 mb-1">{userProfile?.name || loggedUser || 'User Name'}</h2>
//             <p className="text-gray-600 text-sm md:text-base">{userProfile?.address || 'Address details will appear here.'}</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 text-sm md:text-base">
//               <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
//                 <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Phone:</span>
//                 <span className="text-gray-800 font-medium">{userProfile?.phone || 'Not Available'}</span>
//               </div>
//               <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
//                 <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Mobile:</span>
//                 <span className="text-gray-800 font-medium">{userProfile?.phone || 'Not Available'}</span>
//               </div>
//               <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
//                 <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Email:</span>
//                 <span className="text-gray-800 font-medium">{userProfile?.email || 'Not Available'}</span>
//               </div>
//               <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
//                 <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Password:</span>
//                 <span className="text-gray-800 font-medium">********</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg mb-8">
//           <div className="flex flex-wrap border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('appliedHouses')}
//               className={`flex-grow md:flex-none py-3 px-6 text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200 rounded-tl-lg font-medium ${
//                 activeTab === 'appliedHouses' ? 'bg-blue-600 text-white font-semibold shadow-sm' : ''
//               }`}
//             >
//               Applied House
//             </button>
//             <button
//               onClick={() => setActiveTab('properties')}
//               className={`flex-grow md:flex-none py-3 px-6 text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200 font-medium ${
//                 activeTab === 'properties' ? 'bg-blue-600 text-white font-semibold shadow-sm' : ''
//               }`}
//             >
//               Properties
//             </button>
//             <Link
//               to="/user-profile"
//               className="flex-grow md:flex-none py-3 px-6 text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200 font-medium"
//             >
//               Edit Profile
//             </Link>
//           </div>

//           <div className="p-6">
//             {activeTab === 'appliedHouses' && (
//               <div>
//                 <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Applied Houses</h3>
//                 {displayAppliedProperties()}
//               </div>
//             )}
//             {activeTab === 'properties' && (
//               <div>
//                 <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Listed Properties</h3>
//                 {displayUserProperties()}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default UserDashboard;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function UserDashboard() {
  const [loggedUser, setLoggedUser] = useState('');
  const [activeTab, setActiveTab] = useState('appliedHouses');
  const [userProfile, setUserProfile] = useState(null);
  const [tourRequests, setTourRequests] = useState([]);

  const navigate = useNavigate();

  const getStoredJSON = (key, defaultVal = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage key "${key}":`, error);
      return defaultVal;
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('loggedUser');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setLoggedUser(storedUser);

    const savedProfile = getStoredJSON('userProfile');
    const savedImage = localStorage.getItem('userProfileImage');
    if (savedProfile) {
      setUserProfile({ ...savedProfile, image: savedImage });
    }

    const allRequests = getStoredJSON('allTourRequests', []);
    setTourRequests(allRequests);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedUser');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userProfileImage');
    navigate('/login');
  };

  const handleTourRequestStatus = (requestId, newStatus) => {
    const updatedRequests = tourRequests.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    setTourRequests(updatedRequests);
    localStorage.setItem('allTourRequests', JSON.stringify(updatedRequests));
  };

  // --- OWNER VIEW (Properties I listed) ---
  const displayUserProperties = () => {
    const userProperties = getStoredJSON('userProperties', []);
    const myProperties = userProperties.filter(prop => prop.owner === loggedUser);

    if (myProperties.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 mb-4">
            <i className="ri-home-3-line text-4xl text-blue-400"></i>
          </div>
          <p className="text-gray-500 text-lg">You haven't listed any properties yet.</p>
          <p className="text-gray-400 text-sm mt-2">Start listing to manage your properties here</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {myProperties.map((property) => {
          const requestsForThisProperty = tourRequests.filter(
            req => String(req.propertyId) === String(property.id)
          );

          let editPageUrl = '';
          switch (property.type) {
            case 'PG': editPageUrl = '/pg'; break;
            case 'Rent': editPageUrl = '/rent'; break;
            case 'Sell': editPageUrl = '/sell'; break;
            default: editPageUrl = '#';
          }
          const editLink = `${editPageUrl}?editId=${property.id}`;
          const iconClass = property.type === 'PG' ? 'ri-hotel-bed-line' : 
                            property.type === 'Rent' ? 'ri-building-2-line' : 
                            'ri-home-sale-line';
          
          return (
            <div key={property.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                    <i className={`${iconClass} text-4xl`}></i>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 mb-1">{property.title || 'N/A'}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{property.type}</span>
                          <span className="text-gray-400">•</span>
                          <span>{property.details || 'N/A'}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full shadow-sm ${
                          property.status === 'Active' 
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                            : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                        }`}>
                          {property.status || 'Unknown'}
                        </span>
                        <Link 
                          to={editLink} 
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group transition-all"
                        >
                          <span>View/Edit</span>
                          <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-orange-100">
                      <p className="text-2xl font-bold text-gray-900 flex items-baseline gap-2">
                        <span className="text-orange-600">₹</span>
                        {property.price || 'N/A'}
                        <span className="text-sm font-normal text-gray-500">/ month</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <i className="ri-calendar-check-line text-blue-600 text-lg"></i>
                    </div>
                    Tour Requests
                    <span className="ml-auto text-sm font-normal text-gray-500">
                      ({requestsForThisProperty.length})
                    </span>
                  </h5>
                  {requestsForThisProperty.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <i className="ri-calendar-todo-line text-3xl text-gray-300 mb-2"></i>
                      <p className="text-sm text-gray-400 italic">No tour requests yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requestsForThisProperty.map(req => (
                        <div key={req.id} className="bg-gradient-to-br from-gray-50 to-white p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex-grow">
                              <p className="font-bold text-gray-900 text-base mb-1 flex items-center gap-2">
                                <i className="ri-user-line text-blue-600"></i>
                                {req.buyerName}
                              </p>
                              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                                  <i className="ri-calendar-line text-blue-500"></i>
                                  {new Date(req.requestDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                                  <i className="ri-time-line text-purple-500"></i>
                                  {req.tourDate} at {req.tourTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold px-4 py-2 rounded-lg shadow-sm ${
                                req.status === 'Approved' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                                req.status === 'Rejected' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' :
                                'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                              }`}>
                                {req.status}
                              </span>
                              {req.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleTourRequestStatus(req.id, 'Approved')}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                                  >
                                    <i className="ri-check-line"></i>
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleTourRequestStatus(req.id, 'Rejected')}
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center gap-1"
                                  >
                                    <i className="ri-close-line"></i>
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // --- BUYER VIEW (My Requests & Applications) ---
  const displayAppliedProperties = () => {
    const appliedProperties = getStoredJSON('appliedProperties', []);
    const myTourRequests = tourRequests.filter(req => req.buyerName === loggedUser);

    if (appliedProperties.length === 0 && myTourRequests.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 mb-4">
            <i className="ri-building-line text-4xl text-purple-400"></i>
          </div>
          <p className="text-gray-500 text-lg">You haven't applied for any houses or requested tours yet.</p>
          <p className="text-gray-400 text-sm mt-2">Start exploring properties to see them here</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* 1. Show My Tour Requests */}
        {myTourRequests.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <i className="ri-walk-line text-white text-xl"></i>
              </div>
              <h4 className="font-bold text-xl text-gray-900">My Tour Requests</h4>
              <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold">
                {myTourRequests.length} {myTourRequests.length === 1 ? 'Request' : 'Requests'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTourRequests.map(req => (
                <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <i className="ri-calendar-event-line text-3xl"></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">Tour Scheduled</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <i className="ri-calendar-line text-purple-500"></i>
                          <span className="font-semibold">{req.tourDate}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <i className="ri-time-line text-pink-500"></i>
                          <span className="font-semibold">{req.tourTime}</span>
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className={`inline-block text-xs font-bold px-4 py-2 rounded-lg shadow-sm ${
                          req.status === 'Approved' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                          req.status === 'Rejected' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' :
                          'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Show My Payment Applications */}
        {appliedProperties.length > 0 && (
          <div>
            {myTourRequests.length > 0 && (
              <div className="flex items-center gap-3 mb-5 mt-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <i className="ri-file-list-3-line text-white text-xl"></i>
                </div>
                <h4 className="font-bold text-xl text-gray-900">Rental Applications</h4>
                <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold">
                  {appliedProperties.length} {appliedProperties.length === 1 ? 'Application' : 'Applications'}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-5">
              {appliedProperties.map((application, index) => (
                <div key={application.id || index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                        <i className="ri-building-2-line text-4xl"></i>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-xl text-gray-900 mb-2">{application.title || 'Property Application'}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                          <i className="ri-calendar-check-line text-green-500"></i>
                          Applied on: <span className="font-semibold">{application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'N/A'}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`text-xs font-bold px-4 py-2 rounded-lg shadow-sm ${
                            application.status === 'Approved' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                            application.status === 'Paid' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' :
                            application.status === 'Rejected' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' :
                            application.status === 'Viewed' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white' :
                            'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                          }`}>
                            {application.status || 'Pending'}
                          </span>
                          {application.status === 'Approved' && (
                            <Link 
                              to={`/payment/${application.id}`} 
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                            >
                              <i className="ri-secure-payment-line"></i>
                              Pay Now
                            </Link>
                          )}
                          {application.status === 'Paid' && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-2 rounded-xl border border-cyan-200">
                              <i className="ri-checkbox-circle-fill text-cyan-600 text-lg"></i>
                              <span className="text-sm font-bold text-cyan-700">Payment Complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans min-h-screen">
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center text-xl font-bold">
            <h1 className="font-extrabold text-3xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mr-1">
              <Link to="/">Roof</Link>
            </h1>
            <h1 className="font-extrabold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Link to="/">Scout</Link>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm transition-all duration-200 font-bold hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <i className="ri-logout-box-r-line"></i>
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-36 h-36 md:w-52 md:h-52 rounded-2xl overflow-hidden border-4 border-white shadow-2xl flex-shrink-0 transition-transform duration-300 hover:scale-105 ring-4 ring-blue-100">
                <img
                  src={userProfile?.image || `https://avatar.iran.liara.run/public/boy?username=${loggedUser}`}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="ri-check-line text-white text-2xl font-bold"></i>
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{userProfile?.name || loggedUser || 'User Name'}</h2>
              <p className="text-gray-500 text-base mb-6 flex items-center justify-center md:justify-start gap-2">
                <i className="ri-map-pin-line text-red-500"></i>
                {userProfile?.address || 'Address details will appear here.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <i className="ri-phone-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Phone</span>
                  </div>
                  <span className="text-gray-900 font-semibold text-base block pl-13">{userProfile?.phone || 'Not Available'}</span>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <i className="ri-smartphone-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Mobile</span>
                  </div>
                  <span className="text-gray-900 font-semibold text-base block pl-13">{userProfile?.phone || 'Not Available'}</span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <i className="ri-mail-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Email</span>
                  </div>
                  <span className="text-gray-900 font-semibold text-base block pl-13 truncate">{userProfile?.email || 'Not Available'}</span>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <i className="ri-lock-password-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Password</span>
                  </div>
                  <span className="text-gray-900 font-semibold text-base block pl-13">••••••••</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="flex flex-wrap bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('appliedHouses')}
              className={`flex-grow md:flex-none py-3 px-6 text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200 font-semibold text-sm ${
                activeTab === 'appliedHouses' 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                  : ''
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ri-home-heart-line"></i>
                Applied Houses
              </span>
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-grow md:flex-none py-3 px-6 text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200 font-semibold text-sm ${
                activeTab === 'properties' 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                  : ''
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ri-building-4-line"></i>
                My Properties
              </span>
            </button>
            <Link
              to="/user-profile"
              className="flex-grow md:flex-none py-3 px-6 text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <i className="ri-user-settings-line"></i>
              Edit Profile
            </Link>
          </div>

          <div className="p-6">
            {activeTab === 'appliedHouses' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Dashboard</h3>
                {displayAppliedProperties()}
              </div>
            )}
            {activeTab === 'properties' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Listed Properties</h3>
                {displayUserProperties()}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;