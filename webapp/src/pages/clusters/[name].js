import Error from "next/error";
import Layout from "../../components/layout";
import { Cell } from "../../material/grid";
import { ClusterPageContent } from "./";
import { backend } from "../../components/api";

export async function getServerSideProps({ params }) {
  const [devEnvUsers] = await backend.devEnvUsers.get();
  const [cluster, clusterOk, clusterStatus] = await backend.clusters.get(
    params.name
  );
  let error = null;

  if (!clusterOk) {
    error = {
      status: clusterStatus,
      detail: cluster.detail
    };
  }

  return {
    props: {
      devEnvUsers,
      cluster,
      error
    }
  };
}

export default function ClusterPage({ devEnvUsers, cluster, error }) {
  if (error) {
    return <Error statusCode={error.status} title={error.detail} />;
  }

  return (
    <Layout title={cluster.name} className="clusters-page">
      <Cell tablet="7" desktop="10">
        <ClusterPageContent cluster={cluster} devEnvUsers={devEnvUsers} />
      </Cell>
    </Layout>
  );
}
