import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  /** Canonical path, e.g. "/pricing". Defaults to current pathname. */
  canonical?: string;
  /** OG image URL. Defaults to /og-image.png */
  image?: string;
  /** "website" | "article" — defaults to "website" */
  type?: string;
}

const SITE_NAME = "Chronovah";
const BASE_URL = "https://chronovah.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
}: SEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${BASE_URL}${canonical ?? window.location.pathname}`;

    // Basic
    document.title = fullTitle;
    setMeta("description", description);

    // Canonical
    setLink("canonical", canonicalUrl);

    // Open Graph
    setMeta("og:type", type, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", image, "property");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
  }, [title, description, canonical, image, type]);
}
