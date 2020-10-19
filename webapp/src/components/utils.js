const colors = [
  "#6a1b9a",
  "#9c4dcc",
  "#38006b",
  "#1565c0",
  "#5e92f3",
  "#003c8f",
  "#2e7d32",
  "#60ad5e",
  "#005005"
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomColor() {
  return colors[randomInt(0, colors.length - 1)];
}

export function abbreviateName(name) {
  const [first, last] = name.split(" ");

  if (first && last) return `${first[0]}${last[0]}`;
  else if (first) return first.substring(0, 2);
}

export function formElementsToObject(elements) {
  const result = {};

  Array.from(elements).forEach(el => {
    if (
      (el.type === "text" ||
        el.type === "textarea" ||
        el.type === "hidden" ||
        el.type === "email") &&
      el.value !== ""
    ) {
      result[el.name] = el.value;
    } else if (el.type === "checkbox") {
      result[el.name] = el.checked;
    }
  });

  return result;
}

export function classname(map, defaultClass) {
  return function(props) {
    const result = [];
    const newProps = { ...props };

    if (defaultClass) result.push(defaultClass);

    if (newProps.className) {
      result.push(newProps.className);
      delete newProps.className;
    }

    if (map) {
      Object.entries(props).forEach(([key, val]) => {
        if (map[key]) {
          if (val) result.push(map[key]);
          delete newProps[key];
        }
      });
    }

    return [result.join(" "), newProps];
  };
}
