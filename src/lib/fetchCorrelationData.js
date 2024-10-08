export async function fetchCorrelationData(correlationType, page) {
  const BASE_URL = 'http://localhost:3000'
  let data = [];

  try {
    const response = await fetch(`${BASE_URL}/api/correlations/${correlationType}?page=${page}&_=${new Date().getTime()}`, {
      headers: {
        accept: 'application/json'
      }
    });
    const result = await response.json();
    data = result.correlations;
  } catch (error) {
    console.error(error);
  }

  return data;
}