import React, { useEffect, useRef } from "react";
import { MDCMenu } from "@material/menu";

export function Menu({ children, items }) {
  const ref = useRef();
  const menuRef = useRef();

  useEffect(function() {
    menuRef.current = new MDCMenu(ref.current);

    return () => {
      menuRef.current.destroy();
    };
  }, []);

  const btn = React.cloneElement(children, {
    onClick: () => {
      menuRef.current.open = true;
    }
  });

  return (
    <>
      {btn}

      <div className="mdc-menu-surface--anchor">
        <div ref={ref} className="mdc-menu mdc-menu-surface">
          <ul
            className="mdc-list"
            role="menu"
            aria-hidden="true"
            aria-orientation="vertical"
            tabIndex="-1"
          >
            {items.map(({ label, onClick }) => (
              <li
                key={label}
                className="mdc-list-item"
                role="menuItem"
                onClick={onClick}
              >
                <span className="mdc-list-item__text">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
