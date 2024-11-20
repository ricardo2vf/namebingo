"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Cell } from "./types";

interface SideMenuProps {
  input: string;
  onInputChange: (value: string) => void;
  onClose: () => void;
  onComplete: () => void;
}

export function SideMenu({ input, onInputChange, onClose, onComplete }: SideMenuProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end z-50">
      <div className="w-96 bg-white dark:bg-gray-800 p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">名前追加</h2>
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          rows={10}
          className="resize-none"
          placeholder="Enter items, one per line..."
        />
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
          <Button onClick={onComplete}>完成</Button>
        </div>
      </div>
    </div>
  );
}
