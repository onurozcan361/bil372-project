import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchBarProps {
  placeholder: string;
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <TextField
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </IconButton>
        ),
      }}
    />
  );
};

export default SearchBar;
