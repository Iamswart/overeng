import React, { useEffect, useState } from "react";
import ActivationPage from "../pages/ActivationPage";
import SendAmountPage from "../pages/SendAmountPage";
import PaymentsPage from "../pages/PaymentsPage";
import LoadingComponent from "./LoadingComponent";
import { useNavigate } from "react-router-dom";
import BadRequest from "./Wrong";

function QRHandler() {
  const [qrData, setQrData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBadRequest, setIsBadRequest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQRDetails() {
      // Extract encrypted UUID from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const encryptedUuid = urlParams.get("uuid");

      if (!encryptedUuid) {
        setIsBadRequest(true);
        setIsLoading(false);
        return;
      }

      // Decrypt the UUID on the server
      try {
        const response = await fetch("https://qr-api-5yjj.onrender.com/decrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedUuid: encryptedUuid }),
        });

        const data = await response.json();
        const decryptedUuid = data.decryptedUuid;

        if (!decryptedUuid) {
          setIsBadRequest(true);
          setIsLoading(false);
          return;
        }

        // Fetch QR details from server
        const qrDetailsResponse = await fetch("https://qr-api-5yjj.onrender.com/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: decryptedUuid }),
        });

        if (qrDetailsResponse.status === 404) {
          setIsBadRequest(true);
          setIsLoading(false);
          return; // Return early to stop further execution
        }

        const qrDetailsData = await qrDetailsResponse.json();
        setQrData(qrDetailsData);
      } catch (error) {
        console.error("Error fetching QR details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQRDetails();
  }, []);

  if (isLoading) return <LoadingComponent />;
  if (isBadRequest) return <BadRequest />;

  if (qrData && qrData.isActivated) {
    return <SendAmountPage uuid={qrData.encryptedData} />;
  } else {
    return <ActivationPage uuid={qrData.encryptedData} />;
  }
}

export default QRHandler;
