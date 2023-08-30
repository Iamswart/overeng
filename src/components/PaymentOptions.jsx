import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  IconButton,
  Text,
  Tooltip,
  VStack,
  useClipboard,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsBank } from "react-icons/bs";
import { FaCopy } from "react-icons/fa";
import { MdApps, MdDialerSip } from "react-icons/md";
import AppButtons from "../components/AppButtons";
import { fetchUserDetails } from "../services/api-client";
import { useLocation } from "react-router-dom";

const PaymentOptions = () => {
  const location = useLocation();
  const ussdStrings = location.state?.ussdStrings || [];
  const uuid = location.state?.uuid;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isCopied, setIsCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [selectedBank, setSelectedBank] = useState(null);

  const handleBankChange = (event) => {
    setSelectedBank(event.target.value);
  };

  const { onCopy, hasCopied } = useClipboard(userDetails?.accountNumber || "");

  const handleCopyClick = () => {
    onCopy();
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 4000);
  };

  useEffect(() => {
    if (uuid) {
      fetchUserDetails(uuid)
        .then((data) => {
          setUserDetails(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setLoading(false);
        });
    }
  }, [uuid]);

  if (!userDetails && loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Text
        fontWeight={"600"}
        textAlign={"center"}
        fontFamily={"sans-serif"}
        color={"#000"}
        mb={4}
      >
        Use one of the methods below to complete payment to{" "}
        {userDetails?.accountName}
      </Text>
      <VStack spacing={4}>
        <Accordion allowToggle>
          <AccordionItem mb={4}>
            <AccordionButton
              as="a"
              display="flex"
              justifyContent="center"
              alignItems="center"
              w="full"
              bgColor={"#044c73"}
              cursor={"pointer"}
              color={"white"}
              rounded={"lg"}
              _hover={{
                bgColor: "#044c73",
              }}
            >
              <Box flex="1" textAlign="left">
                Pay with USSD
              </Box>
              <MdDialerSip color="#facb05" />
            </AccordionButton>
            <AccordionPanel color={"black"}>
              <Select placeholder="Select bank" onChange={handleBankChange}>
                {ussdStrings.map((bank, index) => (
                  <option key={index} value={bank.bankName}>
                    {bank.bankName}
                  </option>
                ))}
              </Select>
              {selectedBank && (
                <a
                  href={`tel:${
                    ussdStrings.find((bank) => bank.bankName === selectedBank)
                      .ussdString
                  }`}
                >
                  <Text mt={2} color="blue.600" textDecoration="underline">
                    Dial:{" "}
                    {
                      ussdStrings.find((bank) => bank.bankName === selectedBank)
                        .ussdString
                    }
                  </Text>
                </a>
              )}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem mb={4}>
            <AccordionButton
              as="a"
              display="flex"
              justifyContent="center"
              alignItems="center"
              w="full"
              bgColor={"#044c73"}
              cursor={"pointer"}
              color={"white"}
              rounded={"lg"}
              _hover={{
                bgColor: "#044c73",
              }}
            >
              <Box flex="1" textAlign="left">
                Pay with Bank Transfer
              </Box>
              <BsBank color="#facb05" />
            </AccordionButton>
            <AccordionPanel>
              {loading ? (
                <Text color="gray.500" fontSize="lg">
                  Loading...
                </Text>
              ) : userDetails ? (
                <>
                  <Text fontWeight="bold" fontSize="md" color="gray.700" mb={2}>
                    Account Name: {userDetails.accountName}
                  </Text>
                  <Box display="flex" alignItems="center">
                    <Text
                      fontWeight="semibold"
                      fontSize="lg"
                      color="blue.600"
                      border="1px"
                      borderColor="blue.500"
                      p={2}
                      rounded="md"
                      flex="1"
                    >
                      MoMo Account Number: {userDetails.accountNumber}
                    </Text>
                    <Tooltip
                      label={hasCopied ? "Copied!" : "Copy Account Number"}
                      isOpen={showTooltip}
                      placement="top"
                    >
                      <IconButton
                        aria-label="Copy Account Number"
                        icon={<FaCopy />}
                        onClick={handleCopyClick}
                        ml={2}
                        bgColor={"#044c73"}
                        color={"#facb05"}
                        _hover={{
                          bgColor: "#044c73",
                          transform: "translateY(-5px)",
                        }}
                      />
                    </Tooltip>
                  </Box>
                </>
              ) : (
                <Text color="red.500" fontSize="lg">
                  Failed to fetch user details
                </Text>
              )}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton
              as="a"
              display="flex"
              justifyContent="center"
              alignItems="center"
              w="full"
              bgColor={"#044c73"}
              cursor={"pointer"}
              color={"white"}
              rounded={"lg"}
              _hover={{
                bgColor: "#044c73",
              }}
            >
              <Box flex="1" textAlign="left">
                Pay with Momo App
              </Box>
              <MdApps color="#facb05" />
            </AccordionButton>
            <AccordionPanel>
              <AppButtons />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};

export default PaymentOptions;
