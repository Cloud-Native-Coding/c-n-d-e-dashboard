import NextHead from "next/head";

export default function Head({ title, withFont = true, withIcons = true }) {
  return (
    <NextHead>
      <title>{title}</title>
      {withIcons && (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      )}
      {withFont && (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Nunito:regular,700"
        />
      )}
    </NextHead>
  );
}
