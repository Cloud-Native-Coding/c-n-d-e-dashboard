import { useRef, useEffect } from "react";
import { MDCSelect } from "@material/select";

export function Select({ options, label, name, required, defaultValue }) {
  const selectRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const select = new MDCSelect(selectRef.current);

    const selectedIndex = options.findIndex(
      ({ value }) => value === defaultValue
    );

    if (selectedIndex > -1) {
      select.selectedIndex = required ? selectedIndex : selectedIndex + 1;
    }

    if (required) {
      select.required = true;
    }

    select.listen("MDCSelect:change", () => {
      inputRef.current.value = select.value;
    });
  }, []);

  return (
    <div ref={selectRef} className="mdc-select mdc-select--outlined">
      <div className="mdc-select__anchor">
        <i className="mdc-select__dropdown-icon"></i>
        <div
          className="mdc-select__selected-text"
          role="button"
          aria-haspopup="listbox"
          aria-labelledby={name}
        ></div>

        <span className="mdc-notched-outline">
          <span className="mdc-notched-outline__leading"></span>
          <span className="mdc-notched-outline__notch">
            <span id={name} className="mdc-floating-label">
              {label}
            </span>
          </span>
          <span className="mdc-notched-outline__trailing"></span>
        </span>
        <input
          ref={inputRef}
          name={name}
          type="hidden"
          defaultValue={defaultValue}
        />
      </div>

      <div
        className="mdc-select__menu mdc-menu mdc-menu-surface cnde-select"
        role="listbox"
      >
        <ul className="mdc-list">
          {!required && (
            <li className="mdc-list-item" data-value="" role="option"></li>
          )}
          {options.map(({ text, value }) => (
            <li
              key={text}
              className="mdc-list-item"
              data-value={value}
              role="option"
            >
              <span className="mdc-list-item__text">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
