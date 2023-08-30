import { Box, Center, Image, Text, VStack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import momo from "../assets/momo.png";
import AppButtons from "../components/AppButtons";
import SubmitOtp from "../components/SubmitOtp";

function VerifyOtpPage() {
  const location = useLocation();
  const uuid = location.state?.uuid;

  return (
    <Center bg={"#fffadb"} width="100%" mt={8}>
      <VStack spacing={4}>
        <Box>
          <Image src={momo} boxSize={24} rounded={"md"} />
        </Box>
        <Text fontWeight={"600"} textAlign={"center"} fontFamily={"sans-serif"} color={"#000"}>An OTP has been sent to your MoMo number. Please enter it below to verify.</Text>
        <SubmitOtp uuid={uuid} />
        <AppButtons />
      </VStack>
    </Center>
  );
}

export default VerifyOtpPage;
