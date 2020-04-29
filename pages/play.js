import React from "react";
import get from "lodash/get";
// import { JsonDbg } from "../src/components/JsonDbg/JsonDbg";

// Warning: A component is changing an uncontrolled input of type text to be controlled.
const Page = (props) => {
  console.log("get = ", get);
  const [value, setValue] = React.useState("");

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {/*<Spinner />*/}
      {/*<TextField label={"Label"} v={value} onc={setValue} />*/}
      {/*<JsonDbg v={value} />*/}
    </div>
  );
};

// Page.getInitialProps = async (ctx) => {
//   return {};
// };

export default Page;
