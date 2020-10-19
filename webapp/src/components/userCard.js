import {
  Card,
  CardPrimaryAction,
  CardActions,
  ActionIcons,
  ActionIcon,
  ActionLink
} from "../material/card";

import styles from "./userCard.module.scss";

export function UserCard({ user, metrics, deleteCallback }) {
  return (
    <Card>
      <CardPrimaryAction href={`/devenvusers/${user.id}`}>
        <h3 className={`${styles.title} mdc-typography--headline6`}>
          {user.name}
        </h3>

        <h4 className={`${styles.subtitle} mdc-typography--subtitle1`}>
          {user.email}
        </h4>

        {metrics}
      </CardPrimaryAction>

      <CardActions>
        <ActionIcons>
          <ActionLink
            href={`https://${user.name}.kubeplatform.ch.innoq.io/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            link
          </ActionLink>
          <ActionIcon onClick={deleteCallback}>delete</ActionIcon>
        </ActionIcons>
      </CardActions>
    </Card>
  );
}
