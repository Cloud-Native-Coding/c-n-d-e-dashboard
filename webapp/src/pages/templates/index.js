import { useState } from "react";
import { api, backend } from "../../components/api";
import Layout from "../../components/layout";
import { Grid, Cell } from "../../material/grid";
import { Headline5 } from "../../material/typography";
import { TextField, TextArea } from "../../material/textfield";
import { Button } from "../../material/button";
import { Select } from "../../material/select";
import { BottomSection } from "../../components/bottomsection";
import { formElementsToObject } from "../../components/utils";
import { Code } from "../../components/code";
import { showDialog } from "../../material/dialog";
import {
  DetailPage,
  DetailPageHeader,
  DetailPageActions,
  DetailPageFront,
  DetailPageBack
} from "../../components/detailPage";
import { List, Item, LinkItem } from "../../material/list";
import { IconButton } from "../../material/iconbutton";

export function TemplatePageContent({
  buildFile,
  builders,
  deleteBuildFile,
  updateBuildFile
}) {
  const builder = builders.find(b => b.id === buildFile.builderId);

  return (
    <DetailPage>
      {toggle => (
        <>
          <DetailPageFront>
            <DetailPageHeader>
              <Headline5 Tag="h2">{buildFile.name}</Headline5>
              <DetailPageActions>
                <IconButton onClick={toggle}>edit</IconButton>
                <IconButton onClick={deleteBuildFile}>delete</IconButton>
              </DetailPageActions>
            </DetailPageHeader>

            {builder && (
              <Button href={`/builders/${builder.id}`}>{builder.name}</Button>
            )}
            <Code>{buildFile.value}</Code>
          </DetailPageFront>

          <DetailPageBack>
            <DetailPageHeader>
              <Headline5 Tag="h2">{buildFile.name}</Headline5>
              <DetailPageActions>
                <IconButton onClick={toggle}>close</IconButton>
              </DetailPageActions>
            </DetailPageHeader>
            <TemplateForm
              buildFile={buildFile}
              submit={updateBuildFile(toggle)}
              builders={builders}
            />
          </DetailPageBack>
        </>
      )}
    </DetailPage>
  );
}

export function TemplateForm({ buildFile = {}, builders, submit }) {
  return (
    <form
      key={buildFile.name}
      onSubmit={e => {
        e.preventDefault();

        submit(formElementsToObject(e.target.elements));
      }}
    >
      <Grid>
        <Cell span="12">
          <TextField
            required
            name="name"
            label="Template Name"
            defaultValue={buildFile.name}
          />
        </Cell>

        <Cell span="12">
          <Select
            name="builderId"
            label="Builder"
            options={builders.map(b => ({ text: b.name, value: b.id }))}
            defaultValue={buildFile.builderId}
          />
        </Cell>

        <Cell span="12">
          <TextArea
            required
            name="value"
            label="Template"
            rows="10"
            defaultValue={buildFile.value}
          />
        </Cell>

        <Cell>
          <Button type="submit" icon="update" unelevated>
            update
          </Button>
        </Cell>
      </Grid>
    </form>
  );
}

export async function getServerSideProps() {
  const [buildFiles] = await backend.buildFiles.get();
  const [builders] = await backend.builders.get();

  return {
    props: {
      buildFiles,
      builders
    }
  };
}

export default function TemplatesPage({ builders, ...props }) {
  const [buildFiles, updateBuildFiles] = useState(props.buildFiles);
  const [currentBuildFile, setCurrentBuildFile] = useState(0);
  const buildFile = buildFiles[currentBuildFile];

  const addBuildFile = async data => {
    const [newFile, buildFileOk] = await api.buildFiles.add(data);
    if (buildFileOk) {
      updateBuildFiles(b => [...b, newFile]);
    }
  };

  const deleteBuildFile = id => () => {
    const action = async () => {
      const result = await api.buildFiles.delete(id);

      if (result.ok) {
        setCurrentBuildFile(0);
        updateBuildFiles(b => b.filter(el => el.id !== id));
      }
    };

    showDialog({
      content:
        "Are you sure you want to delete the template? This action can not be undone.",
      actionLabel: "delete",
      action
    });
  };

  const updateBuildFile = id => toggle => async data => {
    await api.builders.update(id, data);

    updateBuildFiles(b => {
      const result = [...b];

      result.forEach(el => {
        if (el.id === id) {
          el.name = data.name;
          el.value = data.value;
          el.builderId = data.builderId;
        }
      });

      return result;
    });

    toggle();
  };

  return (
    <Layout title="Templates" path="/templates">
      <Cell className="hide-on-tablet hide-on-desktop">
        <nav>
          <List>
            {buildFiles.map(b => (
              <LinkItem
                className="cnde-nav-item"
                key={b.id}
                href={`/templates/${b.id}`}
              >
                {b.name}
              </LinkItem>
            ))}
          </List>
        </nav>
      </Cell>

      <Cell tablet="2" desktop="3" className="hide-on-phone">
        <List>
          {buildFiles.map((b, index) => (
            <Item
              className="cnde-nav-item"
              key={b.id}
              onClick={() => setCurrentBuildFile(index)}
              activated={index === currentBuildFile}
            >
              {b.name}
            </Item>
          ))}
        </List>
      </Cell>

      <Cell className="hide-on-phone" tablet="5" desktop="7">
        {buildFile && (
          <TemplatePageContent
            buildFile={buildFile}
            builders={builders}
            deleteBuildFile={deleteBuildFile(buildFile.id)}
            updateBuildFile={updateBuildFile(buildFile.id)}
          />
        )}
      </Cell>

      <BottomSection>
        {hide => (
          <form
            onSubmit={e => {
              e.preventDefault();

              addBuildFile(formElementsToObject(e.target.elements))
                .then(hide)
                .then(e.target.reset());
            }}
          >
            <Grid>
              <Cell span="6">
                <TextField name="name" label="Template Name" />
              </Cell>

              <Cell span="6">
                <Select
                  name="builderId"
                  label="Builder"
                  options={builders.map(b => ({ text: b.name, value: b.id }))}
                />
              </Cell>

              <Cell span="12">
                <TextArea name="value" label="Template" rows="10" />
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
