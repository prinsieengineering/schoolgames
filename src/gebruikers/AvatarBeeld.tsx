import { useMemo } from 'react';
import type { Avatar } from '../core/types';
import { avatarUrl } from './avatar';

export function AvatarBeeld({ avatar, grootte = 80, className = '' }: { avatar: Avatar; grootte?: number; className?: string }) {
  const src = useMemo(() => avatarUrl(avatar), [avatar]);
  return <img className={`avatar ${className}`} src={src} width={grootte} height={grootte * 1.16} alt="" draggable={false} />;
}
