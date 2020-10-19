import Layout from "../components/layout";
import { Cell } from "../material/grid";
import { Headline5, Body1 } from "../material/typography";

export default function HomePage() {
  return (
    <Layout title="Home" path="/">
      <Cell tablet="7" desktop="10">
        <Headline5 Tag="h5">Objects that are used by CNC:</Headline5>

        <img className="cnc-logo" src="/CNC_Objects.svg" alt="CNC logo" />

        <Body1>
          <b>Running IDE:</b> IDE deployed as a Pod that feels like a VM
        </Body1>
        <Body1>
          <b>Builder:</b> A Pod specification that is deployed in a Cluster to
          transform a Template into a Container Image
        </Body1>
        <Body1>
          <b>Template:</b> Simple text that represents e.g. a Dockerfile or a
          reference to a Git repository, depending on the used Builder Object
        </Body1>
        <Body1>
          <b>Dev Env User:</b> A user that acts as a developer in an on-premises
          cluster
        </Body1>
      </Cell>
    </Layout>
  );
}
