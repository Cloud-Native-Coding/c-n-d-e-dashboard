import { useRipple } from "../material/utils";

export function Fab({ icon, className, ...buttonProps }) {
  const ref = useRipple();

  let cn = "mdc-fab";

  if (className) cn = `${cn} ${className}`;

  return (
    <button className={cn} {...buttonProps} ref={ref}>
      <div className="mdc-fab__ripple"></div>
      <span className="mdc-fab__icon material-icons">{icon}</span>
    </button>
  );
}
