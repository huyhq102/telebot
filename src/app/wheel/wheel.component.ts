import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { DataService } from './data.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

const COLORS = ['#570F63', '#6C1C95', '#987ACF', '#D7D2EF','#570F63', '#6C1C95', '#987ACF', '#D7D2EF','#570F63', '#6C1C95', '#987ACF', '#D7D2EF',];
const _defaultOpts = [
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH",
	"50 STH"
];
@Component({
	selector: 'app-wheel',
	standalone: true,
	imports: [CommonModule, NgxLoadingModule],
	templateUrl: './wheel.component.html',
	styleUrls: ['./wheel.component.scss']
})
export class WheelComponent implements OnInit {
  @ViewChild('wheel') wheel!: ElementRef<HTMLCanvasElement>;
  @ViewChild('spin') spin!: ElementRef;
  colors = ['#f82', '#0bf', '#fb0', '#0fb', '#b0f', '#f0b', '#bf0'];
  sectors?: any[] = [];

  rand = (m: any, M : any) => Math.random() * (M - m) + m;
  tot:any;
  ctx:any;
  dia:any;
  rad:any;
  PI:any;
  TAU:any;
  arc0:any;

  winners = [];

  modeDelete = true;

  friction = 0.995; // 0.995=soft, 0.99=mid, 0.98=hard
  angVel = 0; // Angular velocity
  ang = 0; // Angle in radians
  lastSelection:any;

  constructor(private dataService: DataService,private bottomSheetRef: MatBottomSheetRef<WheelComponent>) {
		this.sectors = _defaultOpts?.map((opts, i) => {
      return {
        color: COLORS[(i >= COLORS.length ? i + 1 : i) % COLORS.length],
        label: opts,
      };
    });
	}
	
  ngDoCheck(): void {
    this.engine();
  }

  ngOnInit() {
    // Initial rotation
    // Start engine
  }
  ngAfterViewInit(): void {
    this.createWheel();
  }

  createWheel() {
		if(!this.sectors){
			return;
		}
    this.ctx = this.wheel.nativeElement.getContext('2d');
    this.dia = this.ctx.canvas.width;
    this.tot = this.sectors?.length;
    this.rad = this.dia / 2;
    this.PI = Math.PI;
    this.TAU = 2 * this.PI;

    this.arc0 = this.TAU / this.sectors.length;
    this.sectors.forEach((sector, i) => this.drawSector(sector, i));
    this.rotate(true);
    this.restartWinner();
  }

  spinner() {
    // console.log(this.reverseIndex(0));
    console.log('this.ang', this.ang);
    // console.log(this.rand(0.25, 0.35));
    if (!this.angVel) this.angVel = this.rand(0, this.arc0);
  }

  getIndex = () =>
    Math.floor(this.tot - (this.ang / this.TAU) * this.tot) % this.tot;

  reverseIndex(idx:any) {
    return ((this.tot - idx) / this.tot) * this.TAU;
  }

  drawSector(sector:any, i:any) {
    const ang = this.arc0 * i;
    this.ctx.save();
    // COLOR
    this.ctx.beginPath();
    this.ctx.fillStyle = sector.color;
    this.ctx.moveTo(this.rad, this.rad);

    this.ctx.arc(this.rad, this.rad, this.rad, ang, ang + this.arc0);
    this.ctx.lineTo(this.rad, this.rad);
    this.ctx.fill();
    // TEXT
    this.ctx.translate(this.rad, this.rad);
    this.ctx.rotate(ang + this.arc0 / 2);
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText(sector.label, this.rad -30, 8);
    //
    this.ctx.restore();
  }

  rotate(first = false) {
		if(!this.sectors){
			return;
		}
    const sector = this.sectors[this.getIndex()];
    this.ctx.canvas.style.transform = `rotate(${this.ang - this.PI / 2}rad)`;
    if (!first) {
      this.lastSelection = !this.angVel ? this.lastSelection : this.getIndex();
      this.deleteOption();
    }
  }

  frame() {
    if (!this.angVel) return;

    this.angVel *= this.friction; // Decrement velocity by friction
    if (this.angVel < 0.002) this.angVel = 0; // Bring to stop
    this.ang += this.angVel; // Update angle
    this.ang %= this.TAU; // Normalize angle
    this.rotate();
  }

  engine() {
    requestAnimationFrame(this.frame.bind(this));
  }

  deleteOption() {
		if(!this.sectors){
			return;
		}
    if (this.modeDelete && !this.angVel) {
      console.log('eliminar', this.lastSelection);
      this.addNewWinner(this.sectors[this.lastSelection].label);
      // this.spin.nativeElement.textContent =
      //   this.sectors[this.lastSelection].label;
      // this.sectors.splice(this.lastSelection, 1);
      setTimeout(() => {
        this.createWheel();
      }, 1200);
    }
  }

  restartWinner() {
    //this.dataService.restartWinners();
  }

  addNewWinner(value:any) {
    this.dataService.addWinner(value);
  }

	close(): void {
    this.bottomSheetRef.dismiss(); 
  } 
}
