import React from 'react';
import { boardColorFromName } from '../../utils/hash';

type Props = { boardName: string; onClick?: () => void };

export default function BoardChip({ boardName, onClick }: Props) {
  const handleClick = (e: React.MouseEvent) => { e.stopPropagation(); onClick?.(); };
  const Element = onClick ? 'button' : 'span';
  const bc = boardColorFromName(boardName);
  return (
    <Element
      className="board-chip"
      onClick={onClick ? handleClick : undefined}
      style={{
        cursor: onClick ? "pointer" : "default",
        color: bc,
        borderColor: `color-mix(in srgb, ${bc} 28%, transparent)`,
        background: `color-mix(in srgb, ${bc} 12%, transparent)`,
      }}
    >
      b/{boardName}
    </Element>
  );
}
