
import React, { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../App";
import { searchFilterParams } from "./search/AvailableParams";

// Yathi - Added event handler for search bar to make searches.
// Changed wrapper element to div instead of form so the searchbar can take up more space.

const SearchBar = () => {
  const navigate = useNavigate();
  const { currFilters, setFilters } = useContext(SearchContext);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setFilters({
        keywords: (e.target as HTMLTextAreaElement).value,
        category: searchFilterParams.category[0],
        semester: searchFilterParams.semester[0],
        award: searchFilterParams.award[0],
        sortBy: searchFilterParams.sortBy[0],
        currPage: 1,
        projectsPerPage: 6,
      });
      navigate("/projects");//12/04/2023 - 11pm Daniel - Added navigate to /projects when searching from any other page.
    }
  }


  return (
    // <Box component="form" noValidate autoComplete="off">
    <Box width='80%'>
      <TextField
        onKeyDown={handleKeyDown}
        fullWidth
        id="global-searchbar"
        label=""
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      ></TextField>
    </Box>
  );
};

export default SearchBar;
