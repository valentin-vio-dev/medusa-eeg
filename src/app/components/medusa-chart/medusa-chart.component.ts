import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-medusa-chart',
  templateUrl: './medusa-chart.component.html',
  styleUrls: ['./medusa-chart.component.scss'],
})
export class MedusaChartComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @Input() width: number;
  @Input() height: number;
  @Input() isLive: any;
  @Input() maxLength: number;
  ctx: CanvasRenderingContext2D;
  chartCursorIndex: number = 0;
  points: number[] = [];
  cells: any = {rx: 0, ry: 0};
  resolution: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = window.innerWidth - 32;
    this.canvas.nativeElement.height = this.height;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.cells = {
      rx: this.canvas.nativeElement.width / (this.maxLength - 1),
      ry: 0
    }
  }

  addPoint(point: number) {
    this.points.push(point);
    this.draw();
  }

  draw() {
    if (this.points.length <= 1) return;
    this.clearRegion();

    let p1 = this.points[this.chartCursorIndex] * this.resolution;
    let p2 = this.points[this.chartCursorIndex + 1] * this.resolution;

    this.ctx.beginPath();
    this.ctx.moveTo(this.chartCursorIndex * this.cells.rx, this.point(p1));

    this.chartCursorIndex += 1;
    
    this.ctx.lineTo(this.chartCursorIndex * this.cells.rx, this.point(p2));
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "#000000";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.chartCursorIndex * this.cells.rx+1, 0);
    this.ctx.lineTo(this.chartCursorIndex * this.cells.rx+1, this.canvas.nativeElement.height);
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.stroke();

    if (this.chartCursorIndex == this.maxLength - 1) {
      this.chartCursorIndex = 0;
      this.points = [];
    }

  }

  clearRegion() {
    this.ctx.clearRect(this.chartCursorIndex * this.cells.rx, 0, this.cells.rx, this.canvas.nativeElement.height);
  }

  point(p: number) {
    let avg = 0;
    for (let i=0; i<this.points.length; i++) {
      avg += this.points[i];
    }
    avg /= this.points.length;
    return this.canvas.nativeElement.height - (p - avg)/5 - (this.canvas.nativeElement.height/2);
  }
  

}
