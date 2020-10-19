import { useState, useRef, useEffect } from "react";
import { MDCDialog } from "@material/dialog";

const dialogEvent = "cnde-open-dialog";

export function showDialog(dialogOptions) {
  document.dispatchEvent(
    new CustomEvent(dialogEvent, {
      detail: dialogOptions
    })
  );
}

export function Dialog() {
  const ref = useRef();

  const [{ action, actionLabel, content }, updateOptions] = useState({});

  useEffect(() => {
    const dialog = new MDCDialog(ref.current);

    document.addEventListener(dialogEvent, e => {
      dialog.open();
      updateOptions(e.detail);
    });

    return dialog.destroy;
  }, []);

  return (
    <div ref={ref} className="mdc-dialog">
      <div className="mdc-dialog__container">
        <div
          className="mdc-dialog__surface"
          role="alertdialog"
          aria-modal="true"
          aria-describedby="cnde-dialog-content"
        >
          <div className="mdc-dialog__content" id="cnde-dialog-content">
            {content}
          </div>
          <div className="mdc-dialog__actions">
            <button
              type="button"
              className="mdc-button mdc-dialog__button"
              data-mdc-dialog-action="cancel"
            >
              <div className="mdc-button__ripple"></div>
              <span className="mdc-button__label">Cancel</span>
            </button>
            <button
              type="button"
              className="mdc-button mdc-dialog__button"
              data-mdc-dialog-action="accept"
              onClick={action}
            >
              <div className="mdc-button__ripple"></div>
              <span className="mdc-button__label">{actionLabel}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mdc-dialog__scrim"></div>
    </div>
  );
}
