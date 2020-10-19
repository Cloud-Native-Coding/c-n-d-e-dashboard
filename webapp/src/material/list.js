import { useEffect, useRef } from "react";
import { MDCList } from "@material/list";
import { classname } from "../components/utils";

export function List({ children, twoLine, nonInteractive }) {
  const ref = useRef(null);

  useEffect(() => {
    if (nonInteractive) return;

    const list = new MDCList(ref.current);

    return () => {
      list.destroy();
    };
  }, []);

  let className = "mdc-list";

  if (twoLine) className += " mdc-list--two-line";
  if (nonInteractive) className += " mdc-list--non-interactive";

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}

const itemClassName = classname(
  { activated: "mdc-list-item--activated" },
  "mdc-list-item"
);

export function Item({ children, graphic, meta, ...props }) {
  const [className, restProps] = itemClassName(props);

  return (
    <li className={className} {...restProps}>
      {graphic && <span className="mdc-list-item__graphic"> {graphic} </span>}
      <span className="mdc-list-item__text"> {children} </span>
      {meta && <span className="mdc-list-item__meta"> {meta} </span>}
    </li>
  );
}

export function LinkItem({ graphic, meta, children, ...props }) {
  const [className, restProps] = itemClassName(props);

  return (
    <li>
      <a className={className} {...restProps}>
        {graphic && <span className="mdc-list-item__graphic"> {graphic} </span>}

        <span className="mdc-list-item__text">{children}</span>

        {meta && <span className="mdc-list-item__meta"> {meta} </span>}
      </a>
    </li>
  );
}

export function ItemPrimaryText({ children }) {
  return <span className="mdc-list-item__primary-text">{children}</span>;
}

export function ItemSecondaryText({ children }) {
  return <span className="mdc-list-item__secondary-text">{children}</span>;
}
