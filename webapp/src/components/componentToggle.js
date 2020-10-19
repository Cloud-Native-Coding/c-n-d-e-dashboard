import { useState } from "react";
import { IconButton } from "../material/iconbutton";

export function ComponentToggle({ front, back, actions }) {
  const [showFront, setShowFront] = useState(true);

  function toggle() {
    setShowFront(current => !current);
  }

  let className = "component-toggle";

  if (showFront) {
    className += " component-toggle--front";
  }

  return (
    <div className={className}>
      <div className="component-toggle__close">
        <IconButton onClick={toggle}>close</IconButton>
      </div>
      <div className="component-toggle__toggle">
        <IconButton onClick={toggle}>edit</IconButton>
        {actions}
      </div>

      <div className="component-toggle__front">{front}</div>
      <div className="component-toggle__back">{back(toggle)}</div>
    </div>
  );
}
