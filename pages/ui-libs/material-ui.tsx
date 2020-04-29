import React from "react";
import TextField from "@material-ui/core/TextField";

const Page = (props) => {
  const [value, setValue] = React.useState("");

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        2222222
      </TextField>
    </div>
  );
};

// Page.getInitialProps = async (ctx) => {
//   return {};
// };

export default Page;
