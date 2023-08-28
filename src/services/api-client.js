// api.js

const BASE_URL = "https://qr-api-5yjj.onrender.com";

export const fetchQRCodes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/generateQR`);
    const data = await response.json();
    return data.qr;
  } catch (error) {
    throw new Error("Failed to fetch QR codes from the server.");
  }
};

