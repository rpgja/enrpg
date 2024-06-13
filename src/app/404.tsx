// NOTE: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site

import { notFound } from "next/navigation";

export default function NotFound(): never {
  notFound();
}
