import React, { useEffect } from "react";
import axios from "axios";
import { NextPage } from "next";
import { Button } from "baseui/button";
import { Textarea } from "baseui/textarea";
import { Box, Flex } from "reflexbox";
import { FormControl } from "baseui/form-control";
import { Radio, RadioGroup } from "baseui/radio";

interface Props {}

// <ref name=“”>{{Статья|автор=...|год=...|doi=...|issn=...|выпуск=...|язык=en|страницы=...|издание=...|заглавие=...|ссылка=...|том=...}}</ref>
//
// Том = Volume
// Выпуск = Issue
// Издание = Journal

const Page: NextPage<Props> = (props) => {
  const [value, setValue] = React.useState(
    "10.1186/s13073-017-0467-4\n" +
      // "10.1039/c9an90011\n" +
      // "10.1038/s41423-019-0214-4\n" +
      // "10.1242/dev.133058\n" +
      // "10.1038/nprot.2017.149\n" +
      // "10.1016/j.mam.2017.07.003\n" +
      // "10.1038/s12276-018-0071-8\n" +
      // "10.1016/j.molcel.2015.04.005 \n" +
      // "10.1016/j.molcel.2018.10.020\n" +
      // "10.1039/c8an01186a\n" +
      // "10.3389/fonc.2013.00274\n" +
      // "10.1016/j.bpj.2018.06.008\n" +
      "10.1371/journal.pone.0085270"
  );

  // const [value, setValue] = React.useState("10.1039/c9an90011");

  const [media_wiki_lang, setMedia_wiki_lang] = React.useState("ru");
  const [sr, setSr] = React.useState([]);

  async function handleSubmit() {
    const list = value
      .trim()
      .split("\n")
      .map((__) => __.trim());

    const finalArr = [];
    for (let i = 0; i < list.length; i++) {
      const listElement = list[i];

      const srr = await axios.get("/api/crossref", {
        params: {
          doi: listElement,
        },
      });

      finalArr.push({
        search_id: value,
        result: srr.data,
      });
    }

    console.log("finalArr = ", finalArr);
    setSr(finalArr);
  }

  useEffect(() => {
    handleSubmit();
  }, []);

  console.log("sr = ", sr);

  const results = sr.map((item, i) => {
    const key = `rk_${i}`;

    if (item.result.error) {
      return (
        <div key={key}>
          <div>{item.search_id}</div>
          <div>{JSON.stringify(item.result)}</div>
        </div>
      );
    }

    return (
      <div key={key}>
        <hr />
        123
        <h2>{item.dsad}</h2>
      </div>
    );
  });

  return (
    <Box width={900} m={"auto"}>
      <Flex mb={3}>
        <Box width={[1 / 2]} px={2}>
          <FormControl label={() => "Список DOI"}>
            <Textarea
              id={"doi_list"}
              value={value}
              rows={8}
              onChange={(e) =>
                setValue((e.target as HTMLTextAreaElement).value)
              }
              placeholder="Controlled Input"
            />
          </FormControl>
        </Box>
        <Box width={[1 / 2]} px={2} paddingBottom={3}>
          <Flex
            height={["100%"]}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              <FormControl label={() => "Media wiki lang"}>
                <RadioGroup
                  // labelPlacement={"bottom"}
                  value={media_wiki_lang}
                  onChange={(e) => setMedia_wiki_lang(e.target.value)}
                  name="number"
                  align="horizontal"
                >
                  <Radio value="ru">Ru</Radio>
                  <Radio value="en">En</Radio>
                </RadioGroup>
              </FormControl>
            </Box>
            <Box backgroundColor={"red"}>
              <Button
                size={"compact"}
                overrides={{
                  BaseButton: {
                    style: {
                      width: "100%",
                    },
                  },
                }}
              >
                Найти
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box px={2}>{results}</Box>
    </Box>
  );
};

export default Page;
