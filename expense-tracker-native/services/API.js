import axios from "axios";

export const apiCall = async (
  url,
  method = "GET",
  body = null,
  headers = {}
) => {
  try {
    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log("Making API call:", {
      url,
      method,
      body,
      headers,
    });
    let response;
    if (method.toUpperCase() === "GET") {
      response = await axios.get(url, { headers });
    } else {
      response = await axios({
        url,
        method,
        data: body,
        headers,
      });
    }
    console.log("API call response:", response.status, response.data);

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
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
