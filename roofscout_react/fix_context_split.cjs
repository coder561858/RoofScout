const fs = require('fs');
const path = require('path');

const contextFile = path.join(__dirname, 'src', 'contexts', 'PropertyContext.jsx');
let content = fs.readFileSync(contextFile, 'utf8');

const oldEffect = /useEffect\(\(\) => \{\s*let mounted = true;\s*async function fetchAll\(\) \{\s*setLoading\(true\);\s*try \{\s*\/\/ 1\. Fetch from our REAL Express backend[\s\S]*?finally \{\s*if \(mounted\) setLoading\(false\);\s*\}\s*\}\s*fetchAll\(\);\s*return \(\) => \{ mounted = false \};\s*\}, \[refreshTrigger\]\);/m;

const newEffect = `  const [mockiProperties, setMockiProperties] = useState([]);

  // Mocki Fetch (Once)
  useEffect(() => {
    let mounted = true;
    async function fetchMocki() {
      try {
        const responses = await Promise.all(API_URLS.map(url => fetch(url).catch(() => null)));
        const validResponses = responses.filter(r => r && r.ok);
        const jsonArrays = await Promise.all(validResponses.map(r => r.json()));

        const flatMocki = [];
        jsonArrays.forEach(obj => {
          Object.keys(obj || {}).forEach(stateKey => {
            const arr = obj[stateKey] || [];
            arr.forEach(item => {
              flatMocki.push({
                ...item,
                id: item.id?.toString() || \`\${stateKey}-\${Math.random().toString(36).slice(2, 9)}\`,
                state: stateKey,
                date: generateRandomDate()
              });
            });
          });
        });

        if (mounted) setMockiProperties(flatMocki);
      } catch (e) {
        console.error("Mocki fetch error", e);
      }
    }
    fetchMocki();
    return () => { mounted = false };
  }, []);

  // Backend Fetch (On trigger)
  useEffect(() => {
    let mounted = true;

    async function fetchBackend() {
      setLoading(true);
      try {
        let backendProperties = [];
        try {
          const res = await fetch(\`http://localhost:5000/api/properties?t=\${Date.now()}\`);
          const data = await res.json();
          if (data.success) {
            backendProperties = data.properties.map(p => ({
              ...p,
              // Map backend fields to frontend expected fields
              priceText: p.priceText || \`₹\${Number(p.price).toLocaleString("en-IN")}\`,
              dataPrice: Number(p.price),
              owner: p.owner?.name || "Owner",
              location: p.location || \`\${p.address}, \${p.state}\`,
              type: p.type?.toLowerCase() || 'house',
              district: p.state,
              date: p.createdAt || generateRandomDate()
            }));
          }
        } catch (e) {
          console.error("Failed to fetch from real backend", e);
        }

        if (mounted) {
          setApiProperties([...backendProperties, ...mockiProperties]);
        }

      } catch (err) {
        console.error("PropertyProvider fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBackend();
    return () => { mounted = false };
  }, [refreshTrigger, mockiProperties]);`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync(contextFile, content, 'utf8');
console.log("Patched PropertyContext.jsx");

// RENT
const rentFile = path.join(__dirname, 'src', 'contexts', 'PropertyContextRent.jsx');
let rentContent = fs.readFileSync(rentFile, 'utf8');

const rentOldEffect = /useEffect\(\(\) => \{\s*let mounted = true;\s*async function fetchRent\(\) \{\s*setLoadingRent\(true\);\s*try \{\s*\/\/ 1\. Fetch from Express backend[\s\S]*?finally \{\s*if \(mounted\) setLoadingRent\(false\);\s*\}\s*\}\s*fetchRent\(\);\s*return \(\) => \{\s*mounted = false;\s*\};\s*\}, \[refreshRentTrigger\]\);/m;

const rentNewEffect = `  const [mockiRentProperties, setMockiRentProperties] = useState([]);

  // Mocki Fetch (Once)
  useEffect(() => {
    let mounted = true;
    async function fetchMocki() {
      try {
        const responses = await Promise.all(RENT_API_URLS.map(u => fetch(u).catch(() => null)));
        const validResponses = responses.filter(r => r && r.ok);
        const jsonArrays = await Promise.all(validResponses.map(r => r.json()));

        const flatMocki = [];
        jsonArrays.forEach((obj) => {
          Object.keys(obj || {}).forEach((stateKey) => {
            const arr = obj[stateKey] || [];
            arr.forEach((item) => {
              flatMocki.push({
                ...item,
                id: item.id?.toString() || \`\${stateKey}-\${Math.random().toString(36).slice(2, 9)}\`,
                state: stateKey,
                date: randomDate(),
              });
            });
          });
        });

        if (mounted) setMockiRentProperties(flatMocki);
      } catch (e) {
        console.error("Mocki Rent fetch error", e);
      }
    }
    fetchMocki();
    return () => { mounted = false };
  }, []);

  // Backend Fetch (On trigger)
  useEffect(() => {
    let mounted = true;

    async function fetchBackend() {
      setLoadingRent(true);
      try {
        let backendProperties = [];
        try {
          const res = await fetch(\`http://localhost:5000/api/properties?type=rent,pg&t=\${Date.now()}\`);
          const data = await res.json();
          if (data.success) {
            backendProperties = data.properties.map((p) => ({
              ...p,
              priceText: p.priceText || \`₹\${Number(p.price).toLocaleString("en-IN")} / month\`,
              dataPrice: Number(p.price),
              owner: p.owner?.name || "Owner",
              location: p.location || \`\${p.address}, \${p.state}\`,
              type: p.type?.toLowerCase() || "rent",
              district: p.state,
              date: p.createdAt || randomDate(),
            }));
          }
        } catch (err) {
          console.error("Failed to fetch rent from real backend", err);
        }

        if (mounted) {
          setApiRentProperties([...backendProperties, ...mockiRentProperties]);
        }
      } catch (e) {
        console.error("Rent Provider Fetch Error →", e);
      } finally {
        if (mounted) setLoadingRent(false);
      }
    }

    fetchBackend();
    return () => { mounted = false };
  }, [refreshRentTrigger, mockiRentProperties]);`;

rentContent = rentContent.replace(rentOldEffect, rentNewEffect);
fs.writeFileSync(rentFile, rentContent, 'utf8');
console.log("Patched PropertyContextRent.jsx");
