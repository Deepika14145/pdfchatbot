
import React from 'react';
import { MenuIcon, KNavLogoIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  onMenuClick: () => void;
  theme: string;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, theme, onThemeToggle }) => {
  return (
    <header className="flex items-center justify-between p-2 md:p-4 text-gray-800 dark:text-white bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-700/50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">KNAV PDF ChatBot</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
        <div className="w-10 h-10">
          <KNavLogoIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;