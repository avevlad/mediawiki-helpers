// @ts-nocheck
import React from "react";
import styled from "@emotion/styled";
import { typography, space, color } from "styled-system";

const Box = styled("div")(typography, space, color);

const Page = (props) => {
  const [value, setValue] = React.useState("");

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Box p={3}>Hello</Box>
    </div>
  );
};

// Page.getInitialProps = async (ctx) => {
//   return {};
// };

export default Page;
