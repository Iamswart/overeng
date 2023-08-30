import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";

const WelcomePage = () => {
  const location = useLocation();
  const uuid = location.state.uuid;

  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    // This function fetches the accountName based on the uuid.
    const fetchAccountDetails = async () => {
      try {
        // First, decrypt the uuid.
        const decryptedResponse = await fetch("https://qr-api-5yjj.onrender.com/decrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            encryptedUuid: uuid,
          }),
        });
        const { decryptedUuid } = await decryptedResponse.json();

        // Then, get the account info using the decrypted UUID.
        const infoResponse = await fetch("https://qr-api-5yjj.onrender.com/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: decryptedUuid,
          }),
        });
        const accountInfo = await infoResponse.json();

        setAccountName(accountInfo.accountName);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [uuid]);

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#044c73"
    >
      <Box
        padding="5rem"
        textAlign="center"
        borderRadius="md"
        backgroundColor="#fff"
        boxShadow="xl"
      >
        <Heading color="#044c73" marginBottom="1rem">
          Welcome to QrPay!
        </Heading>
        {accountName && <Text fontSize="1.5rem" color="#044c73" marginBottom="1rem">Hey, {accountName}</Text>}
        <Text fontSize="1.25rem" color="#044c73" marginBottom="1.5rem">
          Discover what you can do with our platform.
        </Text>
        <Text fontSize="1rem" color="#044c73" marginBottom="1.5rem">
          - Easy and secure payments using QR codes.
          <br />
          - Manage all your transactions in one place.
          <br />- Get instant notifications and updates.
        </Text>
        <Button
          colorScheme="yellow"
          backgroundColor="#facb05"
          _hover={{ bgColor: "#d6a905" }}
          color="#044c73"
        >
          Get Started
        </Button>
      </Box>
    </Flex>
  );
};

export default WelcomePage;
