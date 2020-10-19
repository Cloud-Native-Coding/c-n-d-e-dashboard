import { useRipple } from "../material/utils";

export function Card({ children, title }) {
  return (
    <div className="mdc-card">
      {title && <div className="mdc-card__media-content">{title}</div>}
      {children}
    </div>
  );
}

export function CardActions({ children }) {
  return <div className="mdc-card__actions">{children}</div>;
}

export function ActionButtons({ children }) {
  return <div className="mdc-card__action-buttons">{children}</div>;
}

export function ActionButton({ children, ...btnProps }) {
  return (
    <button
      className="mdc-button mdc-card__action mdc-card__action--button"
      {...btnProps}
    >
      <div className="mdc-button__ripple"></div>
      <span className="mdc-button__label">{children}</span>
    </button>
  );
}

export function ActionIcons({ children }) {
  return <div className="mdc-card__action-icons">{children}</div>;
}

export function ActionIcon({ children, ...btnProps }) {
  return (
    <button
      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
      {...btnProps}
    >
      {children}
    </button>
  );
}

export function ActionLink({ children, ...props }) {
  return (
    <a
      className="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
      {...props}
    >
      <div className="mdc-button__ripple"></div>
      <span className="mdc-button__label">{children}</span>
    </a>
  );
}

export function CardTextContent({ children }) {
  return (
    <div>
      {children}

      <style jsx>{`
        div {
          padding: 16px;
        }
      `}</style>
    </div>
  );
}

export function CardPrimaryAction(props) {
  const ref = useRipple();
  const p = { ...props };

  let Tag = "a";

  if (!p.href) {
    Tag = "div";
    p.tabIndex = 0;
  }

  return <Tag ref={ref} className="mdc-card__primary-action" {...p} />;
}
