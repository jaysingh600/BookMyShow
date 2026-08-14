const SERVER_URL = 'http://localhost:5000';
const NUM_REQUESTS = 100;

async function runStressTest() {
  console.log(`Starting Concurrency Stress Test...`);
  
  // 1. Get a show
  let showsRes = await fetch(`${SERVER_URL}/api/admin/shows`);
  let showsData = await showsRes.json();
  
  if (!showsData.success || showsData.shows.length === 0) {
    console.error('No shows found in the database. Please create a show first via the Admin panel.');
    return;
  }
  
  const showId = showsData.shows[0]._id;
  const targetSeat = 'Z99'; // Use a random seat unlikely to be booked

  console.log(`Targeting Show ID: ${showId}`);
  console.log(`Targeting Seat: ${targetSeat}`);
  console.log(`Firing ${NUM_REQUESTS} simultaneous booking requests...`);

  const requests = [];

  for (let i = 0; i < NUM_REQUESTS; i++) {
    // Generate unique idempotency key for each request so they are treated as distinct users
    const idempotencyKey = `stress_test_${Date.now()}_${i}`;
    
    const reqPromise = fetch(`${SERVER_URL}/api/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showId,
        seats: [targetSeat],
        totalAmount: 150,
        idempotencyKey
      })
    }).then(res => res.json()).catch(err => ({ success: false, message: err.message }));
    
    requests.push(reqPromise);
  }

  // Execute all at exactly the same time
  const start = Date.now();
  const results = await Promise.all(requests);
  const end = Date.now();

  console.log(`\nAll requests completed in ${end - start}ms.`);

  let successCount = 0;
  let failCount = 0;
  let errorTypes = {};

  results.forEach(result => {
    if (result.success) {
      successCount++;
    } else {
      failCount++;
      const msg = result.message || 'Unknown Error';
      errorTypes[msg] = (errorTypes[msg] || 0) + 1;
    }
  });

  console.log(`\n--- STRESS TEST RESULTS ---`);
  console.log(`Total Requests: ${NUM_REQUESTS}`);
  console.log(`Successful Bookings: ${successCount}`);
  console.log(`Failed Bookings: ${failCount}`);
  
  if (successCount === 1 && failCount === NUM_REQUESTS - 1) {
    console.log(`\n✅ TEST PASSED: Concurrency safety is working perfectly! Only exactly 1 request out of ${NUM_REQUESTS} succeeded.`);
  } else {
    console.log(`\n❌ TEST FAILED: Concurrency issue detected or test failed to execute properly.`);
  }

  console.log(`\nError Breakdown:`);
  console.dir(errorTypes);
}

runStressTest();
