export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  const properties = (orderBy as string).split(".");
  properties.forEach((key: string) => {
    a = (a as Record<string, any>)?.[key];
    b = (b as Record<string, any>)?.[key];
  });

  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
};

type Order = "asc" | "desc";
export const getComparator = <T = any>(
  order: Order,
  orderBy: keyof T,
): ((a: T, b: T) => number) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = <T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export const selectHandler = (selected: string[], name: string) => {
  const selectedIndex = selected.indexOf(name);
  let newSelected: string[] = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, name);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1),
    );
  }
  return newSelected;
};

export const isSelected = (name: string, selected: string[]) => {
  return selected.indexOf(name) !== -1;
};
