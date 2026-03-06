const fs = require('fs');
const path = require('path');

const filesToFix = [
    path.join(__dirname, 'src', 'pages', 'AdmHouses.jsx'),
    path.join(__dirname, 'src', 'pages', 'AdmPropt.jsx'),
];

filesToFix.forEach(filepath => {
    let content = fs.readFileSync(filepath, 'utf8');

    // Remove Buyer/Seller
    content = content.replace(/<SidebarItem[^>]*text=["']Buyer\/Seller["'][^>]*\/>\s*/g, '');

    // Remove Tenants
    content = content.replace(/<SidebarItem[^>]*text=["']Tenants["'][^>]*\/>\s*/g, '');

    // Remove Payment
    content = content.replace(/<SidebarItem[^>]*text=["']Payment["'][^>]*\/>\s*/g, '');

    fs.writeFileSync(filepath, content, 'utf8');
    console.log("Updated", filepath);
});
