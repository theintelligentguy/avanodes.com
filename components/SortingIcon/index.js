import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export const SortingIcon = ({ sorting, field }) => {
  return sorting.includes(field)
    ? (
      sorting.includes(`-${field}`)
        ? <FaSortDown />
        : <FaSortUp />
    ) : (
      <FaSort />
    )
}

export default SortingIcon
