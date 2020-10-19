import { useRef, useEffect } from "react";
import { MDCSwitch } from "@material/switch";

export function Switch({ label, name, ...inputProps }) {
  const ref = useRef();

  useEffect(() => {
    const switchControl = new MDCSwitch(ref.current);

    return () => {
      switchControl.destroy();
    };
  });

  return (
    <>
      <div ref={ref} className="mdc-switch">
        <div className="mdc-switch__track"></div>
        <div className="mdc-switch__thumb-underlay">
          <div className="mdc-switch__thumb"></div>
          <input
            type="checkbox"
            name={name}
            id={name}
            className="mdc-switch__native-control"
            role="switch"
            {...inputProps}
          />
        </div>
      </div>
      <label htmlFor={name}> {label} </label>
    </>
  );
}
