const API_BASE_URL = "http://localhost:8080/api"; // Ensure this matches your backend URL

const apiCall = async (url, method = "GET", body = null, headers = {}) => {
  try {
    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || "Something went wrong");
    }

    if (
      response.status === 204 ||
      (response.status === 200 &&
        response.headers.get("Content-Length") === "0")
    ) {
      return null; // No content for DELETE or successful empty response
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export { API_BASE_URL, apiCall };
