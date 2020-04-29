import * as React from "react";
import { Button } from "@material-ui/core";
//ds

interface Interface {}
const Page = (props: Interface) => {
  const [value, setValue] = React.useState("");

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button size={"large"}>123</Button>
    </div>
  );
};

// Page.getInitialProps = async (ctx) => {
//   return {};
// };

export default Page;
