import { useRef, useEffect } from "react";
import { MDCTextField } from "@material/textfield";

function useTextField() {
  const ref = useRef();

  useEffect(function() {
    const textField = new MDCTextField(ref.current);

    return () => {
      try {
        textField.destroy();
      } catch (e) {
        console.warn(e);
      }
    };
  }, []);

  return ref;
}

export function TextField({ label, ...inputProps }) {
  const ref = useTextField();

  return (
    <label ref={ref} className="mdc-text-field mdc-text-field--outlined">
      <input
        type="text"
        className="mdc-text-field__input"
        aria-labelledby={inputProps.name}
        {...inputProps}
      />

      <span className="mdc-notched-outline">
        <span className="mdc-notched-outline__leading"></span>
        <span className="mdc-notched-outline__notch">
          <span className="mdc-floating-label" id={inputProps.name}>
            {label}
          </span>
        </span>
        <span className="mdc-notched-outline__trailing"></span>
      </span>
    </label>
  );
}

export function TextArea({ name, label, ...textAreaProps }) {
  const ref = useTextField();

  return (
    <label ref={ref} className="mdc-text-field mdc-text-field--textarea">
      <textarea
        name={name}
        className="mdc-text-field__input"
        aria-labelledby={name}
        {...textAreaProps}
      ></textarea>
      <span className="mdc-notched-outline">
        <span className="mdc-notched-outline__leading"></span>
        <span className="mdc-notched-outline__notch">
          <label className="mdc-floating-label" id={name}>
            {label}
          </label>
        </span>
        <span className="mdc-notched-outline__trailing"></span>
      </span>
    </label>
  );
}
