const fs = require('fs');
const path = require('path');

const fixComponent = (filePath, isRent) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Add imports
    if (!content.includes('PropertyContextRent')) {
        content = content.replace(/import { useNavigate(.*?) } from ['"]react-router-dom['"];/,
            `import { useNavigate$1 } from "react-router-dom";\nimport { PropertyContext } from "../contexts/PropertyContext";\nimport { RentContext } from "../contexts/PropertyContextRent";\nimport { useContext } from "react";`);
    }

    // Add hook
    if (!content.includes('const { refresh')) {
        content = content.replace(/const navigate = useNavigate\(\);/,
            `const navigate = useNavigate();\n  const { refreshProperties } = useContext(PropertyContext);\n  const { refreshRentProperties } = useContext(RentContext);`);
    }

    // Add refresh call
    if (!content.includes('refreshProperties') && !content.includes('refreshRentProperties')) {
        // Just in case the previous replacement failed
    }

    if (isRent) {
        content = content.replace(/alert\("([^"]+) submitted(.*?)!"\);\n(.*?)navigate\("\/userdashboard"\);/g,
            `alert("$1 submitted$2!");\n        refreshRentProperties();\n$3navigate("/userdashboard");`);
    } else {
        content = content.replace(/alert\("Property submitted successfully!"\);\n(.*?)navigate\("\/userdashboard"\);/g,
            `alert("Property submitted successfully!");\n        refreshProperties();\n$1navigate("/userdashboard");`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched " + path.basename(filePath));
    }
};

fixComponent(path.join(__dirname, 'src', 'pages', 'Sell.jsx'), false);
fixComponent(path.join(__dirname, 'src', 'pages', 'Rent.jsx'), true);
fixComponent(path.join(__dirname, 'src', 'pages', 'PG.jsx'), true);
