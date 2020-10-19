import { useState } from "react";
import Error from "next/error";
import { backend, api } from "../../components/api";
import Layout from "../../components/layout";
import { showDialog } from "../../material/dialog";
import { BuilderPageContent } from "./";
import { Cell } from "../../material/grid";

export async function getServerSideProps({ params }) {
  const [builder, ok, status] = await backend.builders.get(params.id);
  let error = null;

  if (!ok) {
    error = {
      status,
      detail: builder.detail
    };
  }

  return {
    props: {
      builder,
      error
    }
  };
}

export default function BuilderPage({ error, ...props }) {
  if (error) {
    return <Error statusCode={error.status} title={error.detail} />;
  }

  const [builder, updateBuilder] = useState(props.builder);

  const submit = toggle => async data => {
    await api.builders.update(builder.id, data);
    updateBuilder(b => ({ ...b, ...data }));
    toggle();
  };

  function deleteBuilder() {
    async function action() {
      const result = await api.builders.delete(builder.id);

      if (result.ok) {
        location.pathname = "/builders";
      }
    }

    showDialog({
      content:
        "Are you sure you want to delete the builder? This action can not be undone.",
      actionLabel: "delete",
      action
    });
  }

  return (
    <Layout title={builder.name} className="builders-page">
      <Cell tablet="7" desktop="10">
        <BuilderPageContent
          builder={builder}
          deleteBuilder={deleteBuilder}
          submit={submit}
        />
      </Cell>
    </Layout>
  );
}
