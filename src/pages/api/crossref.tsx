import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { promises as fsPromises } from "fs";
import path from "path";
import axios from "axios";
import get from "lodash/get";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
const isProd = process.env.NODE_ENV === "production";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const doi_assets_folder = path.join(
    process.cwd(),
    !isProd ? "./public/doi_assets/" : ""
  );
  console.log("doi_assets_folder = ", doi_assets_folder);

  const doi = get(req.query, "doi") as string;

  if (!doi) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "doi is req" }));
    return;
  }

  const slugify_doi = slugify(doi);

  let r = {};

  const fileName = path.join(doi_assets_folder, `${slugify_doi}.json`);

  try {
    const rfR = await fsPromises.readFile(fileName, "utf-8");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(rfR);
    return;
  } catch (e) {}

  try {
    const sr = await axios.get(`https://api.crossref.org/v1/works/${doi}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) Chrome/80",
      },
    });

    await fsPromises.writeFile(
      path.join(doi_assets_folder, `${slugify_doi}.json`),
      JSON.stringify(sr.data, null, 2)
    );
    r = sr.data;
  } catch (e) {
    r = {
      error: e.message,
      data: e?.response?.data,
    };
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(r));
};
