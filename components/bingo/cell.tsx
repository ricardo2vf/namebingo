"use client";

import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Cell } from './types';

interface BingoCellProps {
  cell: Cell;
  editing: boolean;
  animations: boolean;
  isEditing: boolean;
  onClick: () => void;
  onEdit: (content: string) => void;
  onEditComplete: () => void;
}

export function BingoCell({
  cell,
  editing,
  animations,
  isEditing,
  onClick,
  onEdit,
  onEditComplete,
}: BingoCellProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };
  // 真ん中のセルのカスタム背景デザイン
  const isCenterCell = cell.icon != null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "aspect-square relative",
        "rounded-lg shadow-md overflow-hidden",
        "transition-all duration-300",
        cell.marked && "bg-gradient-to-br from-purple-500 to-pink-500",
        !cell.marked && "bg-white hover:shadow-lg",
        editing && "cursor-move",
        isDragging && "opacity-50"
      )}
      whileHover={animations ? { scale: 1.05 } : {}}
      whileTap={animations ? { scale: 0.95 } : {}}
      onClick={onClick}
      {...attributes}
      {...(editing ? listeners : {})}
    >
      {isEditing ? (
        <input
          type="text"
          value={cell.content}
          onChange={(e) => onEdit(e.target.value)}
          onBlur={onEditComplete}
          onKeyDown={(e) => e.key === 'Enter' && onEditComplete()}
          className="absolute inset-0 w-full h-full text-center"
          autoFocus
        />
      ) : isCenterCell ? ( // 真ん中のセルのデザイン
        <div
          className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${cell.icon})`,
            backgroundSize: "contain", // 画像サイズ調整
            backgroundRepeat: "no-repeat", // 繰り返し防止
            backgroundPosition: "center", // セルの中央に配置
          }}
        >
          <span
            className={cn(
              "text-sm font-bold text-center text-white break-words bg-black bg-opacity-50 rounded  mb-1"
            )}
            style={{
              transform: "translateY(-90%)", // 垂直方向に40px上に移動
            }}
          >
            {cell.content}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <span
            className={cn(
              "text-lg font-medium text-center break-words",
              cell.marked ? "text-white" : "text-gray-700"
            )}
          >
            {cell.content}
          </span>
        </div>
      )}
    </motion.div>
  );
}