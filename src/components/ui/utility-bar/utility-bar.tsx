'use client';

import { Bell, ChevronDown, Search, X } from 'lucide-react';
import { useState } from 'react';

export function UtilityBar() {
  const [searchValue, setSearchValue] = useState('');

  const handleClearSearch = () => {
    setSearchValue('');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Notification Button */}
      <button
        type="button"
        className="relative cursor-pointer rounded-lg border border-border p-2 transition-colors hover:bg-muted"
        title="Notifications"
      >
        <Bell className="h-5 w-5 text-foreground" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
      </button>

      {/* Search Bar */}
      <div className="flex max-w-sm flex-1 items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search anything"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="flex cursor-pointer items-center justify-center transition-colors hover:text-foreground/70"
            title="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Avatar Dropdown */}
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2 transition-colors hover:bg-muted"
        title="Account menu"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-600 text-xs font-semibold text-white">
          J
        </div>
        <ChevronDown className="h-4 w-4 text-foreground" />
      </button>
    </div>
  );
}
