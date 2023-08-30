
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveAccountNumber } from "../services/api-client";

const Activation = ({ uuid }) => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [accountVerified, setAccountVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const verifyAccount = async () => {
    // Validation
    let validationErrors = {};
    if (!formData.accountNumber) {
      validationErrors.accountNumber = "Account number is required";
    } else if (formData.accountNumber.length !== 10) {
      validationErrors.accountNumber =
        "Account number must be exactly 10 digits";
    }
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await resolveAccountNumber(uuid, formData.accountNumber);
  
        // Check if the API call was successful
        if (response.accountDetails.status && response.accountDetails.data) {
          setFormData({
            ...formData,
            accountName: response.accountDetails.data.account_name,
          });
          setAccountVerified(true);
        } else {
          setErrors({
            accountNumber: "Please input a valid account number",
          });
        }
      } catch (error) {
        console.error("Error verifying account:", error);
        setErrors({
          accountNumber: error.message
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g. navigate to the next step
    navigate("/verify-otp", { state: { uuid: uuid } });
  };

  return (
    <Box bg="#044c73" p={6} borderRadius="md" width="100%">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.accountNumber}>
            <FormLabel color="#facb05">Your MoMo Account Number</FormLabel>
            <Input
              type="number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              borderColor="#facb05"
              color={"white"}
            />
            <FormErrorMessage>{errors.accountNumber}</FormErrorMessage>
          </FormControl>
          {accountVerified && (
            <FormControl>
              <FormLabel color="#facb05">Account Name</FormLabel>
              <Input
                type="text"
                name="accountName"
                value={formData.accountName}
                borderColor="#facb05"
                color={"white"}
              />
            </FormControl>
          )}
          {!accountVerified ? (
            <Button
              onClick={verifyAccount}
              bg="#facb05"
              color="#044c73"
              _hover={{ bgColor: "#e5aa00" }}
            >
              Verify Account
            </Button>
          ) : (
            <Button
              type="submit"
              bg="#facb05"
              color="#044c73"
              _hover={{ bgColor: "#e5aa00" }}
            >
              Next
            </Button>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default Activation;
