import { useState } from "react";
import { backend, api } from "../../components/api";
import Layout from "../../components/layout";
import { Grid, Cell } from "../../material/grid";
import { Headline5 } from "../../material/typography";
import { TextField, TextArea } from "../../material/textfield";
import { Button } from "../../material/button";
import { BottomSection } from "../../components/bottomsection";
import { formElementsToObject } from "../../components/utils";
import { Code } from "../../components/code";
import { List, Item, LinkItem } from "../../material/list";
import { IconButton } from "../../material/iconbutton";
import { showDialog } from "../../material/dialog";
import {
  DetailPage,
  DetailPageHeader,
  DetailPageActions,
  DetailPageFront,
  DetailPageBack
} from "../../components/detailPage";

export function BuilderPageContent({ builder, deleteBuilder, submit }) {
  return (
    <DetailPage>
      {toggle => (
        <>
          <DetailPageFront>
            <DetailPageHeader>
              <Headline5 Tag="h2">{builder.name}</Headline5>
              <DetailPageActions>
                <IconButton onClick={toggle}>edit</IconButton>
                <IconButton onClick={deleteBuilder}>delete</IconButton>
              </DetailPageActions>
            </DetailPageHeader>

            <Code>{builder.value}</Code>
          </DetailPageFront>

          <DetailPageBack>
            <DetailPageHeader>
              <Headline5 Tag="h2">{builder.name}</Headline5>
              <DetailPageActions>
                <IconButton onClick={toggle}>close</IconButton>
              </DetailPageActions>
            </DetailPageHeader>
            <BuilderForm
              builder={builder}
              submit={submit(toggle)}
              submitLabel="update"
              icon="update"
            />
          </DetailPageBack>
        </>
      )}
    </DetailPage>
  );
}

export function BuilderForm({ builder = {}, submit, submitLabel, icon }) {
  return (
    <form key={builder.name} onSubmit={submit}>
      <Grid>
        <Cell span="12">
          <TextField
            required
            name="name"
            label="Builder Name"
            defaultValue={builder.name}
          />
        </Cell>

        <Cell span="12">
          <TextArea
            required
            name="value"
            label="Builder"
            rows="10"
            defaultValue={builder.value}
          />
        </Cell>

        <Cell span="12">
          <Button type="submit" icon={icon} unelevated>
            {submitLabel}
          </Button>
        </Cell>
      </Grid>
    </form>
  );
}

export async function getServerSideProps() {
  const [builders] = await backend.builders.get();

  return {
    props: {
      builders
    }
  };
}

export default function BuildersPage(props) {
  const [builders, updateBuilders] = useState(props.builders);
  const [currentBuilder, setCurrentBuilder] = useState(0);
  const builder = builders[currentBuilder];

  const addBuilder = hide => async e => {
    e.preventDefault();
    e.persist();

    const data = formElementsToObject(e.target.elements);
    const [newBuilder, builderOk] = await api.builders.add(data);

    if (builderOk) {
      e.target.reset();
      updateBuilders(b => [...b, newBuilder]);
      hide();
    }
  };

  const updateBuilder = id => toggle => async e => {
    e.preventDefault();
    const data = formElementsToObject(e.target.elements);

    await api.builders.update(id, data);

    updateBuilders(b => {
      const result = [...b];

      result.forEach(el => {
        if (el.id === id) {
          el.name = data.name;
          el.value = data.value;
        }
      });

      return result;
    });

    toggle();
  };

  const deleteBuilder = id => () => {
    const action = async () => {
      const result = await api.builders.delete(id);

      if (result.ok) {
        setCurrentBuilder(0);
        updateBuilders(b => b.filter(el => el.id !== id));
      }
    };

    showDialog({
      content:
        "Are you sure you want to delete the builder? This action can not be undone.",
      actionLabel: "delete",
      action
    });
  };

  return (
    <Layout title="Builders" path="/builders">
      <Cell className="hide-on-tablet hide-on-desktop">
        <nav>
          <List>
            {builders.map(b => (
              <LinkItem
                className="cnde-nav-item"
                key={b.id}
                href={`/builders/${b.id}`}
              >
                {b.name}
              </LinkItem>
            ))}
          </List>
        </nav>
      </Cell>

      <Cell tablet="2" desktop="3" className="hide-on-phone">
        <List>
          {builders.map((b, index) => (
            <Item
              className="cnde-nav-item"
              key={b.id}
              onClick={() => setCurrentBuilder(index)}
              activated={index === currentBuilder}
            >
              {b.name}
            </Item>
          ))}
        </List>
      </Cell>

      <Cell className="hide-on-phone" tablet="5" desktop="7">
        {builder && (
          <BuilderPageContent
            builder={builder}
            deleteBuilder={deleteBuilder(builder.id)}
            submit={updateBuilder(builder.id)}
          />
        )}
      </Cell>

      <BottomSection>
        {hide => (
          <BuilderForm submit={addBuilder(hide)} submitLabel="add" icon="add" />
        )}
      </BottomSection>
    </Layout>
  );
}
