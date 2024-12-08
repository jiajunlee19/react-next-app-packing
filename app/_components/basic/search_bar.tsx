'use client'

import React, { useState } from 'react';
import { SearchIcon } from '@/app/_components/basic/icons';

export default function SearchBar() {

    const [searchText, setSearchText] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    };

    const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log("Searching logic implies here...")
    };

    return (
      <div className="flex justify-center items-center gap-1">
        <input className="mb-0 h-6 p-2" type="text" placeholder="Find something..." value={searchText} onChange={handleSearchChange} />
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/50 ui-not-focus-visible:outline-none dark:hover:bg-white/50" aria-label="Find something..." onClick={handleSearchClick}>
          <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
        </button>
      </div>
    );
};