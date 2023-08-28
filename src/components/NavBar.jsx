import {
  Box,
  Flex,
  Image,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const name = ["QR PAY BY MOMO"];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <Box
        bg="#161722"
        px={[4, 10]}
        py={1}
        position={"fixed"}
        top={0}
        left={0}
        right={0}
        zIndex={999}
        boxShadow={scrolled ? "md" : "none"}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <RouterLink to={"/"}>
            <Flex alignItems={"center"}>
              <Image
                boxSize="50px"
                objectFit="contain"
                loading="lazy"
                rounded={"lg"}
                src={
                  "https://res.cloudinary.com/dfscst5lw/image/upload/v1691521410/portfolio_website/momo_lw8kpd.png"
                }
              />

              <Text
                fontSize={"lg"}
                fontWeight={"semibold"}
                letterSpacing={"wide"}
                ml={4}
                //   textTransform={"uppercase"}
                color={"#fff"}
                onClick={handleScrollToTop}
                _hover={{ cursor: "pointer", color: "#FFD2A4" }}
              >
                {name}
              </Text>
            </Flex>
          </RouterLink>

          

          
        </Flex>

        
      </Box>
    </>
  );
}
