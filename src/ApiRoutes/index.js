import { getPostRequestHeaders, token } from "../App";

// api.jst
const BASE_URL = "http://localhost:3003";

async function fetchData(endpoint, options) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    if (options.method === "GET") {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export { fetchData };
