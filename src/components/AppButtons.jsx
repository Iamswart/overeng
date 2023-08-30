import { Button, HStack, Icon, SimpleGrid, Center, } from "@chakra-ui/react";
import React from "react";
import { AiFillApple } from "react-icons/ai";
import { BsGooglePlay } from "react-icons/bs";



const StoreButton = ({ icon, label, storeLink, ...props }) => {
  return (
    <Button 
      leftIcon={<Icon as={icon} />} 
      variant="outline" 
      {...props} 
      size="lg"
      borderWidth="2px"
      colorScheme="black"
      onClick={() => window.open(storeLink, "_blank")}
      color={"#000"}
    >
      {label}
    </Button>
  );
}

const AppButtons = () => {
  return (
    <Center>
    <SimpleGrid spacing={4} mt={8} columns={{base: 1, sm: 2}}>
      <StoreButton 
        icon={BsGooglePlay} 
        label="Google Play" 
        storeLink="https://play.google.com/store/apps/details?id=com.consumerug&hl=en&gl=US" 
      />
      <StoreButton 
        icon={AiFillApple} 
        label="App Store" 
        storeLink="https://apps.apple.com/ng/app/mtn-momo/id1474080783" 
      />
    </SimpleGrid>
    </Center>
  );
};

export default AppButtons;

