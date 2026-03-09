const fs = require('fs');
const path = require('path');

function fixUserProfile() {
    const filePath = 'c:\\Users\\HP\\Downloads\\Be-RoofScout\\Be-RoofScout\\roofscout_react\\src\\pages\\UserProfile.jsx';
    let content = fs.readFileSync(filePath, 'utf8');

    // Using a more robust regex-based replacement
    const oldPart = /onChange={e => setFormData\({ \.\.\.formData, \[key\]: e\.target\.value }\)}/;
    const newPart = `onChange={e => {
                          let val = e.target.value;
                          if (key === 'phone') {
                            val = val.replace(/\\D/g, '').slice(0, 10);
                          }
                          setFormData({ ...formData, [key]: val });
                        }}`;

    if (oldPart.test(content)) {
        content = content.replace(oldPart, newPart);
        fs.writeFileSync(filePath, content);
        console.log('Fixed UserProfile.jsx');
    } else {
        console.log('Could not find text in UserProfile.jsx');
    }
}

function fixPayment() {
    const filePath = 'c:\\Users\\HP\\Downloads\\Be-RoofScout\\Be-RoofScout\\roofscout_react\\src\\pages\\Payment.jsx';
    let content = fs.readFileSync(filePath, 'utf8');

    // Add state if not present
    if (!content.includes('const [cardDetails, setCardDetails]')) {
        content = content.replace(
            'const [loggedUser, setLoggedUser] = useState(\'\');',
            'const [loggedUser, setLoggedUser] = useState(\'\');\n  const [cardDetails, setCardDetails] = useState({ number: \'\', expiry: \'\', cvv: \'\', name: \'\' });'
        );
    }

    // Add handler if not present
    if (!content.includes('const handleCardInputChange')) {
        const handler = `  const handleCardInputChange = (e) => {
    const { id, value } = e.target;
    let val = value;
    if (id === 'cardNumber') {
      val = value.replace(/\\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
      setCardDetails(prev => ({ ...prev, number: val }));
    } else if (id === 'expiry') {
      val = value.replace(/\\D/g, '');
      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
      setCardDetails(prev => ({ ...prev, expiry: val }));
    } else if (id === 'cvv') {
      val = value.replace(/\\D/g, '').slice(0, 3);
      setCardDetails(prev => ({ ...prev, cvv: val }));
    } else if (id === 'cardName') {
      setCardDetails(prev => ({ ...prev, name: value }));
    }
  };\n\n`;
        content = content.replace('if (loading) return', handler + '  if (loading) return');
    }

    // Replace inputs
    content = content.replace('placeholder="0000 0000 0000 0000"', 'id="cardNumber" placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={handleCardInputChange}');
    content = content.replace('placeholder="MM/YY"', 'id="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleCardInputChange}');
    content = content.replace('placeholder="123"', 'id="cvv" placeholder="123" value={cardDetails.cvv} onChange={handleCardInputChange}');
    content = content.replace('placeholder="John Doe"', 'id="cardName" placeholder="John Doe" value={cardDetails.name} onChange={handleCardInputChange}');

    fs.writeFileSync(filePath, content);
    console.log('Fixed Payment.jsx');
}

function fixPropertyPayment() {
    const filePath = 'c:\\Users\\HP\\Downloads\\Be-RoofScout\\Be-RoofScout\\roofscout_react\\src\\pages\\PropertyPayment.jsx';
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('const [cardDetails, setCardDetails]')) {
        content = content.replace(
            'const [theme, setTheme] = useTheme();',
            'const [theme, setTheme] = useTheme();\n    const [cardDetails, setCardDetails] = useState({ number: \'\', expiry: \'\', cvv: \'\', name: \'\' });'
        );
    }

    if (!content.includes('const handleCardInputChange')) {
        const handler = `    const handleCardInputChange = (e) => {
        const { id, value } = e.target;
        let val = value;
        if (id === 'cardNumber') {
            val = value.replace(/\\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
            setCardDetails(prev => ({ ...prev, number: val }));
        } else if (id === 'expiry') {
            val = value.replace(/\\D/g, '');
            if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
            setCardDetails(prev => ({ ...prev, expiry: val }));
        } else if (id === 'cvv') {
            val = value.replace(/\\D/g, '').slice(0, 3);
            setCardDetails(prev => ({ ...prev, cvv: val }));
        } else if (id === 'cardName') {
            setCardDetails(prev => ({ ...prev, name: val }));
        }
    };\n\n`;
        content = content.replace('if (!propertyData) {', handler + '    if (!propertyData) {');
    }

    content = content.replace('placeholder="0000 0000 0000 0000"', 'id="cardNumber" placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={handleCardInputChange}');
    content = content.replace('placeholder="MM/YY"', 'id="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleCardInputChange}');
    content = content.replace('placeholder="123"', 'id="cvc" placeholder="123" value={cardDetails.cvv} onChange={handleCardInputChange}');
    content = content.replace('placeholder="John Doe"', 'id="cardName" placeholder="John Doe" value={cardDetails.name} onChange={handleCardInputChange}');

    fs.writeFileSync(filePath, content);
    console.log('Fixed PropertyPayment.jsx');
}

fixUserProfile();
fixPayment();
fixPropertyPayment();
