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

export const decryptUuid = async (encryptedUuid) => {
  try {
    const response = await fetch(`${BASE_URL}/decrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encryptedUuid }),
    });

    const data = await response.json();

    if (!response.ok || !data.decryptedUuid) {
      throw new Error(data.message || "Decryption failed");
    }

    return data.decryptedUuid;
  } catch (error) {
    throw error;
  }
};

export const resolveAccountNumber = async (encryptedUuid, accountNumber) => {
  try {
    const uuid = await decryptUuid(encryptedUuid);
    const response = await fetch(`${BASE_URL}/resolve-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: uuid,
        accountNumber: accountNumber,
      }),
    });
    const data = await response.json();

    if (response.status >= 400) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyAccount = async (encryptedUuid, otp) => {
  try {
    const uuid = await decryptUuid(encryptedUuid);
    const response = await fetch(`${BASE_URL}/verify-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: uuid,
        otp,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Server error");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

export const sendPhoneVerification = async (encryptedUuid) => {
  const uuid = await decryptUuid(encryptedUuid);

  // Send the phone verification.
  const response = await fetch("https://qr-api-5yjj.onrender.com/sendPhoneVerification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: uuid,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return await response.json();
};

export const fetchUserDetails = async (encryptedUuid) => {
  const uuid = await decryptUuid(encryptedUuid);

  const response = await fetch("https://qr-api-5yjj.onrender.com/info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: uuid }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const data = await response.json();
  return data;
};
