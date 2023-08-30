import { Button, Icon } from "@chakra-ui/react";
import React from "react";



const CustomButton = ({
  iconComponent,
  iconColor="#facb05",
  children,
  ...props
}) => {
  return (
    <Button
      leftIcon={iconComponent ? <Icon as={iconComponent} color={iconColor} /> : undefined}
      {...props}
      bgColor={"#044c73"}
      cursor={"pointer"}
      color={"white"}
      w={"100%"}
      _hover={{
        bgColor: "#044c73",
        transform: "translateY(-5px)",
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
