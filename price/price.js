async function fetchB1TPrice() {
  const apiKey = '00f4b8f0-3c55-4c16-8d0f-0c7ab8d6de19';
  const apiUrl = 'https://api.livecoinwatch.com/coins/single';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ code: 'b1t', currency: 'usd', meta: true }) // meta set to true
    });

    if (response.ok) {
      const data = await response.json();
      const price = parseFloat(data.rate).toFixed(3); // Format price to 2 decimal places
      document.getElementById('price').textContent = price;
    } else {
      document.getElementById('price').textContent = 'Error';
      console.error('Error fetching price:', response.statusText);
    }
  } catch (error) {
    document.getElementById('price').textContent = 'Error';
    console.error('Network error:', error);
  }
}

// Fetch price on page load
fetchB1TPrice();
