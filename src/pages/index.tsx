// @ts-nocheck
import React, { useEffect } from "react";
import axios from "axios";
import store from "store";
import slugify from "slugify";
import { NextPage } from "next";
import { Button } from "baseui/button";
import { Textarea } from "baseui/textarea";
import { Box, Flex } from "reflexbox";
import { FormControl } from "baseui/form-control";
import { Radio, RadioGroup } from "baseui/radio";
import { ruTpl } from "../utils/ru-tpl";
import { Tag } from "baseui/tag";
import { Card } from "baseui/card";
import { Checkbox } from "baseui/checkbox";
import s from "./index.module.css";

interface Props {}

async function fetchDoi(doi) {
  const doi_slug = slugify(doi);
  const cacheResult = localStorage.getItem(doi_slug);

  if (cacheResult) {
    return JSON.parse(cacheResult);
  }

  const srr = await axios.get("/api/crossref-api", {
    params: {
      doi,
    },
  });

  localStorage.setItem(doi_slug, JSON.stringify(srr.data));

  return srr.data;
}

const initialList =
  store.get("doi_list") ||
  "10.1186/s13073-017-0467-4\n" +
    "10.1039/c9an90011\n" +
    "10.1038/s41423-019-0214-4\n" +
    "10.1242/dev.133058\n" +
    "10.1038/nprot.2017.149\n" +
    "10.1016/j.mam.2017.07.003\n" +
    "10.1038/s12276-018-0071-8\n" +
    "10.1016/j.molcel.2015.04.005 \n" +
    "10.1016/j.molcel.2018.10.020\n" +
    "10.1039/c8an01186a\n" +
    "10.3389/fonc.2013.00274\n" +
    "10.1016/j.bpj.2018.06.008\n" +
    "10.1371/journal.pone.0085270\n" +
    "10.1016/j.molcel.2017.01.023\n";

const Page: NextPage<Props> = (props) => {
  const [value, setValue] = React.useState(initialList);

  // const [value, setValue] = React.useState("10.1039/c9an90011");

  const [media_wiki_lang, setMedia_wiki_lang] = React.useState("ru");
  const [sr, setSr] = React.useState([]);
  const [isShowDebugData, setIsShowDebugData] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);

  async function handleSubmit() {
    setIsFetching(true);
    const list = value
      .trim()
      .split("\n")
      .map((__) => __.trim())
      .filter((value, index, self) => self.indexOf(value) === index);

    const finalArr = [];
    for (let i = 0; i < list.length; i++) {
      const listElement = list[i];

      const doiResponse = await fetchDoi(listElement);

      finalArr.push({
        search_id: listElement,
        result: doiResponse,
      });
    }

    console.log("finalArr = ", finalArr);
    setSr(finalArr);
    setIsFetching(false);
  }

  useEffect(() => {
    handleSubmit();
  }, []);

  console.log("sr = ", sr);

  const results = sr.map((item, i) => {
    const key = `rk_${i}`;

    const doiLink = "http://dx.doi.org/" + item.search_id;
    const jsonApiLink = "http://api.crossref.org/v1/works/" + item.search_id;

    const actions = (
      <Flex className={s.actions} width={[90]} justifyContent={"space-between"}>
        <Button
          kind={"primary"}
          size={"mini"}
          $as={"a"}
          href={doiLink}
          target={"_blank"}
        >
          link
        </Button>
        <Button
          kind={"primary"}
          size={"mini"}
          $as={"a"}
          href={jsonApiLink}
          target={"_blank"}
        >
          json
        </Button>
      </Flex>
    );

    if (item.result.error) {
      return (
        <div className={s.result_item} key={key}>
          <Flex>
            <Box flex={1}>
              <h2>{item.search_id}</h2>
            </Box>
            <Flex alignItems={"center"}>{actions}</Flex>
          </Flex>
          <pre
            style={{ backgroundColor: "#D44333", color: "#FBEFEE", padding: 2 }}
          >
            {JSON.stringify(item.result)}
          </pre>
        </div>
      );
    }

    const { map, res, notFound } = ruTpl(item.result);

    const notFoundItems = notFound.length > 0 && (
      <Box pt={2}>
        {notFound.map((__, i) => (
          <Tag
            kind={"warning"}
            closeable={false}
            variant={"outlined"}
            key={`tag_${i}`}
          >
            {__}
          </Tag>
        ))}
      </Box>
    );

    return (
      <div className={s.result_item} key={key}>
        <Flex>
          <Box flex={1}>
            <h2>{item.search_id}</h2>
          </Box>
          <Flex alignItems={"center"}>{actions}</Flex>
        </Flex>
        <code>{res}</code>
        {notFoundItems}
        {isShowDebugData && (
          <pre style={{ overflow: "auto" }}>{JSON.stringify(map, null, 2)}</pre>
        )}
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
              onChange={(e) => {
                setValue((e.target as HTMLTextAreaElement).value);
                store.set("doi_list", (e.target as HTMLTextAreaElement).value);
              }}
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
                  disabled
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
              <Checkbox
                checked={isShowDebugData}
                onChange={(e) => setIsShowDebugData(e.currentTarget.checked)}
                // labelPlacement={LABEL_PLACEMENT.right}
              >
                Print json data
              </Checkbox>
            </Box>
            <Box backgroundColor={"red"}>
              <Button
                isLoading={isFetching}
                size={"compact"}
                onClick={() => {
                  handleSubmit();
                }}
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
      <Box px={2}>
        {results.length > 0 && (
          <Card
            overrides={{
              Contents: {
                style: {
                  // backgroundColor: "green",
                  padding: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  marginLeft: 0,
                  marginRight: 0,
                },
              },
            }}
          >
            {results}
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Page;
