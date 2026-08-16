

const test = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cinereserve.com', password: 'password123' })
    });
    const data = await res.text();
    console.log(res.status, data);
  } catch (error) {
    console.error(error);
  }
};
test();
