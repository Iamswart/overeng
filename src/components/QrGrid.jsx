import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image as ChakraImage,
  SimpleGrid,
  useToast,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BiDownload, BiSolidReport } from "react-icons/bi";
import { fetchQRCodes } from "../services/api-client";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const fetchAndConvertToBlob = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
};

const createImageWithLabel = async (url, label) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important to set this before the `src` attribute

    img.onload = function () {
      const labelHeight = 40; // Increase this if more vertical space is needed
      const labelPadding = 20; // Horizontal padding for the label
      canvas.width = img.width;
      canvas.height = img.height + labelHeight;

      ctx.drawImage(img, 0, 0);

      // Drawing label background
      ctx.fillStyle = "#044c73";
      ctx.fillRect(0, img.height, img.width, labelHeight);

      // Drawing text on top of label background
      ctx.font = "20px Arial";
      ctx.fillStyle = "#facb05";
      ctx.textAlign = "center";
      ctx.fillText(
        label,
        canvas.width / 2,
        img.height + (labelHeight + 20) / 2 // Adjusting vertical centering
      );

      resolve(canvas);
    };

    img.src = url;
  });
};

const downloadAllQRCodes = async (qrCodes, setLoading, toast) => {
  // setLoading(true);
  // const zip = new JSZip();
  // const promises = qrCodes.map(async (qr, index) => {
  //   const blob = await fetchAndConvertToBlob(qr.s3URL);
  //   zip.file(`QRCode-${index + 1}.png`, blob);
  // });

  setLoading(true);
  const zip = new JSZip();
  const promises = qrCodes.map(async (qr, index) => {
    const label = `qr${String(index + 1).padStart(3, "0")}`; // Naming scheme like qr001, qr002, ...
    const canvas = await createImageWithLabel(qr.s3URL, label);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    zip.file(`${label}.png`, blob);
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

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Extracting date parts
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  // Extracting time parts
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
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

  const generateCSV = (data) => {
    const header = [
      "Name",
      "Activation Status",
      "Account Number",
      "Activation Date",
    ];
    const rows = data.map((qr, index) => [
      `qr${String(index + 1).padStart(3, "0")}`, // Naming scheme like qr001, qr002, ...
      qr.isActivated ? "Activated" : "Not Activated",
      qr.accountNumber || "N/A",
      formatDate(qr.activationDate),
    ]);

    const allRows = [header, ...rows];
    const csvContent = allRows.map((e) => e.join(",")).join("\n");
    return csvContent;
  };

  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  const handleReportGeneration = () => {
    const csvContent = generateCSV(qrCodes);
    downloadCSV(csvContent, "qr_codes_report.csv");
  };

  return (
    <Box>
      <Flex justifyContent={"flex-end"} mb={4} mr={[4, 4, 12]}>
        <Button
          onClick={handleReportGeneration}
          bg={"#000"}
          color={"#facb05"}
          mr={4}
          rightIcon={<BiSolidReport />}
          _hover={{
            bgColor: "#000",
            transform: "translateY(-5px)",
          }}
          fontSize={{base: "xs", sm: "md"}}
        >
          Generate Report
        </Button>
        <Button
          onClick={() => downloadAllQRCodes(qrCodes, setLoading, toast)}
          bg={"#000"}
          color={"#facb05"}
          rightIcon={<BiDownload />}
          _hover={{
            bgColor: "#000",
            transform: "translateY(-5px)",
          }}
          fontSize={{base: "xs", sm: "md"}}
        >
          Download All
        </Button>
      </Flex>
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={6}
        padding="10px"
      >
        {qrCodes.map((qr) => (
          <Box key={qr._id} mb={4} position={"relative"}>
            <ChakraImage src={qr.s3URL} />
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
