import { useState } from "react";
import Error from "next/error";
import { backend, api } from "../../components/api";
import Layout from "../../components/layout";
import { Cell } from "../../material/grid";
import { DevEnvUserForm } from "./";
import { showDialog } from "../../material/dialog";

export async function getServerSideProps({ params }) {
  const [devEnvUser, ok, status] = await backend.devEnvUsers.get(params.id);
  const [buildFiles] = await backend.buildFiles.get();

  let error = null;

  if (!ok) {
    error = {
      status,
      detail: devEnvUser.detail
    };
  }

  return {
    props: {
      devEnvUser,
      buildFiles,
      error
    }
  };
}

export default function DevEnvUserPage({ error, buildFiles, ...props }) {
  if (error) {
    return <Error statusCode={error.status} title={error.detail} />;
  }

  const [devEnvUser, updateDevEnvUser] = useState(props.devEnvUser);

  const submit = async (id, data) => {
    await api.devEnvUsers.update(id, data);
    updateDevEnvUser(u => ({ ...u, ...data }));
  };

  function deleteUser() {
    async function action() {
      const result = await api.devEnvUsers.delete(devEnvUser.id);

      if (result.ok) {
        location.pathname = "/devenvusers";
      }
    }

    showDialog({
      content:
        "Are you sure you want to delete the dev env user? This action can not be undone.",
      actionLabel: "delete",
      action
    });
  }

  return (
    <Layout title={devEnvUser.name}>
      <Cell desktop="10" tablet="7">
        <DevEnvUserForm
          user={devEnvUser}
          buildFiles={buildFiles}
          updateUser={submit}
          deleteUser={deleteUser}
        />
      </Cell>
    </Layout>
  );
}
