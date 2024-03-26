import CustomInput from "../CustomInput";
import { IoIosSearch } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import styles from "./styles.module.css";

const Search = ({ search, onChangeSearch, text = "Search" }) => {
  return (
    <div className={styles.box}>
      <CustomInput
        type="text"
        placeholder={text}
        value={search}
        onChange={(e) => onChangeSearch(e.target.value)}
        icon={<IoIosSearch size={25} />}
        endIcon={<RxCross1 size={25} />}
        onEndIconClick={() => onChangeSearch("")}
      />
    </div>
  );
};
export default Search;
