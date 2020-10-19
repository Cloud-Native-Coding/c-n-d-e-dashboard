export const Grid = ({ children }) => {
  return (
    <div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner">{children}</div>
    </div>
  );
};

export const Cell = ({ span, desktop, tablet, phone, children, className }) => {
  let cn = `mdc-layout-grid__cell${className ? ` ${className}` : ""}`;

  if (span) cn = `${cn} mdc-layout-grid__cell--span-${span}`;
  if (desktop) cn = `${cn} mdc-layout-grid__cell--span-${desktop}-desktop`;
  if (tablet) cn = `${cn} mdc-layout-grid__cell--span-${tablet}-tablet`;
  if (phone) cn = `${cn} mdc-layout-grid__cell--span-${phone}-phone`;

  return <div className={cn}>{children}</div>;
};
