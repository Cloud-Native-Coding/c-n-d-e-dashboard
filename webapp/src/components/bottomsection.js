import { useState } from "react";
import { Fab } from "../material/fab";

export function BottomSection({ icon = "add", children }) {
  const [closed, setClosed] = useState(true);

  let className = "cnde-bottomsection";

  const open = () => setClosed(false);
  const close = () => setClosed(true);

  if (closed) {
    className += " cnde-bottomsection--closed";
  }

  return (
    <div className={className}>
      <section className="mdc-elevation--z12">{children(close)}</section>

      <Fab icon={icon} onClick={open} />
    </div>
  );
}
