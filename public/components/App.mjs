// @ts-check

import { createElement as h, Fragment, useMemo } from "react";
import useCss from "ruck/useCss.mjs";
import useHead from "ruck/useHead.mjs";
import useRoute from "ruck/useRoute.mjs";

import NavLink, { css as cssNavLink } from "./NavLink.mjs";

const css = new Set([
  ...cssNavLink,
  "/components/App.css",
]);

/**
 * React component for the Ruck app.
 * @type {import("ruck/serve.mjs").AppComponent}
 */
export default function App() {
  const route = useRoute();

  useHead(
    // Head tag fragments render in the document head in key order. A good
    // convention is to use group and subgroup numbers, followed by a
    // descriptive name.
    "1-1-meta",
    // Must be memoized. If it’s dynamic use the `useMemo` React hook,
    // otherwise define it outside the component function scope.
    useMemo(() =>
      h(
        Fragment,
        null,
        h("meta", {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        }),
        h("meta", {
          name: "og:image",
          content:
            // Sometimes an absolute URL is necessary.
            `${route.url.origin}/social-preview.png`,
        }),
        h("link", { rel: "manifest", href: "/manifest.webmanifest" }),
        // More head tags here…
      ), [route.url.origin]),
  );

  // This loop doesn’t break React hook rules as the list never changes.
  for (const href of css) useCss(href);

  return h(
    Fragment,
    null,
    // Global nav…
    h(
      "nav",
      { className: "App__nav" },
      h(NavLink, { href: "/" }, "Home"),
      h(NavLink, { href: "/blog" }, "Blog"),
    ),
    // Route content…
    route.content,
    // Global footer…
    h("footer", { className: "App__footer" }, "Global footer content."),
  );
}
