import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SendAmountPage = ({ uuid }) => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const toast = useToast();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const decryptedResponse = await fetch("https://qr-api-5yjj.onrender.com/decrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedUuid: uuid }),
        });
        const { decryptedUuid } = await decryptedResponse.json();

        const infoResponse = await fetch("https://qr-api-5yjj.onrender.com/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: decryptedUuid }),
        });
        const accountInfo = await infoResponse.json();

        setAccountName(accountInfo.accountName);
        setAccountNumber(accountInfo.accountNumber);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    fetchAccountDetails();
  }, [uuid]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ussdResponse = await fetch("https://qr-api-5yjj.onrender.com/ussd-string", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          accountNumber: accountNumber, // assuming accountName is an object containing both accountName and accountNumber
        }),
      });

      const ussdData = await ussdResponse.json();

      if (ussdResponse.ok) {
       

        // toast({
        //   title: `Loading...`, 
        //   status: "info",
        //   duration: 2000,
        //   isClosable: true,
        //   position: "top",
        // });

        // Redirect to the PaymentOptions page with USSD data
        navigate("/payments", {
            state: { 
              ussdStrings: ussdData.data,
              uuid: uuid
            },
          });
      } else {
        // handle potential errors that might come from the server
        throw new Error(ussdData.message);
      }
    } catch (error) {
      console.error("Error fetching USSD string:", error);
    }
  };

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
        <Text
          fontSize="2rem"
          color="#044c73"
          marginBottom="1rem"
          fontWeight="semibold"
        >
          Welcome to QRPAY
        </Text>
        <Text fontSize="1rem" color="#044c73" marginBottom="2rem">
          Making transactions seamless and secure.
        </Text>
        <Text fontSize="1.5rem" color="#044c73" marginBottom="1rem">
          Input an amount you want to send to {accountName}.
        </Text>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel color="#044c73">Amount</FormLabel>
            <Input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={handleAmountChange}
              borderColor="#facb05"
            />
          </FormControl>
          <Flex justifyContent="center" mt={4}>
            <Button
              type="submit"
              bg="#044c73"
              color="#facb05"
              _hover={{
                bgColor: "#facb05",
                color: "#044c73",
                transform: "translateY(-5px)",
              }}
            >
              Proceed
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default SendAmountPage;
