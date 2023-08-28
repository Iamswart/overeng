import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Flex flexDirection="column" minHeight="100vh" bg={"#fffadb"} m={"0px"} p={"0px"} width={"100%"}>
        {/* <Navbar /> */}
        <Box flex="1" m={"0px"} width={"100%"} p={"0px"}>
          <Outlet />
        </Box>
      </Flex>
    </>
  );
};

export default Layout;