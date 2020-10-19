import { useEffect, useRef } from "react";
import { MDCDrawer } from "@material/drawer";
import { MDCTopAppBar } from "@material/top-app-bar";
import { Dialog } from "../material/dialog";
import {
  List,
  LinkItem,
  ItemPrimaryText,
  ItemSecondaryText
} from "../material/list";
import { Icon } from "../material/icon";
import { Grid, Cell } from "../material/grid";
import { IconButton } from "../material/iconbutton";
import { classname } from "./utils";
import styles from "./layout.module.scss";

import Head from "../components/head";

const paths = [
  {
    href: "/",
    icon: "home",
    label: "Home"
  },
  {
    href: "/clusters",
    icon: "cloud",
    label: "Clusters"
  },
  {
    href: "/devenvusers",
    icon: "person",
    label: "Dev Env Users"
  },
  {
    href: "/builders",
    icon: "build",
    label: "Builders"
  },
  {
    href: "/templates",
    icon: "subject",
    label: "Templates"
  }
];

const desktopAndPhoneNavCn = classname(null, "hide-on-tablet");
function DesktopAndPhoneNav({ path, ...rest }) {
  const [className] = desktopAndPhoneNavCn(rest);
  return (
    <nav className={className}>
      <List twoLine>
        {paths.map(({ href, icon, label }) => {
          const activated = path === href;
          const props = { activated, href };

          if (activated) {
            props.href = "#";
            props["aria-current"] = "page";
          }

          return (
            <LinkItem key={icon} className="cnde-nav-item" {...props}>
              <ItemPrimaryText>
                <Icon>{icon}</Icon>
              </ItemPrimaryText>
              <ItemSecondaryText>{label}</ItemSecondaryText>
            </LinkItem>
          );
        })}
      </List>
    </nav>
  );
}

const tabletNavCn = classname(null, "hide-on-desktop");

function TabletNav({ path, ...rest }) {
  const [className] = tabletNavCn(rest);
  return (
    <nav className={className}>
      <List>
        {paths.map(({ href, icon }) => {
          const activated = path === href;
          const props = { activated, href };

          if (activated) {
            props.href = "#";
            props["aria-current"] = "page";
          }

          return (
            <LinkItem
              key={icon}
              className="cnde-nav-item"
              graphic={<Icon>{icon}</Icon>}
              {...props}
            />
          );
        })}
      </List>
    </nav>
  );
}

export default function Layout({ children, title, path, className }) {
  const drawerRef = useRef(null);
  const appBarRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const drawer = new MDCDrawer(drawerRef.current);
    const topAppBar = new MDCTopAppBar(appBarRef.current);
    topAppBar.setScrollTarget(mainRef.current);

    topAppBar.listen("MDCTopAppBar:nav", () => {
      drawer.open = !drawer.open;
    });

    return () => {
      topAppBar.destroy();
      drawer.destroy();
    };
  }, []);

  return (
    <>
      <Head title={title} />

      <aside
        className={`mdc-drawer mdc-drawer--modal ${styles.drawer}`}
        ref={drawerRef}
      >
        <IconButton onClick={() => {}}>close</IconButton>
        <div className="mdc-drawer__content">
          <DesktopAndPhoneNav path={path} />
        </div>
      </aside>

      <div className={`mdc-drawer-scrim ${styles.scrim}`}></div>

      <header
        className="mdc-top-app-bar mdc-top-app-bar--fixed cnde-app-bar"
        ref={appBarRef}
      >
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <button className="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button hide-on-tablet hide-on-desktop">
              menu
            </button>
            <a href="/">
              <img src="/logo.svg" alt="CNC logo" />
            </a>
            <span className="mdc-top-app-bar__title">Cloud Native Coding</span>
          </section>
        </div>
      </header>

      <main className={`${styles.main} ${className}`} ref={mainRef}>
        <Grid>
          <Cell className="hide-on-phone" tablet="1" desktop="2">
            <TabletNav path={path} className={styles.nav} />
            <DesktopAndPhoneNav path={path} className={styles.nav} />
          </Cell>
          {children}
        </Grid>
      </main>

      <Dialog />
    </>
  );
}
