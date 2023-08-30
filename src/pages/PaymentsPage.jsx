import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Center, Image, Text, VStack } from "@chakra-ui/react";
import momo from "../assets/momo.png";
import PaymentOptions from "../components/PaymentOptions";

function Payments() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate('/amount');
  //   }, 10000); // Redirect after 30 minutes

  //   return () => clearTimeout(timer); // Clear the timer if user navigates away
  // }, [navigate]);

  return (
    <Center h="100vh" bg={"#fffadb"} width="100%">
      <VStack spacing={4}>
        <Text
          fontWeight={"600"}
          fontSize="2rem"
          textAlign={"center"}
          fontFamily={"sans-serif"}
          color={"#000"}
        >
          QRPAY by MoMo
        </Text>
        <Box>
          <Image src={momo} boxSize={24} rounded={"md"} />
        </Box>
        <PaymentOptions />
      </VStack>
    </Center>
  );
}

export default Payments;
