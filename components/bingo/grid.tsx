"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Cell } from './types';
import { BingoCell } from './cell';

interface BingoGridProps {
  cells: Cell[];
  gridSize: number;
  editing: boolean;
  animations: boolean;
  editingCell: string | null;
  onCellClick: (cell: Cell) => void;
  onCellEdit: (id: string, content: string) => void;
  onEditComplete: () => void;
  onCellsReorder: (cells: Cell[]) => void;
}

export function BingoGrid({
  cells,
  gridSize,
  editing,
  animations,
  editingCell,
  onCellClick,
  onCellEdit,
  onEditComplete,
  onCellsReorder,
}: BingoGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = cells.findIndex((cell) => cell.id === active.id);
      const newIndex = cells.findIndex((cell) => cell.id === over.id);
      
      const newCells = [...cells];
      const [removed] = newCells.splice(oldIndex, 1);
      newCells.splice(newIndex, 0, removed);
      
      onCellsReorder(newCells);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        <SortableContext
          items={cells}
          strategy={rectSortingStrategy}
        >
          {cells.map((cell) => (
            <BingoCell
              key={cell.id}
              cell={cell}
              editing={editing}
              animations={animations}
              isEditing={editingCell === cell.id}
              onClick={() => onCellClick(cell)}
              onEdit={(content) => onCellEdit(cell.id, content)}
              onEditComplete={onEditComplete}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}