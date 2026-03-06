const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixImports(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixImports(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('useTheme()') && !content.includes('hooks/useTheme')) {
                // Find first import and insert after
                const importMatch = content.match(/import\s+.*?;?\n/);
                if (importMatch) {
                    content = content.replace(importMatch[0], importMatch[0] + "import { useTheme } from '../hooks/useTheme';\n");
                    fs.writeFileSync(fullPath, content);
                    console.log('Fixed ' + fullPath);
                } else {
                    content = "import { useTheme } from '../hooks/useTheme';\n" + content;
                    fs.writeFileSync(fullPath, content);
                    console.log('Fixed ' + fullPath);
                }
            }
        }
    });
}

fixImports(srcDir);
console.log('Done');
