import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { promises as fsPromises } from "fs";
import path from "path";
import axios from "axios";
import get from "lodash/get";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const doi_assets_folder = path.join(
    serverRuntimeConfig.PROJECT_ROOT,
    "./public/doi_assets/"
  );

  const list = await fsPromises.lstat(doi_assets_folder);
  const dir = await fsPromises.readdir(doi_assets_folder);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ list, dir }));
};
