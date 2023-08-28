import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NotFound from "../components/404";
import BadRequest from "../components/Wrong";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <Box>
        {isRouteErrorResponse(error) ? <NotFound /> : <BadRequest />}
      </Box>
    </>
  );
};

export default ErrorPage;