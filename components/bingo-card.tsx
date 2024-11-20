"use client";

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { toast } from 'sonner';
import { Cell } from './bingo/types';
import { BingoControls } from './bingo/controls';
import { BingoGrid } from './bingo/grid';
import { SideMenu } from "./bingo/side-menu";

const MIDDLE_CELL_OPTIONS = [
  { text: "CS", icon: "/imgs/logo_itaccess.svg" },
  { text: "Smart Skin Care", icon: "/imgs/logo_itaccess.svg"  },
  { text: "ADV", icon: "/imgs/logo_itaccess.svg"  },
  { text: "FT", icon: "/imgs/logo_itaccess.svg"  },
];

type LineType = 'row' | 'column' | 'diagonal';
interface AlmostLine {
  type: LineType;
  index: number;
}
interface BingoLine {
  type: LineType;
  index: number;
}

export default function BingoCard() {
  const [gridSize, setGridSize] = useState(5);
  const [cells, setCells] = useState<Cell[]>([]);
  const [editing, setEditing] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [almostLines, setAlmostLines] = useState<AlmostLine[]>([]);
  const [bingoLines, setBingoLines] = useState<BingoLine[]>([]);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [sideMenuInput, setSideMenuInput] = useState("");
  const [shouldValidateAfterSetCells, setShouldValidateAfterSetCells] = useState(false);
  const [isCellChanged, setIsCellChanged] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, [gridSize]);

  const initializeGrid = () => {
    const totalCells = gridSize * gridSize;
    const newCells = Array(totalCells).fill(null).map((_, index) => ({
      id: `cell-${index}`,
      content: '',
      marked: false,
    }));
    setCells(newCells);
    setAlmostLines([]);
  };

  const handleCellClick = (cell: Cell) => {
    if (editing) {
      setEditingCell(cell.id);
      return;
    }

    const newCells = cells.map(c => 
      c.id === cell.id ? { ...c, marked: !c.marked } : c
    );
    setCells(newCells);
    checkForBingo(newCells);
  };

  const checkForBingo = (currentCells: Cell[]) => {
    const newCompletedLines: BingoLine[] = [];

     // Check rows
     for (let i = 0; i < gridSize; i++) {
      const row = currentCells.slice(i * gridSize, (i + 1) * gridSize);
      if (row.every((cell) => cell.marked)) {
        newCompletedLines.push({ type: "row", index: i });
      }
    }

    // Check columns
    for (let i = 0; i < gridSize; i++) {
      const column = Array(gridSize)
        .fill(null)
        .map((_, j) => currentCells[i + j * gridSize]);
      if (column.every((cell) => cell.marked)) {
        newCompletedLines.push({ type: "column", index: i });
      }
    }

    // Check diagonals
    const diagonal1 = Array(gridSize)
     .fill(null)
     .map((_, i) => currentCells[i * (gridSize + 1)]);
    const diagonal2 = Array(gridSize)
     .fill(null)
     .map((_, i) => currentCells[(i + 1) * (gridSize - 1)]);

    if (diagonal1.every((cell) => cell.marked)) {
      newCompletedLines.push({ type: "diagonal", index: 0 });
    }
    if (diagonal2.every((cell) => cell.marked)) {
      newCompletedLines.push({ type: "diagonal", index: 1 });
    }

    // Find new almost complete lines
    const newLines = newCompletedLines.filter(newLine => 
      !bingoLines.some(oldLine => 
        oldLine.type === newLine.type && oldLine.index === newLine.index
      )
    );

    if (newLines.length > 0) {
      celebrate();
      setAlmostLines([]); // Reset almost lines when bingo is achieved
    } else {
      checkAlmostThere(currentCells);
    }
    setBingoLines(newCompletedLines);
  };

  const checkAlmostThere = (currentCells: Cell[]) => {
    const newAlmostLines: AlmostLine[] = [];

    // Check rows
    for (let i = 0; i < gridSize; i++) {
      const row = currentCells.slice(i * gridSize, (i + 1) * gridSize);
      const markedCount = row.filter(cell => cell.marked).length;
      if (markedCount === gridSize - 1) {
        newAlmostLines.push({ type: 'row', index: i });
      }
    }

    // Check columns
    for (let i = 0; i < gridSize; i++) {
      const column = Array(gridSize).fill(null)
        .map((_, j) => currentCells[i + j * gridSize]);
      const markedCount = column.filter(cell => cell.marked).length;
      if (markedCount === gridSize - 1) {
        newAlmostLines.push({ type: 'column', index: i });
      }
    }

    // Check diagonals
    const diagonal1 = Array(gridSize).fill(null)
      .map((_, i) => currentCells[i * (gridSize + 1)]);
    const diagonal2 = Array(gridSize).fill(null)
      .map((_, i) => currentCells[(i + 1) * (gridSize - 1)]);

    if (diagonal1.filter(cell => cell.marked).length === gridSize - 1) {
      newAlmostLines.push({ type: 'diagonal', index: 0 });
    }
    if (diagonal2.filter(cell => cell.marked).length === gridSize - 1) {
      newAlmostLines.push({ type: 'diagonal', index: 1 });
    }

    // Find new almost complete lines
    const newLines = newAlmostLines.filter(newLine => 
      !almostLines.some(oldLine => 
        oldLine.type === newLine.type && oldLine.index === newLine.index
      )
    );

    if (newLines.length > 0) {
      setAlmostLines(newAlmostLines);
      
      // Create descriptive message for new almost complete lines
      const descriptions = newLines.map(line => {
        switch (line.type) {
          case 'row':
            return `Row ${line.index + 1}`;
          case 'column':
            return `Column ${line.index + 1}`;
          case 'diagonal':
            return `${line.index === 0 ? 'Main' : 'Secondary'} diagonal`;
        }
      });

      toast("Almost there!", {
        icon: "🎯",
        description: `Just one more mark to complete: ${descriptions.join(', ')}!`
      });
    } else {
      setAlmostLines(newAlmostLines);
    }
  };

  const celebrate = () => {
    setShowConfetti(true);
    toast("BINGO!", {
      icon: "🎉",
      description: "Congratulations! You've completed a line!"
    });
    setTimeout(() => setShowConfetti(false), 12000);
    const audio = new Audio('/sound/bingo.mp3');
    audio.play().catch((err) => console.error('音频播放失败:', err));
  };

  const updateCellsWithUserInput = (input: string) => {
    const inputRows = input
      .trim()
      .split("\n")
      .filter((line) => line.trim()); // 空行を除外
    const totalCells = gridSize * gridSize;
    const middleIndex = Math.floor(totalCells / 2);
  
    if (inputRows.length < totalCells - 1) {
      toast("Insufficient items!", {
        icon: "👁️‍🗨️",
        description: `Please provide at least ${totalCells - 1} items.`,
      });
      return false; // 処理を中断
    }
  
    const randomMiddle = MIDDLE_CELL_OPTIONS[
      Math.floor(Math.random() * MIDDLE_CELL_OPTIONS.length)
    ];

    const isTwentyFour = (inputRows.length === 24) ? true : false;
    
    const newCells = cells.map((cell, i) => {
      if (i === middleIndex) {
        return {
          ...cell,
          content: randomMiddle.text,
          icon: randomMiddle.icon,
        };
      }
      if(isTwentyFour){
        return {
          ...cell,
          content: inputRows[i < middleIndex ? i : i - 1] || cell.content,
        };
      }else{
        return {
          ...cell,
          content: inputRows[ i ] || cell.content,
        };     
      }     
    });
    setCells(newCells);
    return true; // 成功
  };

  const validateAndShuffleCells = () => {
    const emptyCells = cells.filter((cell) => !cell.content.trim());
    if (emptyCells.length > 0) {
      toast("Incomplete!", {
        icon: "👁️‍🗨️",
        description: "Please fill in all cells before completing.",
      });
      return;
    }

    // const shuffled = cells.sort(() => Math.random() - 0.5);
    // setCells([...shuffled]);
    const shuffled = [...cells];
    const middleIndex = Math.floor((gridSize * gridSize) / 2);
    
    // Assign middle cell
    // const randomMiddle = MIDDLE_CELL_OPTIONS[Math.floor(Math.random() * MIDDLE_CELL_OPTIONS.length)];
    // shuffled[middleIndex] = {
    //   ...shuffled[middleIndex],
    //   content: randomMiddle.text,
    //   icon: randomMiddle.icon,
    // };

    // Shuffle the rest except the middle cell
    const otherCells = shuffled.filter((_, i) => i !== middleIndex).sort(() => Math.random() - 0.5);
    otherCells.splice(middleIndex, 0, shuffled[middleIndex]); // Reinsert middle cell

    setCells(otherCells);
    setEditing(false);
  };

  const handleSideMenuOpen = () => {
    const cleanedCells = cells.filter((cell) => cell.content.trim());
    const cellContents = cleanedCells.map((cell) => cell.content).join("\n");
    setSideMenuInput(cellContents);
    setSideMenuOpen(true);
  };

  const handleSideMenuInputComplete = () => {
    const success = updateCellsWithUserInput(sideMenuInput);
    if (success) {
      setShouldValidateAfterSetCells(true); // バリデーション処理
      setSideMenuOpen(false); // SideMenuを閉じる
    }
  };

  useEffect(() => {
    if(shouldValidateAfterSetCells){
      validateAndShuffleCells();
      setShouldValidateAfterSetCells(false)
    }
  },[shouldValidateAfterSetCells])

  useEffect(() => {
    if(isCellChanged){
      validateAndShuffleCells();
      setIsCellChanged(false)
    }
  },[isCellChanged])

  return (
    <>
    <div className="space-y-8">
      {showConfetti && <Confetti />}
      
      <BingoControls
        editing={editing}
        gridSize={gridSize}
        onEditToggle={() => {
          if (editing) {
            const success = updateCellsWithUserInput(
              cells.map((cell) => cell.content).join("\n")
            );
            if (success) {
              for(const cell of cells){
                if(!cell.content){
                  console.log("there is a empty warning!!");
                }
              }
              setIsCellChanged(true)
            }
          } else {
            setEditing(true); // 編集モードを開始
          }
        }}
        onGridSizeChange={setGridSize}
        onAddItemsClick={handleSideMenuOpen}
        // onAddItemsClick={() => setSideMenuOpen(!isSideMenuOpen)}
      />
      <p>※カードをタップして名前を入力してください(合計24名の方々の名前を入力する必要があり)</p>
      <BingoGrid
        cells={cells}
        gridSize={gridSize}
        editing={editing}
        animations={true}
        editingCell={editingCell}
        onCellClick={handleCellClick}
        onCellEdit={(id, content) => {
          setCells(cells.map(cell => 
            cell.id === id ? { ...cell, content } : cell
          ));
        }}
        onEditComplete={() => setEditingCell(null)}
        onCellsReorder={setCells}
      />

      {isSideMenuOpen && (
        <SideMenu
          input={sideMenuInput}
          onInputChange={(value) => setSideMenuInput(value)}
          onClose={() => setSideMenuOpen(false)}
          onComplete={handleSideMenuInputComplete}
        />
      )}

    </div>
    <div
    style={{
      height:"200px",
      backgroundImage: `url(/imgs/img_puzlles.png)`,
      backgroundSize: "contain", // 画像サイズ調整
      backgroundRepeat: "no-repeat", // 繰り返し防止
      backgroundPosition: "center", // セルの中央に配置
    }}
    >
    </div>
    </>
  );
}