import { useRipple } from "../material/utils";

export function Button({
  icon,
  raised,
  unelevated,
  trailingIcon,
  children,
  className,
  ...props
}) {
  const ref = useRipple();

  let cn = "mdc-button";

  if (className) cn = `${cn} ${className}`;

  if (raised) cn = `${cn} mdc-button--raised`;
  if (unelevated) cn = `${cn} mdc-button--unelevated`;

  let Tag = "a";

  if (!props.href) {
    Tag = "button";
    props.type = props.type || "button";
  }

  return (
    <Tag className={cn} ref={ref} {...props}>
      <div className="mdc-button__ripple"></div>
      {icon && (
        <i className="material-icons mdc-button__icon" aria-hidden="true">
          {icon}
        </i>
      )}
      <span className="mdc-button__label">{children}</span>
      {trailingIcon && (
        <i className="material-icons mdc-button__icon" aria-hidden="true">
          {trailingIcon}
        </i>
      )}
    </Tag>
  );
}
