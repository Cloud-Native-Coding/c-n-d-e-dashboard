import { useState } from "react";
import { api, backend } from "../../components/api";
import Layout from "../../components/layout";
import { Grid, Cell } from "../../material/grid";
import { TextField } from "../../material/textfield";
import { Button } from "../../material/button";
import { Switch } from "../../material/switch";
import { Select } from "../../material/select";
import { BottomSection } from "../../components/bottomsection";
import { formElementsToObject } from "../../components/utils";
import { showDialog } from "../../material/dialog";
import { List, Item, LinkItem } from "../../material/list";

export async function getServerSideProps() {
  const [devEnvUsers] = await backend.devEnvUsers.get();
  const [buildFiles] = await backend.buildFiles.get();

  return {
    props: {
      buildFiles,
      devEnvUsers
    }
  };
}

export function DevEnvUserForm({
  user = {},
  updateUser,
  deleteUser,
  buildFiles
}) {
  return (
    <form
      key={user.name}
      onSubmit={e => {
        e.preventDefault();
        updateUser(user.id, formElementsToObject(e.target.elements));
      }}
    >
      <Grid>
        <Cell desktop="12" tablet="8">
          <TextField
            required
            name="name"
            label="Name"
            defaultValue={user.name}
          />
        </Cell>

        <Cell desktop="12" tablet="8">
          <TextField
            required
            name="email"
            label="Email"
            type="email"
            defaultValue={user.email}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <TextField
            required
            name="clusterRoleName"
            label="Cluster Role"
            defaultValue={user.clusterRoleName}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <Switch
            name="deleteVolume"
            label="Delete namespace"
            defaultChecked={user.deleteVolume}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <Select
            name="buildfileId"
            label="Template"
            options={buildFiles.map(f => ({ text: f.name, value: f.id }))}
            defaultValue={parseInt(user.buildfileId) || ""}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <TextField
            required
            name="roleName"
            label="Role"
            defaultValue={user.roleName}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <TextField
            required
            name="devEnvImage"
            label="Dev Env Image"
            defaultValue={user.devEnvImage}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <TextField
            required
            name="containerVolumeSize"
            label="Container Volume Size"
            defaultValue={user.containerVolumeSize}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <TextField
            required
            name="homeVolumeSize"
            label="Home Volume Size"
            defaultValue={user.homeVolumeSize}
          />
        </Cell>

        <Cell desktop="6" tablet="4">
          <TextField
            required
            name="userEnvDomain"
            label="User Env Domain"
            defaultValue={user.userEnvDomain}
          />
        </Cell>

        <Cell desktop="12" tablet="8">
          <Button type="submit" icon="update" unelevated>
            Update user
          </Button>

          {user && (
            <Button icon="delete" onClick={() => deleteUser(user.id)}>
              Delete user
            </Button>
          )}
        </Cell>
      </Grid>
    </form>
  );
}

export default function DevEnvUsersPage({ buildFiles, ...props }) {
  const [devEnvUsers, updateDevEnvUsers] = useState(props.devEnvUsers);
  const [currentUser, setCurrentUser] = useState(0);
  const devEnvUser = devEnvUsers[currentUser];

  const addUser = async data => {
    const [user, userOk] = await api.devEnvUsers.add(data);

    if (userOk) {
      updateDevEnvUsers(u => [...u, user]);
    }
  };

  const updateUser = async (id, data) => {
    const [, ok] = await api.devEnvUsers.update(id, data);

    if (ok) {
      updateDevEnvUsers(users =>
        users.map(user => {
          if (user.id === id) {
            return { id, ...data };
          }

          return { ...user };
        })
      );
    }
  };

  const deleteUser = id => {
    const action = async () => {
      const result = await api.devEnvUsers.delete(id);

      if (result.ok) {
        setCurrentUser(0);
        updateDevEnvUsers(u => u.filter(user => user.id !== id));
      }
    };

    showDialog({
      content:
        "Are you sure you want to delete the user? This action can not be undone.",
      actionLabel: "delete",
      action
    });
  };

  return (
    <Layout title="Dev Env Users" path="/devenvusers">
      <Cell className="hide-on-tablet hide-on-desktop">
        <nav>
          <List>
            {devEnvUsers.map(user => (
              <LinkItem
                className="cnde-nav-item"
                key={user.id}
                href={`/devenvusers/${user.id}`}
              >
                {user.name}
              </LinkItem>
            ))}
          </List>
        </nav>
      </Cell>

      <Cell tablet="2" desktop="3" className="hide-on-phone">
        <List>
          {devEnvUsers.map((user, index) => (
            <Item
              className="cnde-nav-item"
              key={user.id}
              onClick={() => setCurrentUser(index)}
              activated={index === currentUser}
            >
              {user.name}
            </Item>
          ))}
        </List>
      </Cell>

      <Cell className="hide-on-phone" tablet="5" desktop="7">
        {devEnvUser && (
          <DevEnvUserForm
            user={devEnvUser}
            buildFiles={buildFiles}
            updateUser={updateUser}
            deleteUser={deleteUser}
          />
        )}
      </Cell>

      <BottomSection>
        {hide => (
          <form
            onSubmit={e => {
              e.preventDefault();
              addUser(formElementsToObject(e.target.elements))
                .then(hide)
                .then(e.target.reset());
            }}
          >
            <Grid>
              <Cell span="12">
                <TextField required name="name" label="Name" />
              </Cell>

              <Cell span="12">
                <TextField required name="email" label="Email" type="email" />
              </Cell>

              <Cell span="6">
                <TextField
                  required
                  name="clusterRoleName"
                  label="Cluster Role"
                  defaultValue="view"
                />
              </Cell>

              <Cell span="6">
                <Switch name="deleteVolume" label="Delete namespace" />
              </Cell>

              <Cell span="6">
                <Select
                  name="buildfileId"
                  label="Template"
                  options={buildFiles.map(f => ({ text: f.name, value: f.id }))}
                />
              </Cell>

              <Cell span="6">
                <TextField
                  required
                  name="roleName"
                  label="Role"
                  defaultValue="edit"
                />
              </Cell>

              <Cell span="6">
                <TextField required name="devEnvImage" label="Dev Env Image" />
              </Cell>

              <Cell span="6">
                <TextField
                  required
                  name="containerVolumeSize"
                  label="Container Volume Size"
                />
              </Cell>

              <Cell span="6">
                <TextField
                  required
                  name="homeVolumeSize"
                  label="Home Volume Size"
                />
              </Cell>

              <Cell span="6">
                <TextField
                  required
                  name="userEnvDomain"
                  label="User Env Domain"
                />
              </Cell>

              <Cell span="12">
                <Button type="submit" icon="add" unelevated>
                  Add User
                </Button>

                <Button onClick={hide}>cancel</Button>
              </Cell>
            </Grid>
          </form>
        )}
      </BottomSection>
    </Layout>
  );
}
