async function fetchB1TPrice() {
  const apiKey = '445997e2-9c03-4741-876d-fd4f1a699034';
  const apiUrl = 'https://api.livecoinwatch.com/coins/single';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ code: 'B1T', currency: 'USD', meta: true })
    });

    if (response.ok) {
      const data = await response.json();
      const price = parseFloat(data.rate).toFixed(3);
      document.getElementById('currentPrice').textContent = `$${price}`;
    } else {
      document.getElementById('currentPrice').textContent = 'Error';
      console.error('Error fetching price:', response.statusText);
    }
  } catch (error) {
    document.getElementById('currentPrice').textContent = 'Error';
    console.error('Network error:', error);
  }
}

fetchB1TPrice();

