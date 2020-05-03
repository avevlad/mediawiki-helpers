const slugify = require("slugify");
const _ = require("lodash");

exports.ruTpl = function (data) {
  const createdTimestamp = _.get(data, "message.created.timestamp", 0);
  const containerTitle = _.get(data, "message.container-title", []);

  const map = {
    // ??? всех или только первого?
    ["автор"]: data.message.author
      .map((__) => `${__.given} ${__.family}`)
      .join(", "),
    // .slice(0, 30),
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

  const attr_name = slugify(data.message.DOI.replace("/", "_"), {});

  return {
    map,
    res: `<ref name="${attr_name}">{{Статья|${body}}}</ref>`,
    notFound: Object.entries(map)
      .filter((__) => !Boolean(__[1]))
      .map((__) => __[0]),
  };
};
