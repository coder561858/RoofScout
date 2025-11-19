import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// Import necessary icons for the new navbar
import { Sun, Moon, Menu } from 'lucide-react'; 

function UserDashboard() {
  const [loggedUser, setLoggedUser] = useState('');
  const [activeTab, setActiveTab] = useState('appliedHouses');
  const [userProfile, setUserProfile] = useState(null);
  const [tourRequests, setTourRequests] = useState([]);

  const navigate = useNavigate();

  // 1. --- DARK MODE STATE AND LOGIC ---
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rs-theme') || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    try { localStorage.setItem('rs-theme', theme); } catch {}
  }, [theme]);

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
          <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't listed any properties yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Start listing to manage your properties here</p>
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
            <div key={property.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                    <i className={`${iconClass} text-4xl`}></i>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-1">{property.title || 'N/A'}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">{property.type}</span>
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
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 group transition-all"
                        >
                          <span>View/Edit</span>
                          <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-orange-100 dark:border-gray-600">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
                        <span className="text-orange-600 dark:text-orange-400">₹</span>
                        {property.price || 'N/A'}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-300">/ month</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <i className="ri-calendar-check-line text-blue-600 dark:text-blue-400 text-lg"></i>
                    </div>
                    Tour Requests
                    <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({requestsForThisProperty.length})
                    </span>
                  </h5>
                  {requestsForThisProperty.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <i className="ri-calendar-todo-line text-3xl text-gray-300 dark:text-gray-500 mb-2"></i>
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">No tour requests yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {requestsForThisProperty.map(req => (
                        <div key={req.id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-all duration-200">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex-grow">
                              <p className="font-bold text-gray-900 dark:text-white text-base mb-1 flex items-center gap-2">
                                <i className="ri-user-line text-blue-600 dark:text-blue-400"></i>
                                {req.buyerName}
                              </p>
                              <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
                                <span className="flex items-center gap-1.5 bg-white dark:bg-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-500">
                                  <i className="ri-calendar-line text-blue-500 dark:text-blue-400"></i>
                                  {new Date(req.requestDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1.5 bg-white dark:bg-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-500">
                                  <i className="ri-time-line text-purple-500 dark:text-purple-400"></i>
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
          <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't applied for any houses or requested tours yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Start exploring properties to see them here</p>
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
              <h4 className="font-bold text-xl text-gray-900 dark:text-white">My Tour Requests</h4>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold">
                {myTourRequests.length} {myTourRequests.length === 1 ? 'Request' : 'Requests'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTourRequests.map(req => (
                <div key={req.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <i className="ri-calendar-event-line text-3xl"></i>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Tour Scheduled</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <i className="ri-calendar-line text-purple-500 dark:text-purple-400"></i>
                          <span className="font-semibold">{req.tourDate}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <i className="ri-time-line text-pink-500 dark:text-pink-400"></i>
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
                <h4 className="font-bold text-xl text-gray-900 dark:text-white">Rental Applications</h4>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-semibold">
                  {appliedProperties.length} {appliedProperties.length === 1 ? 'Application' : 'Applications'}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-5">
              {appliedProperties.map((application, index) => (
                <div key={application.id || index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                        <i className="ri-building-2-line text-4xl"></i>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{application.title || 'Property Application'}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2 mb-4">
                          <i className="ri-calendar-check-line text-green-500 dark:text-green-400"></i>
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
                            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-cyan-800 px-4 py-2 rounded-xl border border-cyan-200 dark:border-cyan-700">
                              <i className="ri-checkbox-circle-fill text-cyan-600 dark:text-cyan-400 text-lg"></i>
                              <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">Payment Complete</span>
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
    <div className={`transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans min-h-screen'
    }`}>
      
      {/* 2. --- ADMIN-STYLE NAVBAR --- */}
      <div className={`backdrop-blur-md ${
        theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/60'
      } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>

        <div className="flex items-center gap-4">
         

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="RoofScout" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/">
                  <span className="text-yellow-400">Roof</span>
                  <span className="text-blue-500">Scout</span>
                </Link>
              </h1>
              <p className="text-sm opacity-70">User Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* 3. DARK MODE BUTTON */}
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
            className="px-3 py-2 border rounded hover:shadow bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm transition-all duration-200 font-bold hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <i className="ri-logout-box-r-line"></i>
            Logout
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-36 h-36 md:w-52 md:h-52 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl flex-shrink-0 transition-transform duration-300 hover:scale-105 ring-4 ring-blue-100 dark:ring-blue-900">
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
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{userProfile?.name || loggedUser || 'User Name'}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-base mb-6 flex items-center justify-center md:justify-start gap-2">
                <i className="ri-map-pin-line text-red-500"></i>
                {userProfile?.address || 'Address details will appear here.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl border border-blue-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <i className="ri-phone-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Phone</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-base block pl-13">{userProfile?.phone || 'Not Available'}</span>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl border border-purple-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <i className="ri-smartphone-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Mobile</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-base block pl-13">{userProfile?.phone || 'Not Available'}</span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl border border-green-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <i className="ri-mail-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Email</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-base block pl-13 truncate">{userProfile?.email || 'Not Available'}</span>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl border border-orange-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <i className="ri-lock-password-line text-white text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Password</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-base block pl-13">••••••••</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('appliedHouses')}
              className={`flex-grow md:flex-none py-3 px-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 font-semibold text-sm ${
                activeTab === 'appliedHouses' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
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
              className={`flex-grow md:flex-none py-3 px-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 font-semibold text-sm ${
                activeTab === 'properties' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
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
              className="flex-grow md:flex-none py-3 px-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <i className="ri-user-settings-line"></i>
              Edit Profile
            </Link>
          </div>

          <div className="p-6">
            {activeTab === 'appliedHouses' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Dashboard</h3>
                {displayAppliedProperties()}
              </div>
            )}
            {activeTab === 'properties' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Listed Properties</h3>
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