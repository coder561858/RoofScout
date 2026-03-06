const fs = require('fs');
const path = require('path');

const filesToFix = [
    path.join(__dirname, 'src', 'pages', 'AdmHouses.jsx'),
    path.join(__dirname, 'src', 'pages', 'AdmPropt.jsx')
];

filesToFix.forEach(filepath => {
    let content = fs.readFileSync(filepath, 'utf8');

    // Strip out Buyer/Seller, Tenants, and Payment lines globally
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => {
        if (line.includes('AdmClient1') && line.includes('Buyer/Seller')) return false;
        if (line.includes('AdmTenant') && line.includes('Tenants')) return false;
        if (line.includes('AdmPayment') && line.includes('Payment')) return false;
        return true;
    });

    fs.writeFileSync(filepath, filteredLines.join('\n'), 'utf8');
    console.log("Cleaned:", filepath);
});
