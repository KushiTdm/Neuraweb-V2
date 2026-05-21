'use client';
import React, { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CellStyle = React.CSSProperties & {
  '--delay'?: string;
  '--duration'?: string;
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

const DivGrid = ({
  className,
  rows = 7,
  cols = 24,
  cellSize = 56,
  borderColor,
  fillColor,
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: 'auto',
  };

  return (
    <div className={cn('relative z-[3]', className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;

        const style: CellStyle = clickedCell
          ? { '--delay': `${delay}ms`, '--duration': `${duration}ms` }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              'cell relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform hover:opacity-80',
              clickedCell && 'animate-cell-ripple',
              !interactive && 'pointer-events-none',
            )}
            style={{ backgroundColor: fillColor, borderColor, ...style }}
            onClick={interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined}
          />
        );
      })}
    </div>
  );
};

export const BackgroundRippleEffect = ({
  rows = 10,
  cols = 24,
  cellSize = 54,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
}) => {
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none">
      <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />
      <DivGrid
        key={`base-${rippleKey}`}
        className="[mask-image:radial-gradient(ellipse_90%_70%_at_50%_50%,black_30%,transparent_100%)]"
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        borderColor="rgba(93,184,240,0.18)"
        fillColor="rgba(93,184,240,0.025)"
        clickedCell={clickedCell}
        onCellClick={(row, col) => {
          setClickedCell({ row, col });
          setRippleKey((k) => k + 1);
        }}
        interactive={false}
      />
    </div>
  );
};
