const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'db.json');

// Initialize db.json if it doesn't exist
const initializeDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData = {
      users: [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', email: 'admin@roofscout.com' },
        { id: 2, username: 'john', password: 'john123', role: 'user', name: 'John Doe', email: 'john@example.com' }
      ],
      properties: [
        {
          id: 1, title: 'Modern Villa in Jaipur', address: '123 Vaishali Nagar, Jaipur', state: 'Rajasthan',
          area: 3500, price: 8500000, bedrooms: 4, bathrooms: 3, type: 'House', listingType: 'Sell', status: 'Available',
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          description: 'Luxurious modern villa with spacious rooms and premium amenities.',
          owner: { name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@example.com' }, createdAt: '2024-01-15'
        },
        {
          id: 2, title: 'Cozy Apartment in Mumbai', address: '45 Andheri West, Mumbai', state: 'Maharashtra',
          area: 1200, price: 45000, bedrooms: 2, bathrooms: 2, type: 'Apartment', listingType: 'Rent', status: 'Available',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          description: 'Well-maintained apartment in prime location with excellent connectivity.',
          owner: { name: 'Priya Sharma', phone: '9876543211', email: 'priya@example.com' }, createdAt: '2024-01-20'
        },
        {
          id: 3, title: 'Commercial Plot in Gurgaon', address: 'Sector 45, Gurgaon', state: 'Haryana',
          area: 5000, price: 15000000, bedrooms: 0, bathrooms: 0, type: 'Plot', listingType: 'Sell', status: 'Available',
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
          description: 'Prime commercial plot suitable for office complex or retail space.',
          owner: { name: 'Amit Verma', phone: '9876543212', email: 'amit@example.com' }, createdAt: '2024-01-25'
        }
      ],
      requests: [],
      stats: { totalListed: 3, totalSold: 0, totalRented: 0, revenue: 0 }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
    console.log('Database initialized: db.json');
  }
};

initializeDB();

// Helper: Read Database
const readDB = (callback) => {
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return callback(err, null);
    try {
      callback(null, JSON.parse(data));
    } catch (parseErr) {
      callback(parseErr, null);
    }
  });
};

// Helper: Write Database
const writeDB = (data, callback) => {
  fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8', callback);
};

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// =======================
// API ROUTES
// =======================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing fields' });

  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false, message: 'DB Error' });

    // Client passes `email` as `username`, so we look up by either username or email
    const user = db.users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (user) {
      const { password: _, ...userData } = user;
      res.json({ success: true, user: userData, token: `mock-jwt-${user.id}` });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name || !email) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false, message: 'DB Error' });

    if (db.users.find(u => u.username === username || u.email === email)) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      username, password, name, email, role: 'user'
    };

    db.users.push(newUser);
    writeDB(db, (writeErr) => {
      if (writeErr) return res.status(500).json({ success: false, message: 'Write error' });
      const { password: _, ...userData } = newUser;
      res.status(201).json({ success: true, user: userData });
    });
  });
});

// GET /api/properties
app.get('/api/properties', (req, res) => {
  const { state, type, listingType, sort } = req.query;

  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });

    let results = [...db.properties];

    if (state) results = results.filter(p => p.state?.toLowerCase() === state.toLowerCase());

    if (type) {
      const types = type.toLowerCase().split(',');
      results = results.filter(p => types.includes(p.type?.toLowerCase()));
    }

    if (listingType) {
      const listingTypes = listingType.toLowerCase().split(',');
      results = results.filter(p => listingTypes.includes(p.listingType?.toLowerCase()));
    }

    if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
    if (sort === 'price-low') results.sort((a, b) => a.price - b.price);

    res.json({ success: true, properties: results });
  });
});

// GET /api/property/:id
app.get('/api/property/:id', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });
    const property = db.properties.find(p => p.id === parseInt(req.params.id));
    property ? res.json({ success: true, property }) : res.status(404).json({ success: false, message: 'Not found' });
  });
});

// POST /api/property
app.post('/api/property', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });

    const newProp = {
      id: db.properties.length > 0 ? Math.max(...db.properties.map(p => p.id)) + 1 : 1,
      ...req.body,
      status: 'Available',
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.properties.push(newProp);
    db.stats.totalListed += 1;

    writeDB(db, () => res.status(201).json({ success: true, property: newProp }));
  });
});

// PUT /api/property/:id
app.put('/api/property/:id', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });
    const idx = db.properties.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });

    db.properties[idx] = { ...db.properties[idx], ...req.body };

    // Update stats if status changed
    if (req.body.status === 'Sold') db.stats.totalSold += 1;
    if (req.body.status === 'Rented') db.stats.totalRented += 1;

    writeDB(db, () => res.json({ success: true, property: db.properties[idx] }));
  });
});

// DELETE /api/property/:id
app.delete('/api/property/:id', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });
    db.properties = db.properties.filter(p => p.id !== parseInt(req.params.id));
    db.stats.totalListed -= 1;
    writeDB(db, () => res.json({ success: true }));
  });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, stats: db.stats });
  });
});

// POST /api/request
app.post('/api/request', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });
    const newReq = {
      id: db.requests.length > 0 ? Math.max(...db.requests.map(r => r.id)) + 1 : 1,
      ...req.body,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    db.requests.push(newReq);
    writeDB(db, () => res.status(201).json({ success: true, request: newReq }));
  });
});

// GET /api/requests
app.get('/api/requests', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, requests: db.requests });
  });
});

// PUT /api/request/:id
app.put('/api/request/:id', (req, res) => {
  readDB((err, db) => {
    if (err) return res.status(500).json({ success: false });
    const idx = db.requests.findIndex(r => r.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false });

    db.requests[idx].status = req.body.status;
    writeDB(db, () => res.json({ success: true, request: db.requests[idx] }));
  });
});

// =======================
// SERVE FRONTEND (Production)
// =======================
// This assumes you ran `npm run build` inside the 'RoofScout' folder
app.use(express.static(path.join(__dirname, 'RoofScout', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'RoofScout', 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));