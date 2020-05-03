import React from "react";
import App from "next/app";
import getConfig from "next/config";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import { styletron, debug } from "../styletron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons/faRocket";
import * as timeago from "timeago.js";
import ru_locale from "timeago.js/lib/lang/ru";
import s from "./_app.module.css";

timeago.register("ru", ru_locale);

const { publicRuntimeConfig } = getConfig();

const BUILD_TIME = publicRuntimeConfig.BUILD_TIME;
const buildTimeWithAgo = timeago.format(BUILD_TIME, "ru");

const BuildInfo = () => {
  return (
    <div className={s.build_info}>
      <FontAwesomeIcon size={"xs"} icon={faRocket} />{" "}
      <span
        style={{
          paddingLeft: 5,
          fontSize: 12,
          borderBottom: "1px dashed",
          padding: 1,
        }}
      >
        {buildTimeWithAgo}
      </span>
    </div>
  );
};

const GithubLink = () => {
  return (
    <a
      className={s.github_link}
      href={"https://github.com/avevlad/mediawiki-helpers"}
      target={"_blank"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path
          fill-rule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        ></path>
      </svg>
    </a>
  );
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <BaseProvider theme={LightTheme}>
          <BuildInfo />
          <GithubLink />
          <Component {...pageProps} />
        </BaseProvider>
      </StyletronProvider>
    );
  }
}
