import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAccount } from "../services/api-client";
import { sendPhoneVerification } from "../services/api-client";

const OtpForm = ({ uuid }) => {
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 minutes in seconds
  const [showResendButton, setShowResendButton] = useState(false);

  useEffect(() => {
    // If time left is more than 0, decrease it. Otherwise, show the resend button.
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        clearInterval(timer);
        setShowResendButton(true);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    setErrorMsg(null);
    // Validate OTP
    try {
      const response = await verifyAccount(uuid, otp);

      toast({
        title: response.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      navigate("/welcome", { state: { uuid: uuid } });
    } catch (error) {
      setErrorMsg(error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await sendPhoneVerification(uuid);
      toast({
        title: response.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setTimeLeft(3 * 60);
      setShowResendButton(false);
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmitOtp}>
        <FormControl isRequired isInvalid={!!errorMsg}>
          <FormLabel color="#044c73">Enter OTP</FormLabel>
          <Input
            type="text"
            name="otp"
            value={otp}
            onChange={handleOtpChange}
            borderColor="#facb05"
          />
          <FormErrorMessage>{errorMsg}</FormErrorMessage>
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
            Submit OTP
          </Button>
        </Flex>
        <Flex justifyContent="center" mt={4}>
          {showResendButton ? (
            <Button variant="outline" onClick={handleResendOtp}>
              Resend OTP
            </Button>
          ) : (
            <Text mt={3}>
              Resend OTP in {Math.floor(timeLeft / 60)}:
              {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </Text>
          )}
        </Flex>
      </form>
    </Box>
  );
};

export default OtpForm;
