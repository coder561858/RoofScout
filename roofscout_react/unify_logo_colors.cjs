const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/UserProfile.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/UserDashboard.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/Sell.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/Rent.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/PG.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/PostProperty.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/AdmTenant.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/AdmPropt.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/AdmPayment.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/AdmInvoice.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/AdminDashboard.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/AdmHouses.jsx',
    'c:/Users/HP/Downloads/Be-RoofScout/Be-RoofScout/roofscout_react/src/pages/AdmClient1.jsx'
];

filesToUpdate.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Replace text-yellow-400 with text-yellow-500 for "Roof"
        // Also handle cases where it might be yellow-500 already but needs checking
        content = content.replace(/text-yellow-400">Roof/g, 'text-yellow-500">Roof');

        // Replace text-blue-500 with text-blue-600 for "Scout"
        // Note: Navbar.jsx used text-blue-600, common sub-pages used text-blue-500
        content = content.replace(/text-blue-500">Scout/g, 'text-blue-600">Scout');

        // Also handle some specific variations found in grep
        content = content.replace(/className="text-yellow-400">Roof<\/span>/g, 'className="text-yellow-500">Roof</span>');
        content = content.replace(/className="text-blue-500">Scout<\/span>/g, 'className="text-blue-600">Scout</span>');

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated logo in ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
