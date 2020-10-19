import { useState } from "react";
import styles from "./detailPage.module.scss";

export function DetailPageFront({ children }) {
  return <div className={styles.frontPage}>{children}</div>;
}

export function DetailPageBack({ children }) {
  return <div className={styles.backPage}>{children}</div>;
}

export function DetailPageHeader({ children }) {
  return <div className={styles.header}>{children}</div>;
}

export function DetailPageActions({ children }) {
  return <div className={styles.actions}>{children}</div>;
}

export function DetailPage({ children }) {
  const [showFront, setShowFront] = useState(true);
  const className = showFront ? styles.showFront : styles.showBack;

  function toggle() {
    setShowFront(s => !s);
  }

  return <div className={className}>{children(toggle)}</div>;
}
