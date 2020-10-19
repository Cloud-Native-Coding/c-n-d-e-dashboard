import { useRef, useEffect } from "react";
import { MDCRipple } from "@material/ripple";
import { MDCIconButtonToggle } from "@material/icon-button";
import { randomColor } from "../components/utils";

function useUnboundedRipple() {
  const ref = useRef();

  useEffect(function() {
    const ripple = new MDCRipple(ref.current);
    ripple.unbounded = true;

    return () => {
      try {
        ripple.destroy();
      } catch (e) {
        console.warn(e);
      }
    };
  }, []);

  return ref;
}

export function IconButton({ className, ...props }) {
  const ref = useUnboundedRipple();

  let cn = "mdc-icon-button material-icons";

  if (className) cn = `${cn} ${className}`;

  return <button ref={ref} className={cn} {...props} />;
}

export function IconToggle({ front, back, ...buttonProps }) {
  const ref = useRef();

  useEffect(() => {
    const iconToggle = new MDCIconButtonToggle(ref.current);

    return () => {
      try {
        iconToggle.destroy();
      } catch (e) {
        console.warn(e);
      }
    };
  }, []);

  return (
    <button
      ref={ref}
      className="mdc-icon-button"
      aria-pressed="false"
      {...buttonProps}
    >
      <i className="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">
        {back}
      </i>
      <i className="material-icons mdc-icon-button__icon">{front}</i>
    </button>
  );
}

export function AvatarLink({ className, ...props }) {
  const ref = useUnboundedRipple();

  let cn = "mdc-icon-button material-icons";

  if (className) cn = `${cn} ${className}`;

  const style = {
    fontFamily: "roboto",
    fontSize: "20px",
    backgroundColor: randomColor(),
    borderRadius: "50%"
  };

  return <a style={style} ref={ref} className={cn} {...props} />;
}
