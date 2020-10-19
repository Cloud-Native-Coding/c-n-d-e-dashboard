import { classname } from "../components/utils";
import styles from "./icon.module.scss";

const cn = classname(styles, "material-icons");

export function Icon(props) {
  const [className, restProps] = cn(props);

  return <i className={className} {...restProps} />;
}
