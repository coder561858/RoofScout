// src/contexts/PropertyContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const PropertyContext = createContext();

const API_URLS = [
  "https://mocki.io/v1/1cec7da3-3a48-4c04-b874-2a20acf7e63e",
  "https://mocki.io/v1/70c72499-a443-4fe4-9c74-714824d37ff4",
  "https://mocki.io/v1/3687324e-18cc-4c72-a6dd-dd7279223666",
  "https://mocki.io/v1/61c4110e-fad8-45c5-b073-762f866cc904"
];

const ADMIN_SEED = [
  {
    id: '4060',
    title: '324 Tara Place, Pune',
    description: 'Citadel Apartments is among the best located...',
    owner: 'Admin',
    district: 'Pune',
    date: '2022-11-18',
    image: '/house1pb.jpg',
    area: '1200',
    type: 'house',
    priceText: '₹50-90 Lacs'
  },
  {
    id: '4061',
    title: '410 Garden Row, Pune',
    description: 'Comfortable family home with modern amenities...',
    owner: 'Admin',
    district: 'Pune',
    date: '2022-11-18',
    image: '/house3ch.png',
    area: '1800',
    type: 'house',
    priceText: '₹1-5 Cr'
  },
  {
    id: '4062',
    title: '502 Lakeview Drive, Pune',
    description: 'Spacious 4BR with scenic views...',
    owner: 'Admin',
    district: 'Pune',
    date: '2022-11-18',
    image: '/house5ch.jpg',
    area: '4200',
    type: 'house',
    priceText: '₹5-12 Cr'
  },
];

export function PropertyProvider({ children }) {
  const [apiProperties, setApiProperties] = useState([]);
  const [adminProperties, setAdminProperties] = useState(() => {
    try {
      const saved = localStorage.getItem('adminProperties');
      return saved ? JSON.parse(saved) : ADMIN_SEED;
    } catch {
      return ADMIN_SEED;
    }
  });
  const [hiddenIds, setHiddenIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hiddenIds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper → Generates Random Date
  const generateRandomDate = () => {
    const year = 2025;
    const month = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0');  // 01–10
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');    // 01–28
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      setLoading(true);
      try {
        const responses = await Promise.all(API_URLS.map(url => fetch(url)));
        const jsonArrays = await Promise.all(responses.map(r => r.json()));

        const flat = [];

        jsonArrays.forEach(obj => {
          Object.keys(obj || {}).forEach(stateKey => {
            const arr = obj[stateKey] || [];

            arr.forEach(item => {
              const normalized = {
                ...item,
                id: item.id?.toString() || `${stateKey}-${Math.random().toString(36).slice(2,9)}`,
                state: stateKey,
                // ⭐ ADD RANDOM DATE ONLY FOR API PROPERTIES ⭐
                date: generateRandomDate()
              };

              flat.push(normalized);
            });
          });
        });

        if (mounted) setApiProperties(flat);

      } catch (err) {
        console.error("PropertyProvider fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => { mounted = false };
  }, []);

  // persist adminProperties and hiddenIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('adminProperties', JSON.stringify(adminProperties));
    } catch {}
  }, [adminProperties]);

  useEffect(() => {
    try {
      localStorage.setItem('hiddenIds', JSON.stringify(hiddenIds));
    } catch {}
  }, [hiddenIds]);

  const hideProperty = id => {
    setHiddenIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const addAdminProperty = prop => {
    setAdminProperties(prev => [prop, ...prev]);
  };

  const editAdminProperty = updated => {
    setAdminProperties(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
  };

  // New: update any property (admin or api) locally
  const updateProperty = (id, newData) => {
    // first try adminProperties
    const foundAdmin = adminProperties.some(p => p.id === id);
    if (foundAdmin) {
      setAdminProperties(prev => prev.map(p => p.id === id ? { ...p, ...newData, id } : p));
      return;
    }

    // else update apiProperties locally (non-persistent to backend)
    setApiProperties(prev => prev.map(p => p.id === id ? { ...p, ...newData, id } : p));
  };

  const getCombinedProperties = (filter = { mode: 'all', state: null }) => {
    const apiFiltered = apiProperties.filter(p => !hiddenIds.includes(p.id));
    const adminFiltered = adminProperties.filter(p => !hiddenIds.includes(p.id));

    let combined = [...adminFiltered, ...apiFiltered];

    if (filter.mode === 'buy') {
      combined = combined.filter(p => p.type?.toLowerCase() !== 'rent');
    } 
    else if (filter.mode === 'rent') {
      const matchRent = ['rent', 'pg'];
      combined = combined.filter(p => {
        const t = String(p.type || '').toLowerCase();
        const pt = String(p.priceText || '').toLowerCase();
        return matchRent.includes(t) || pt.includes('/month') || pt.includes('per month');
      });
    }

    if (filter.state) {
      combined = combined.filter(p =>
        String(p.state || p.district || '')
          .toLowerCase()
          .includes(String(filter.state).toLowerCase())
      );
    }

    return combined;
  };

  return (
    <PropertyContext.Provider value={{
      apiProperties,
      adminProperties,
      hiddenIds,
      loading,
      hideProperty,
      addAdminProperty,
      editAdminProperty,
      updateProperty,      // <-- export updateProperty
      getCombinedProperties,
    }}>
      {children}
    </PropertyContext.Provider>
  );
}
