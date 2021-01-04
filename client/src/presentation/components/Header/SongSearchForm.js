import { Input } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSearchFlag, setSongInfo } from "../../../features/search/searchSlice";

const { Search } = Input;

const SearchForm = () => {
    const dispatch = useDispatch();
    const searchType = useSelector(state => state.search.searchType);
    const placeholder = searchType == "title" ? "曲名" : "作曲者"
    const handleSearch = (searchQuery) => {
        dispatch(setSearchFlag(true));
        getSongList(searchQuery);
    }

    const getSongList = (searchQuery) => {
        const url = `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/search`;
        axios.get(url, { params: { s_query: searchQuery, q_type: searchType } }).then(
            res => {
                const data = res.data.queryResults;
                dispatch(setSongInfo([data.key, data.title, data.composer, data.path]));
            }
        ).catch(
            (e) => {
                console.log("connection error");
            }
        )
    }

    return (
        <div>
            <Search
                placeholder={`${placeholder}を入力して下さい`}
                style={{ width: 500, margin: '16px' }}
                onSearch={handleSearch}
            />
        </div>
    )
}

export default SearchForm