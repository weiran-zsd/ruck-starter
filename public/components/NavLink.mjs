// @ts-check

import { createElement as h } from "react";
import useOnClickRouteLink from "ruck/useOnClickRouteLink.mjs";
import useRoute from "ruck/useRoute.mjs";

export const css = new Set([
  "/components/NavLink.css",
]);

/**
 * React component for a navigation link.
 * @param {object} props Props.
 * @param {string} props.href Link URL.
 * @param {import("react").ReactNode} [props.children] Children.
 */
export default function NavLink({ href, children }) {
  const route = useRoute();
  const onClick = useOnClickRouteLink();

  let className = "NavLink__a";
  if (href === route.url.pathname) className += " NavLink__a--active";

  return h("a", { className, href, onClick }, children);
}
