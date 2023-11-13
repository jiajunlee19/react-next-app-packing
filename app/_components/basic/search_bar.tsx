'use client'

import React, { useState } from 'react';

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
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5 stroke-zinc-900 dark:stroke-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"/>
          </svg>
        </button>
      </div>
    );
};