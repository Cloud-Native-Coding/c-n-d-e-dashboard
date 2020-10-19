import { useState, useEffect } from "react";
import { api, backend } from "../../components/api";
import Layout from "../../components/layout";
import { Grid, Cell } from "../../material/grid";
import { Headline5, Body1 } from "../../material/typography";
import { TextField } from "../../material/textfield";
import { Button } from "../../material/button";
import { BottomSection } from "../../components/bottomsection";
import { showDialog } from "../../material/dialog";
import { List, Item, LinkItem } from "../../material/list";
import {
  DetailPageHeader,
  DetailPageActions
} from "../../components/detailPage";
import { IconButton } from "../../material/iconbutton";
import { UserCard } from "../../components/userCard";
import { Metrics, useMetrics } from "../../components/metrics";
import { Menu } from "../../material/menu";

export function ClusterPageContent({
  cluster,
  devEnvUsers,
  deleteCluster,
  addUserToCluster,
  removeUserFromCluster
}) {
  const [addedUsersIds, updateAddedUsersIds] = useState(
    cluster.devenvusers.map(({ id }) => id)
  );

  const addedUsers = devEnvUsers.filter(({ id }) => addedUsersIds.includes(id));

  const notAddedUsers = devEnvUsers.filter(
    ({ id }) => !addedUsersIds.includes(id)
  );

  const metrics = useMetrics(cluster.name);

  useEffect(() => {
    updateAddedUsersIds(cluster.devenvusers.map(({ id }) => id));
  }, [cluster]);

  return (
    <>
      <DetailPageHeader>
        <Headline5 Tag="h2">{cluster.name}</Headline5>
        <DetailPageActions>
          {Boolean(notAddedUsers.length) && (
            <Menu
              items={notAddedUsers.map(user => ({
                label: user.name,
                onClick: addUserToCluster(user.id)
              }))}
            >
              <IconButton>person_add</IconButton>
            </Menu>
          )}
          <IconButton onClick={deleteCluster}>delete</IconButton>
        </DetailPageActions>
      </DetailPageHeader>

      <Body1 Tag="p">{cluster.apiKey}</Body1>

      {Boolean(addedUsers.length) && (
        <Grid>
          {addedUsers.map(user => (
            <Cell key={user.id} span="12">
              <UserCard
                user={user}
                deleteCallback={removeUserFromCluster(user.id)}
                metrics={
                  <Metrics
                    metrics={
                      metrics[cluster.name] && metrics[cluster.name][user.id]
                    }
                  />
                }
              />
            </Cell>
          ))}
        </Grid>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const [clusters] = await backend.clusters.get();
  const [devEnvUsers] = await backend.devEnvUsers.get();

  return {
    props: {
      clusters,
      devEnvUsers
    }
  };
}

export default function ClustersPage(props) {
  const [clusters, updateClusters] = useState(props.clusters);
  const [currentCluster, setCurrentCluster] = useState(0);
  const cluster = clusters[currentCluster];

  const addCluster = async name => {
    const [newCluster, clusterOk] = await api.clusters.add({ name });

    if (clusterOk) {
      updateClusters(c => [...c, newCluster]);
    }
  };

  const addUserToCluster = name => id => async () => {
    const [, ok] = await api.clusters.addDevEnvUser(name, id);

    if (ok) {
      updateClusters(cls =>
        cls.map(c => {
          if (c.name === name) {
            c.devenvusers.push({ id });
          }

          return { ...c };
        })
      );
    }
  };

  const removeUserFromCluster = name => id => async () => {
    const [, ok] = await api.clusters.removeDevEnvUser(name, id);

    if (ok) {
      updateClusters(cls =>
        cls.map(c => {
          if (c.name === name) {
            c.devenvusers = c.devenvusers.filter(el => el.id !== id);
          }

          return { ...c };
        })
      );
    }
  };

  const deleteCluster = name => () => {
    const action = async () => {
      const result = await api.clusters.delete(name);

      if (result.ok) {
        setCurrentCluster(0);
        updateClusters(c => c.filter(el => el.name !== name));
      }
    };

    showDialog({
      content:
        "Are you sure you want to delete the cluster? This action can not be undone.",
      actionLabel: "delete",
      action
    });
  };

  return (
    <Layout title="Clusters" path="/clusters">
      <Cell className="hide-on-tablet hide-on-desktop">
        <nav>
          <List>
            {clusters.map(c => (
              <LinkItem
                href={`/clusters/${c.name}`}
                className="cnde-nav-item"
                key={c.name}
              >
                {c.name}
              </LinkItem>
            ))}
          </List>
        </nav>
      </Cell>

      <Cell tablet="2" desktop="3" className="hide-on-phone">
        <List>
          {clusters.map((c, index) => (
            <Item
              className="cnde-nav-item"
              key={c.name}
              onClick={() => setCurrentCluster(index)}
              activated={index === currentCluster}
            >
              {c.name}
            </Item>
          ))}
        </List>
      </Cell>

      <Cell className="hide-on-phone" tablet="5" desktop="7">
        {cluster && (
          <ClusterPageContent
            cluster={cluster}
            devEnvUsers={props.devEnvUsers}
            deleteCluster={deleteCluster(cluster.name)}
            addUserToCluster={addUserToCluster(cluster.name)}
            removeUserFromCluster={removeUserFromCluster(cluster.name)}
          />
        )}
      </Cell>

      <BottomSection>
        {hide => (
          <form
            onSubmit={e => {
              e.preventDefault();
              addCluster(e.target.elements.name.value)
                .then(hide)
                .then(e.target.reset());
            }}
          >
            <Grid>
              <Cell span="12">
                <TextField name="name" label="Cluster Name" />
              </Cell>

              <Cell span="12">
                <Button type="submit" icon="add" unelevated>
                  add
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
