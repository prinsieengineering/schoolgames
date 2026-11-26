import { useMemo } from 'react';
import type { Avatar } from '../core/types';
import { avatarUrl } from './avatar';

export function AvatarBeeld({
  avatar,
  grootte = 80,
  className = '',
  achtergrond = true,
}: {
  avatar: Avatar;
  grootte?: number;
  className?: string;
  achtergrond?: boolean;
}) {
  const sleutel = JSON.stringify(avatar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const src = useMemo(() => avatarUrl(avatar, achtergrond), [sleutel, achtergrond]);
  return <img className={`avatar ${className}`} src={src} width={grootte} height={grootte} alt="" draggable={false} />;
}
