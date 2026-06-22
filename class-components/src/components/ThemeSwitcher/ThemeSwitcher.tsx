'use client';

import './ThemeSwitcher.css';

import { LucideMoonStar, LucideSun } from 'lucide-react';

import { useState } from 'react';
import { useTheme } from '../../hooks/use-theme';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const handleClick = () => {
    if (isCoolingDown) return;

    setIsCoolingDown(true);
    toggleTheme();

    setTimeout(() => {
      setIsCoolingDown(false);
    }, 200);
  };

  return (
    <button onClick={handleClick} className="theme-button">
      {theme === 'light' ? <LucideSun /> : <LucideMoonStar />}
    </button>
  );
}
