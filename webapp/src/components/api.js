import fetch from "isomorphic-unfetch";
import config from "../../config";

const { apiBase } = config;

function getJSON(response) {
  return response.status === 204 ? "" : response.json();
}

export async function fetcher(...args) {
  const response = await fetch(...args);
  const data = await getJSON(response);

  return [data, response.ok, response.status];
}

class Endpoint {
  constructor(path) {
    this._path = path;
  }

  path(id) {
    return id ? `${this._path}/${id}` : this._path;
  }

  get(id) {
    if (id) return fetcher(this.path(id));

    return fetcher(this.path());
  }

  add(data) {
    return fetcher(this.path(), { method: "POST", body: JSON.stringify(data) });
  }

  delete(id) {
    return fetch(this.path(id), { method: "DELETE" });
  }

  update(id, data) {
    return fetcher(this.path(id), {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
}

class Clusters extends Endpoint {
  addDevEnvUser(clusterName, devEnvUserId) {
    return fetcher(
      `${this.path()}/${clusterName}/devenvusers/${devEnvUserId}`,
      { method: "POST" }
    );
  }

  removeDevEnvUser(clusterName, devEnvUserId) {
    return fetcher(
      `${this.path()}/${clusterName}/devenvusers/${devEnvUserId}`,
      { method: "DELETE" }
    );
  }

  getMetrics(clusterName) {
    return fetcher(`${this.path()}/${clusterName}/devenvusers/metrics`);
  }
}

export const backend = {
  clusters: new Clusters(`${apiBase}/clusters`),
  devEnvUsers: new Endpoint(`${apiBase}/devenvusers`),
  buildFiles: new Endpoint(`${apiBase}/buildfiles`),
  builders: new Endpoint(`${apiBase}/builders`)
};

export const api = {
  clusters: new Clusters("/api/clusters"),
  devEnvUsers: new Endpoint("/api/devenvusers"),
  buildFiles: new Endpoint("/api/buildfiles"),
  builders: new Endpoint("/api/builders")
};
