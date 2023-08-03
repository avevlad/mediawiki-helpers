const fsPromises = require("fs").promises;
const slugify = require("slugify");
const path = require("path");
const _ = require("lodash");

const doi_assets_folder = path.join("../public/doi_assets/");

// <ref name=“”>{{Статья|автор=...|год=...|doi=...|issn=...|выпуск=...|язык=en|страницы=...|издание=...|заглавие=...|ссылка=...|том=...}}</ref>
//
// Том = Volume
// Выпуск = Issue
// Издание = Journal
// ???

function ruTpl(data) {
  const createdTimestamp = _.get(data, "message.created.timestamp", 0);
  const containerTitle = _.get(data, "message.container-title", []);

  const map = {
    // ??? всех или только первого?
    ["автор"]: data.message.author
      .map((__) => `${__.given} ${__.family}`)
      .join(", ")
      .slice(0, 30),
    // message.created.date-parts[0][0]
    // message.created.date-time // "2013-11-07T11:08:48Z"
    // message.created.date-parts
    ["год"]: new Date(createdTimestamp).getFullYear(),
    ["doi"]: data.message.DOI,
    ["ISSN"]: String(data.message.ISSN),
    // ??? issue
    ["выпуск"]: data.message.issue,
    ["язык"]: "ru",
    ["страницы"]: data.message.page,
    ["издание"]: containerTitle.join(" "), // Journal в Mendeley
    ["заглавие"]: data.message.title.join(" "),
    ["ссылка"]: _.get(data, "message.link.URL", data.message.URL),
    // ??? volume
    ["том"]: data.message.volume,
  };

  const body = Object.entries(map)
    .filter((__) => Boolean(__[1]))
    .map((__) => `${__[0]}=${__[1]}`.trim())
    .join("|");

  return {
    map,
    res: `<ref name="">{{Статья|${body}}</ref>`,
    notFound: Object.entries(map)
      .filter((__) => !Boolean(__[1]))
      .map((__) => __[0])
      .join(", "),
  };
}

(async function go() {
  console.log("doi_assets_folder = ", doi_assets_folder);
  const doiFiles = await fsPromises.readdir(doi_assets_folder);

  for (let i = 0; i < doiFiles.length; i++) {
    const doiFile = doiFiles[i];

    const doiFirstFile = await fsPromises.readFile(
      path.join("../public/doi_assets/", doiFile),
      "utf-8"
    );
    const dfJson = JSON.parse(doiFirstFile);

    // console.log("dfJson = ", dfJson);
    console.log(ruTpl(dfJson));
  }
})();
