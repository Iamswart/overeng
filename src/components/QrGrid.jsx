import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { BiDownload } from "react-icons/bi";
import { fetchQRCodes } from "../services/api-client";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const fetchAndConvertToBlob = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
};


const downloadAllQRCodes = async (qrCodes, setLoading, toast) => {
  setLoading(true);
  const zip = new JSZip();
  const promises = qrCodes.map(async (qr, index) => {
    const blob = await fetchAndConvertToBlob(qr.s3URL);
    zip.file(`QRCode-${index + 1}.png`, blob);
  });

  await Promise.all(promises);
  zip
    .generateAsync({ type: "blob" })
    .then((content) => {
      saveAs(content, "QR_Codes.zip");
      setLoading(false);
      toast({
        title: "Download Complete!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    })
    .catch(() => {
      setLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong while downloading.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    });
};

const QrGrid = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getQRCodes = async () => {
      try {
        const codes = await fetchQRCodes();
        setQrCodes(codes.slice(0, 30));
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    };

    getQRCodes();
  }, [toast]);

  return (
    <Box>
      <Flex justifyContent="flex-end" mb={4} mr={12}>
        <Button
          onClick={() => downloadAllQRCodes(qrCodes, setLoading, toast)}
          bg={"#000"}
          color={"#facb05"}
          rightIcon={<BiDownload />}
          _hover={{
            bgColor: "#000",
            transform: "translateY(-5px)",
          }}
        >
          Download All
        </Button>
      </Flex>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={6} padding="10px">
        {qrCodes.map((qr) => (
          <Box key={qr._id} mb={4} position={"relative"}>
            <Image src={qr.s3URL} />
            {qr.isActivated && (
              <Flex justify="center" mt={1}>
                <Button
                  size="sm"
                  disabled={true}
                  bg="#044c73"
                  _hover={{ bgColor: "#044c73" }}
                  color={"white"}
                >
                  Activated by {qr.accountNumber}
                </Button>
              </Flex>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default QrGrid;

