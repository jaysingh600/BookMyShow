
const test = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cinereserve.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginRes.status, loginData);
    
    if (loginData.token) {
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      const statsData = await statsRes.text();
      console.log('Stats:', statsRes.status, statsData);
    }
  } catch (error) {
    console.error(error);
  }
};
test();
