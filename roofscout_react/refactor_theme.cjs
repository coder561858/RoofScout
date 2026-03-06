const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf-8');

    // Skip files that don't have theme state definitions
    if (!content.includes("localStorage.getItem('rs-theme')") &&
        !content.includes('localStorage.getItem("rs-theme")') &&
        !filepath.includes("Navbar.jsx")) {
        return;
    }

    if (content.includes('useTheme') && content.includes('hooks/useTheme')) {
        // Even if it has the import, we might need to rerun the regex
    } else {
        const importStatement = "import { useTheme } from '../hooks/useTheme';\n";
        content = content.replace(/(import.*?;?\n)/, `$1${importStatement}`);
    }

    // Replace State - handle various styles including try/catch
    const pattern_usv1 = /const \[theme,\s*setTheme\] = useState\(\(\) => \{[\s\S]*?localStorage\.getItem\(['"]rs-theme['"]\)[\s\S]*?\}\);/g;
    content = content.replace(pattern_usv1, 'const [theme, setTheme] = useTheme();');

    const pattern_usv2 = /const \[theme,\s*setTheme\] = useState\(\(?\s*\)? =>\s*localStorage\.getItem\(['"]rs-theme['"]\)[\s\S]*?\);/g;
    content = content.replace(pattern_usv2, 'const [theme, setTheme] = useTheme();');

    // Replace useEffect manipulating classes
    const pattern_ef1 = /useEffect\(\(\) => \{[\s\S]*?document\.documentElement[\s\S]*?\}\s*,\s*\[theme\]\);/g;
    content = content.replace(pattern_ef1, '');

    // Replace straight local storage setter useEffect
    const pattern_ef2 = /useEffect\(\(\) => \{[\s\S]*?localStorage\.setItem\(['"]rs-theme['"][\s\S]*?\}\s*,\s*\[theme\]\);/g;
    content = content.replace(pattern_ef2, '');

    if (filepath.includes("Navbar.jsx")) {
        const navPattern1 = /const \[darkMode, setDarkMode\] = useState\(\(\) => \{[\s\S]*?\}\);/;
        const navRepl1 = "const [theme, setTheme] = useTheme();\n  const darkMode = theme === 'dark';\n  const setDarkMode = (val) => setTheme(val ? 'dark' : 'light');";
        content = content.replace(navPattern1, navRepl1);

        const navPattern2 = /useEffect\(\(\) => \{\s*if \(darkMode\)[\s\S]*?\}\}, \[darkMode\]\);/;
        content = content.replace(navPattern2, '');
    }

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log("Refactored: " + filepath);
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        let filepath = path.join(dir, file);
        let stat = fs.statSync(filepath);
        if (stat && stat.isDirectory()) {
            walk(filepath);
        } else if (file.endsWith('.jsx')) {
            processFile(filepath);
        }
    });
}

walk(srcDir);
console.log("Done refactoring theme");
