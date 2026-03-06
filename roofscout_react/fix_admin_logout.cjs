const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Adm'));
if (!files.includes('AdminDashboard.jsx')) files.push('AdminDashboard.jsx');

const logoutJs = `onClick={(e) => { e.preventDefault(); import("../supabase").then(({ localAuth }) => { localAuth.signOut().then(() => { localStorage.removeItem("role"); window.location.href = "/login"; }); }); }}`;

files.forEach(file => {
    const p = path.join(dir, file);
    if (!fs.existsSync(p) || !fs.statSync(p).isFile()) return;

    let content = fs.readFileSync(p, 'utf8');
    let original = content;

    content = content.replace(/<Link([^>]*?)to="\/\"([^>]*?)>\s*Logout\s*<\/Link>/g,
        `<Link$1to="#" ${logoutJs}$2>Logout</Link>`);

    if (content !== original) {
        fs.writeFileSync(p, content, 'utf8');
        console.log("Fixed: " + file);
    }
});
