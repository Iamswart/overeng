
import { Button, Center, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const BadRequest = () => {
  const color = useColorModeValue('gray.800', 'gray.100');

  return (
    <Center h="100vh"  bg={"#F5F2F0"} color={color}>
      <VStack spacing={4}>
        <Heading fontSize={['4xl', '5xl', '6xl']} fontWeight="bold">
          OOPS!
        </Heading>
        <Text fontSize={['2xl', '3xl']} fontWeight="medium">
        An unexpected error occurred.
        </Text>
        <Button as={Link} to="/" bgColor="#DF933B" size="lg">
          Return to Home
        </Button>
      </VStack>
    </Center>
  );
};

export default BadRequest;
