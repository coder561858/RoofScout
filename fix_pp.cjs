const fs = require('fs');
const path = 'c:\\Users\\HP\\Downloads\\Be-RoofScout\\Be-RoofScout\\roofscout_react\\src\\pages\\PropertyPayment.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldEffect = `    useEffect(() => {
        const { data } = localAuth.getSession();
        if (data.session?.user) {
            setLoggedUser(data.session.user.email || 'User');
        }
    }, []);`;

const newEffect = `    useEffect(() => {
        const { data } = localAuth.getSession();
        if (data.session?.user) {
            const user = data.session.user;
            const currentUsername = user.username || user.name || user.email || 'User';
            setLoggedUser(currentUsername);

            // Safety check: Prevents owners from buying their own property
            const isOwner = (propertyData.userId && String(propertyData.userId) === String(user.id)) || 
                           (propertyData.owner && propertyData.owner.toLowerCase() === currentUsername.toLowerCase());
            
            if (isOwner) {
                alert("You cannot buy or rent your own property!");
                navigate('/userdashboard');
            }
        }
    }, [propertyData, navigate]);`;

if (content.includes('setLoggedUser(data.session.user.email')) {
    const updatedContent = content.replace(/useEffect\(\(\) => \{[\s\S]*?setLoggedUser\(data\.session\.user\.email[\s\S]*?\}, \[\]\);/, newEffect);
    fs.writeFileSync(path, updatedContent);
    console.log('Fixed PropertyPayment.jsx successfully');
} else {
    console.log('Could not find the target useEffect block in PropertyPayment.jsx');
}
