import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-puzzle-game',
	templateUrl: './puzzle-game.component.html',
	standalone: true,
	styleUrls: ['./puzzle-game.component.scss'],
	imports: [CommonModule, NgxLoadingModule, MatBottomSheetModule],
})
export class PuzzleGameComponent implements OnInit {
	
	@ViewChildren('cellCanvas') canvases!: QueryList<ElementRef<HTMLCanvasElement>>;

    cells : any[]= [];
    emptyCell: any;
    cellAfterMove: any;
    cellBeforeMove: any;
    historypos: any[]= [];
    undos: any[]= [];
    redos : any[]= [];
    undoing = false;
    redoing = false;
    listCanvas: any[] = [];
    isStart= true;
  
    boardStyle = {
      padding: '10px',
      display: 'flex',
      flexWrap: 'wrap',
      background: 'rgba(215, 210, 239, 1)',
      width: '300px',
      height: '300px',
      justifyContent: 'space-between',
      alignContent: 'space-between',
      margin: '0 auto',
      borderRadius: '16px',
    };
  
    cellStyle = {
      background: 'rgba(191, 181, 229, 1)',
      height: '90px',
      width: '90px',
      margin: '0px',
      cursor: 'pointer',
      flex: '0 0 90px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'orange',
      padding: '1px',
    };
  
    dove = new Image();
  
    constructor(
        private bottomSheetRef: MatBottomSheetRef<PuzzleGameComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {  
        this.dove.src = data.image;
        this.dove.onload = () => {
            this.createCells();
            this.drawImages();
						setTimeout(() => {
							this.shuffle();
						}, 0);
        };
    }
  
    ngAfterViewInit(): void {
      this.drawImages();
    }
  
    drawImages() {
      if (this.canvases) {
        setTimeout(() => {
            this.canvases.forEach((canvas, index) => {
                this.listCanvas.push(canvas);
                const ctx = canvas.nativeElement.getContext('2d');
                const x = index % 3;
                const y = Math.floor(index / 3);
    
                ctx?.drawImage(this.dove, x * 90, y * 90, 90, 90, 0, 0, 100, 100);
              });
          }, 0);
      }
    }
  
    createCells() {
      this.cells = Array.from({ length: 9 }, (_, i) => {
        return {
          dataPos: i,
          dataCurPos: i,
          dataDx: 0,
          dataDy: 0,
        };
      });
      this.cellAfterMove = this.cells;
      this.emptyCell = this.cells[8];
      this.emptyCell.opacity = '0.25';
      this.emptyCell.zIndex = 0;
    }
  
    isEmptyCell(cell: any) {
      return cell === this.emptyCell.dataPos;
    }
  
    moveCell(cell: any, shuffle?:boolean) {
      const direction = this.findDirectionToMove(cell);
      if (!direction) return;
      const amount = 95;
      const duration = 100;
      const coef = {
        left: -1,
        right: 1,
        down: 1,
        up: -1,
      };
      const oppositeDirection = this.findOpositeDirection(direction) as string;
      const cssTranslate = (cell: any, direction: string) => {
        if (direction == 'left' || direction == 'right') {
          cell.dataDx += amount * coef[direction];
        }
        if (direction == 'up' || direction == 'down') {
          cell.dataDy += amount * coef[direction];
        }
        return `translate(${cell.dataDx}px, ${cell.dataDy}px )`;
      };
      
      const cellElement = this.listCanvas[cell.dataPos].nativeElement
        .parentElement;
      const emptyElement = this.listCanvas[
        this.emptyCell.dataPos
      ].nativeElement.parentElement;
      cellElement?.animate(
        { transform: cssTranslate(cell, direction) },
        { duration: duration, fill: 'forwards' }
      );
  
      emptyElement?.animate(
        { transform: cssTranslate(this.emptyCell, oppositeDirection) },
        { duration: duration, fill: 'forwards' }
      );
      let temp = this.emptyCell.dataCurPos;
      this.emptyCell.dataCurPos = cell.dataCurPos;
      cell.dataCurPos = temp;
  
      this.historypos.push(Number(cell.dataCurPos));
  
      if (this.undoing == false) this.undos = [...this.historypos];
      this.undoing = false;
  
      if (this.redoing == false) this.redos = [...this.undos];
      this.redoing = false;
      if(!shuffle){
        const winner = this.cellAfterMove.filter((cell:any) => cell.dataCurPos === cell.dataPos);
        if( winner.length === 9 ){
            Swal.fire({
                title: "You got a reward!",
                text: `+ 250`,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    this.close();
                }
            });
        }
      }
    }
  
    findDirectionToMove(cell : any) {
      const getCol = (pos: any) => pos % 3;
      const getRow = (pos: any) => Math.floor(pos / 3);
  
      const cellpos = Number(cell.dataCurPos);
      const emptyCellpos = Number(this.emptyCell.dataCurPos);
  
      const rowcolEmpty = [getRow(emptyCellpos), getCol(emptyCellpos)];
      const rowcolCell = [getRow(cellpos), getCol(cellpos)];
  
      const sameColOrRow =
        rowcolEmpty[0] == rowcolCell[0] || rowcolEmpty[1] == rowcolCell[1];
  
      if (!sameColOrRow) return;
  
      const directions = {
        [cellpos - 1]: 'left',
        [cellpos + 1]: 'right',
        [cellpos - 3]: 'up',
        [cellpos + 3]: 'down',
      };
      let posdir = Number(Object.keys(directions).find((pos:any) => pos == emptyCellpos));
      return directions[posdir];
    }
  
    findOpositeDirection(direction: any): string |void {
      if (direction == 'up') {
        return 'down';
      }
      if (direction == 'down') {
        return 'up';
      }
      if (direction == 'left') {
        return 'right';
      }
      if ((direction = 'right')) {
        return 'left';
      }
    }
  
    async shuffle() {
      this.isStart = false;
      for (let i = 0; i < 100; i++) {
        const emptyPos = Number(this.emptyCell.dataCurPos);
        const validPos = [
          emptyPos - 1,
          emptyPos + 1,
          emptyPos - 3,
          emptyPos + 3,
        ].filter((pos) => {
          return pos >= 0 && pos <= 8;
        });
        const randomPos =validPos[Math.floor(Math.random() * validPos.length)];
        await this.sleep(10);
        this.moveCellByCurpos(randomPos);
      }
    }
  
    moveCellByCurpos(cellpos: any) {
      let cell = this.cells.find((cell) => cell.dataCurPos == cellpos);
      this.moveCell(cell, true);
    }
  
    sleep(ms: any) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  
    reset() {
      this.createCells();
      this.drawImages();
    }
  
    undo() {
      if (this.undos.length > 0) {
        this.undoing = true;
        let lastpos = this.undos.splice(-1)[0];
        this.moveCellByCurpos(lastpos);
      }
    }
  
    redo() {
      if (this.redos.length > 0) {
        this.redoing = true;
        let lastpos = this.redos.splice(-1)[0];
        this.moveCellByCurpos(lastpos);
      }
    }

	ngOnInit(): void {
	}

	close(): void {
        this.bottomSheetRef.dismiss(); 
    } 
}
