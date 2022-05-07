// @ts-check

import { createElement as h } from "react";
import routePlanForContentWithCss from "ruck/routePlanForContentWithCss.mjs";

// The component used to display a route loading error (e.g. due to an
// internet dropout) should be imported up front instead of dynamically
// importing it when needed, as it would likely also fail to load.
import PageError, {
  // A `Set` instance containing CSS URLs.
  css as cssPageError,
} from "./components/PageError.mjs";

/**
 * Gets the Ruck app route plan for a URL.
 * @type {import("ruck/serve.mjs").Router}
 */
export default function router(url, headManager, isInitialRoute) {
  if (url.pathname === "/") {
    return routePlanForContentWithCss(
      // Dynamically import route components so they only load when needed.
      import("./components/PageHome.mjs").then(
        ({ default: PageHome, css }) => ({
          content: h(PageHome),
          css,
        }),
        // It’s important to handle dynamic import loading errors.
        catchImportContentWithCss,
      ),
      headManager,
      isInitialRoute,
    );
  }

  if (url.pathname === "/blog") {
    return routePlanForContentWithCss(
      import("./components/PageBlog.mjs").then(
        ({ default: PageBlog, css }) => ({
          content: h(PageBlog),
          css,
        }),
        catchImportContentWithCss,
      ),
      headManager,
      isInitialRoute,
    );
  }

  // For routes with URL slugs, use RegEx that only matches valid slugs,
  // instead of simply extracting the whole slug. This way an invalid URL slug
  // naturally results in an immediate 404 error and avoids loading the route
  // component or loading data with the invalid slug.
  const matchPagePost = url.pathname.match(/^\/blog\/(?<postId>[\w-]+)$/u);

  if (matchPagePost?.groups) {
    const { postId } = matchPagePost.groups;

    return routePlanForContentWithCss(
      import("./components/PagePost.mjs").then(
        ({ default: PagePost, css }) => ({
          content: h(PagePost, { postId }),
          css,
        }),
      ),
      headManager,
      isInitialRoute,
    );
  }

  // Fallback to a 404 error page.
  return routePlanForContentWithCss(
    // If you have a component specifically for a 404 error page, it would be
    // ok to dynamically import it here. In this particular example the
    // component was already imported for the loading error page.
    {
      content: h(PageError, {
        status: 404,
        title: "Error 404",
        description: "Something is missing.",
      }),
      css: cssPageError,
    },
    headManager,
    isInitialRoute,
  );
}

/**
 * Catches a dynamic import error for route content with CSS.
 * @param {Error} cause Import error.
 * @returns {import("ruck/routePlanForContentWithCss.mjs").RouteContentWithCss}
 */
function catchImportContentWithCss(cause) {
  console.error(new Error("Import rejection for route with CSS.", { cause }));

  return {
    content: h(PageError, {
      status: 500,
      title: "Error loading",
      description: "Unable to load.",
    }),
    css: cssPageError,
  };
}
