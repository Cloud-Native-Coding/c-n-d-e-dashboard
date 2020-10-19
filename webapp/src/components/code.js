import { useRef, useEffect } from "react";
import hljs from "highlight.js/lib/highlight";
import yaml from "highlight.js/lib/languages/yaml";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import styles from "./code.module.scss";

hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("dockerfile", dockerfile);

export function Code({ children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(ref.current);
  }, [children]);

  return (
    <pre {...props}>
      <code className={styles.code} ref={ref}>
        {children}
      </code>
    </pre>
  );
}
