'use client';
import { memo } from 'react';
import { useTheme } from 'next-themes';

import { Sun, MoonStar } from 'lucide-react';
import { Switch } from './ui/switch';

function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex flex-row gap-2">
      <MoonStar size={18} />
      <Switch
        checked={theme === 'light'}
        onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
      />
      <Sun size={18} />
    </div>
  );
}

export default memo(ThemeSwitcher);
