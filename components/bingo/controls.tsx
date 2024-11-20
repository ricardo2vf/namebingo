"use client";

import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BingoControlsProps {
  editing: boolean;
  gridSize: number;
  onEditToggle: () => void;
  onGridSizeChange: (size: number) => void;
  onAddItemsClick: () => void;
}

export function BingoControls({
  editing,
  gridSize,
  onEditToggle,
  onGridSizeChange,
  onAddItemsClick,
}: BingoControlsProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        Bingo Card Generator
      </h1>
      
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Button
          variant={editing ? "default" : "outline"}
          onClick={onEditToggle}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          {editing ? "編集完了" : "編集"}
        </Button>
        
        {editing && (
          <>
            <Button
              className="gap-2"
              variant={editing ? "default" : "outline"}
              onClick={onAddItemsClick}>
              名前追加
            </Button>
            {/* サイズ
            <Input
              type="number"
              value={gridSize}
              onChange={(e) => onGridSizeChange(Math.min(8, Math.max(3, parseInt(e.target.value) || 3)))}
              className="w-20"
              min="3"
              max="8"
            /> */}
            
          
          </>
        )}
      </div>
    </div>
  );
}