import CustomInput from "../CustomInput";
import { IoIosSearch } from "react-icons/io";
const Search = ({ search, onChangeSearch,text="Search" }) => { 
    return (
      <div className="search">
        <CustomInput
          type="text"
          placeholder={text}
          value={search}
                onChange={(e) => onChangeSearch(e.target.value)}
                icon={<IoIosSearch size={25}/>}
        />
      </div>
    );
}
export default Search;