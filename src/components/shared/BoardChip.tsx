import React from 'react';

type Props = { boardName: string; onClick?: () => void };

export default function BoardChip({ boardName, onClick }: Props) {
  const handleClick = (e: React.MouseEvent) => { e.stopPropagation(); onClick?.(); };
  const Element = onClick ? 'button' : 'span';
  return (
    <Element
      className="board-chip"
      onClick={onClick ? handleClick : undefined}
      style={onClick ? undefined : { cursor: "default" }}
    >
      b/{boardName}
    </Element>
  );
}
