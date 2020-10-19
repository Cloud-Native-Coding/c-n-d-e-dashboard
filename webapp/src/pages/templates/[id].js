import { useState } from "react";
import Error from "next/error";
import { backend, api } from "../../components/api";
import Layout from "../../components/layout";
import { Cell } from "../../material/grid";
import { TemplatePageContent } from "./";
import { showDialog } from "../../material/dialog";

export async function getServerSideProps({ params }) {
  const [buildFile, ok, status] = await backend.buildFiles.get(params.id);
  const [builders] = await backend.builders.get();
  let error = null;

  if (!ok) {
    error = {
      status,
      detail: buildFile.detail.replace(/Build File/u, "Template")
    };
  }

  return {
    props: {
      builders,
      buildFile,
      error
    }
  };
}

export default function TemplatePage({ builders, error, ...props }) {
  if (error) {
    return <Error statusCode={error.status} title={error.detail} />;
  }

  const [buildFile, updateBuildFile] = useState(props.buildFile);
  const builder = builders.find(b => b.id === buildFile.builderId);

  const submit = toggle => async data => {
    await api.buildFiles.update(builder.id, data);
    updateBuildFile(b => ({ ...b, ...data }));
    toggle();
  };

  function deleteBuildFile() {
    async function action() {
      const result = await api.buildFiles.delete(buildFile.id);

      if (result.ok) {
        location.pathname = "/templates";
      }
    }

    showDialog({
      content:
        "Are you sure you want to delete the template? This action can not be undone.",
      actionLabel: "delete",
      action
    });
  }

  return (
    <Layout title={buildFile.name} className="templates-page">
      <Cell tablet="7" desktop="10">
        <TemplatePageContent
          buildFile={buildFile}
          builders={builders}
          deleteBuildFile={deleteBuildFile}
          updateBuildFile={submit}
        />
      </Cell>
    </Layout>
  );
}
