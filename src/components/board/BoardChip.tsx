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
      style={{ '--chip-clr': bc } as React.CSSProperties}
    >
      b/{boardName}
    </Element>
  );
}
