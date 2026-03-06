// src/contexts/PropertyContextRent.jsx
import React, { createContext, useEffect, useState } from "react";

export const RentContext = createContext();

// ⭐ RENT API URLs PROVIDED BY YOU ⭐
const RENT_API_URLS = [
  "https://mocki.io/v1/f84d148d-3089-4ef7-ab04-4c4963233feb",
  "https://mocki.io/v1/c547ea14-d7a8-437c-b26e-ae284e03a18b",
  "https://mocki.io/v1/9c9c24ba-66d7-413f-8147-29418cf72449",
  "https://mocki.io/v1/39c67d51-3cab-4b40-ba18-6cf0f634adc1",
];

// ⭐ Admin seed for RENT properties
const ADMIN_RENT_SEED = [
  {
    id: "9001",
    title: "Admin Rental – 2BHK Apartment",
    description: "Spacious apartment for rent...",
    owner: "Admin",
    district: "Pune",
    date: "2022-11-18",
    image: '/house2ch.jpg',
    area: "1200",
    type: "house",
    priceText: "₹15,000 / month",
  },
  {
    id: "9002",
    title: "Admin Rental – PG Room",
    description: "Clean & affordable PG...",
    owner: "Admin",
    district: "Mumbai",
    date: "2022-11-18",
    image: "/rent2.png",
    area: "300",
    type: "pg",
    priceText: "₹6,000 / month",
  },
];

export function RentProvider({ children }) {
  const [apiRentProperties, setApiRentProperties] = useState([]);
  const [adminRentProperties, setAdminRentProperties] = useState(() => {
    try {
      const saved = localStorage.getItem("adminRentProperties");
      return saved ? JSON.parse(saved) : ADMIN_RENT_SEED;
    } catch {
      return ADMIN_RENT_SEED;
    }
  });

  const [hiddenRentIds, setHiddenRentIds] = useState(() => {
    try {
      const saved = localStorage.getItem("hiddenRentIds");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loadingRent, setLoadingRent] = useState(true);

  // helper: random date
  const randomDate = () => {
    const year = 2025;
    const month = String(Math.floor(Math.random() * 10) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [refreshRentTrigger, setRefreshRentTrigger] = useState(0);

  const refreshRentProperties = () => {
    setRefreshRentTrigger(prev => prev + 1);
  };

  useEffect(() => {
    let mounted = true;

    async function fetchRent() {
      setLoadingRent(true);

      try {
        // 1. Fetch from our REAL Express backend (Only Rentals)
        let backendProperties = [];
        try {
          const res = await fetch(`http://localhost:5000/api/properties?type=rent,pg&t=${Date.now()}`);
          const data = await res.json();
          if (data.success) {
            backendProperties = data.properties.map(p => ({
              ...p,
              // Map backend fields to frontend expected fields
              priceText: p.priceText || `₹${Number(p.price).toLocaleString("en-IN")} / month`,
              dataPrice: Number(p.price),
              owner: p.owner?.name || "Owner",
              location: p.location || `${p.address}, ${p.state}`,
              type: p.type?.toLowerCase() || "rent",
              district: p.state,
              date: p.createdAt || randomDate()
            }));
          }
        } catch (e) {
          console.error("Failed to fetch rent from real backend", e);
        }

        // 2. Fetch from Mocki API for dummy data filling
        const responses = await Promise.all(RENT_API_URLS.map((u) => fetch(u).catch(() => null)));
        const validResponses = responses.filter(r => r && r.ok);
        const jsonArrays = await Promise.all(validResponses.map((r) => r.json()));

        const flatMocki = [];
        jsonArrays.forEach((obj) => {
          Object.keys(obj || {}).forEach((stateKey) => {
            const arr = obj[stateKey] || [];
            arr.forEach((item) => {
              flatMocki.push({
                ...item,
                id: item.id?.toString() || `${stateKey}-${Math.random().toString(36).slice(2, 9)}`,
                state: stateKey,
                date: randomDate(),
              });
            });
          });
        });

        // 3. Combine them (Backend props come first)
        if (mounted) {
          setApiRentProperties([...backendProperties, ...flatMocki]);
        }
      } catch (e) {
        console.error("Rent Provider Fetch Error →", e);
      } finally {
        if (mounted) setLoadingRent(false);
      }
    }

    fetchRent();
    return () => {
      mounted = false;
    };
  }, [refreshRentTrigger]);

  // persist admin & hidden
  useEffect(() => {
    try {
      localStorage.setItem("adminRentProperties", JSON.stringify(adminRentProperties));
    } catch { }
  }, [adminRentProperties]);

  useEffect(() => {
    try {
      localStorage.setItem("hiddenRentIds", JSON.stringify(hiddenRentIds));
    } catch { }
  }, [hiddenRentIds]);

  // hide property
  const hideRentProperty = (id) => {
    setHiddenRentIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  // admin add
  const addAdminRentProperty = (prop) => {
    setAdminRentProperties((prev) => [prop, ...prev]);
  };

  // admin edit
  const editAdminRentProperty = (updated) => {
    setAdminRentProperties((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  };

  // update rent property (admin or api)
  const updateRentProperty = (id, newData) => {
    const foundAdmin = adminRentProperties.some((p) => p.id === id);
    if (foundAdmin) {
      setAdminRentProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...newData } : p))
      );
      return;
    }

    setApiRentProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...newData } : p))
    );
  };

  // merge admin + api + filter
  const getCombinedRentProperties = (filter = { state: null }) => {
    const all = [
      ...adminRentProperties.filter((p) => !hiddenRentIds.includes(p.id)),
      ...apiRentProperties.filter((p) => !hiddenRentIds.includes(p.id)),
    ];

    if (filter.state) {
      return all.filter((p) =>
        String(p.state || p.district || "")
          .toLowerCase()
          .includes(String(filter.state).toLowerCase())
      );
    }

    return all;
  };

  return (
    <RentContext.Provider
      value={{
        apiRentProperties,
        adminRentProperties,
        hiddenRentIds,
        loadingRent,

        hideRentProperty,
        addAdminRentProperty,
        editAdminRentProperty,
        updateRentProperty,
        getCombinedRentProperties,
        refreshRentProperties,
      }}
    >
      {children}
    </RentContext.Provider>
  );
}
