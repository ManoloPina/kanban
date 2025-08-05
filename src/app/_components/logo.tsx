'use client';

import { memo, useMemo } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

function Logo() {
  const { theme } = useTheme();
  const logoSrc = useMemo(
    () => (theme === 'light' ? '/logo-dark.svg' : '/logo-light.svg'),
    [theme],
  );
  return <Image src={logoSrc} alt="Logo" width={200} height={200} />;
}

export default memo(Logo);
