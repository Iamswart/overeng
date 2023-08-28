import { Box } from "@chakra-ui/react";
import Navbar from "../components/NavBar";
import QrGrid from "../components/QRgrid";


const HomePage = () => {

  return (
    <>
      <Navbar/>
      <Box bg={"#fffadb"} width={"100%"} mt={24}>
        <QrGrid />
      </Box>
    </>
  );
};

export default HomePage;
