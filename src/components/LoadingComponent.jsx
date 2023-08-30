import { Flex, keyframes } from "@chakra-ui/react";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingComponent = () => {
  return (
    <Flex 
        width="100vw" 
        height="100vh" 
        justifyContent="center" 
        alignItems="center"
        bg="#044c73"
    >
        <div
            style={{
                width: '50px',
                height: '50px',
                border: '8px solid #facb05',
                borderTop: '8px solid transparent',
                borderRadius: '50%',
                animation: `${spin} 1s linear infinite`
            }}
        />
    </Flex>
  );
};

export default LoadingComponent;
