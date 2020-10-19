export const Headline1 = ({ Tag = "h1", children }) => {
  return <Tag className="mdc-typography--headline1">{children}</Tag>;
};

export const Headline2 = ({ Tag = "h2", children }) => {
  return <Tag className="mdc-typography--headline2">{children}</Tag>;
};

export const Headline3 = ({ Tag = "h3", children }) => {
  return <Tag className="mdc-typography--headline3">{children}</Tag>;
};

export const Headline4 = ({ Tag = "h4", children }) => {
  return <Tag className="mdc-typography--headline4">{children}</Tag>;
};

export const Headline5 = ({ Tag = "h5", children }) => {
  return <Tag className="mdc-typography--headline5">{children}</Tag>;
};

export const Headline6 = ({ Tag = "h6", children }) => {
  return <Tag className="mdc-typography--headline6">{children}</Tag>;
};

export const Subtitle1 = ({ Tag = "h6", children }) => {
  return <Tag className="mdc-typography--subtitle1">{children}</Tag>;
};

export const Subtitle2 = ({ Tag = "h6", children }) => {
  return <Tag className="mdc-typography--subtitle2">{children}</Tag>;
};

export const Body1 = ({ Tag = "p", children }) => {
  return <Tag className="mdc-typography--body1">{children}</Tag>;
};

export const Body2 = ({ Tag = "p", children }) => {
  return <Tag className="mdc-typography--body2">{children}</Tag>;
};

export const Caption = ({ Tag = "span", children }) => {
  return <Tag className="mdc-typography--caption">{children}</Tag>;
};

export const Overline = ({ Tag = "span", children }) => {
  return <Tag className="mdc-typography--overline">{children}</Tag>;
};
