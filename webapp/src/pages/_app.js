import "./darktheme.scss";
import "./global.scss";
import "highlight.js/scss/dark.scss";

import "../components/bottomsection.scss";
import "../components/componentToggle.scss";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
