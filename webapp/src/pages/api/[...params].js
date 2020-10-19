import fetch from "isomorphic-unfetch";
import config from "../../../config";

export default async ({ method, body, url }, res) => {
  const options = { method };

  if (body) {
    options.body = body;
  }

  const result = await fetch(
    `${config.apiBase}${url.replace("/api", "")}`,
    options
  );

  const data = await result.json();

  res.setHeader("Content-Type", "application/json");
  res.statusCode = result.status;

  res.end(JSON.stringify(data));
};
