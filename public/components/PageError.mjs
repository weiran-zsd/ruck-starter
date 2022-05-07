// @ts-check

import { createElement as h, useContext } from "react";
import TransferContext from "ruck/TransferContext.mjs";

import Heading, { css as cssHeading } from "device-agnostic-ui/Heading.mjs";
import Html, { css as cssPara } from "device-agnostic-ui/Html.mjs";

// Export CSS URLs for the component and its dependencies.
export const css = new Set([
  ...cssHeading,
  ...cssPara,
  "/components/PageError.css",
]);

/**
 * React component for an error page.
 * @param {object} props Props.
 * @param {number} props.status HTTP status code.
 * @param {number} props.title Error title.
 * @param {string} props.description Error description.
 */
export default function PageError({ status, title, description }) {
  // Ruck’s transfer (request/response) context; only populated on the server.
  const ruckTransfer = useContext(TransferContext);

  // If server side rendering, modify the HTTP status code for the Ruck app
  // page response.
  if (ruckTransfer) ruckTransfer.responseInit.status = status;

  return h(
    "section",
    { className: "PageError__section" },
    h(Heading, null, title),
    h(Html, null, description),
  );
}
