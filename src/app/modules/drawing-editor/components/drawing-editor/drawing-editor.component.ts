import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { takeUntil, mergeMap, delay } from 'rxjs/operators';
import { DrawingColor } from '../../models/DrawingColor';
import { DrawingPoint } from '../../models/DrawingPoint';
import { Coordinate } from '../../models/Coordinate';

@Component({
  selector: 'app-drawing-editor',
  templateUrl: './drawing-editor.component.html',
  styleUrls: ['./drawing-editor.component.scss']
})
export class DrawingEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() image = new EventEmitter<string>();
  @ViewChild('canvas') canvas: ElementRef | null = null;

  dragSubscription: Subscription | null = null;
  moveSubscription: Subscription | null = null;
  downSubscription: Subscription | null = null;
  upSubscription: Subscription | null = null;
  moveoutSubscription: Subscription | null = null;
  resizeSubscription: Subscription | null = null;

  heightRatio = 1;
  currentColor = '#000000';
  context: CanvasRenderingContext2D | undefined;
  currentWidth = 0;
  currentHeight = 0;
  count = 0;

  colors: Array<DrawingColor> = [
    { name: 'Black', value: '#000000' },
    { name: 'Green', value: '#00ff00' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Yellow', value: '#ffff00' }
  ];

  drawingPoints: Array<DrawingPoint> = [];

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.resizeCanvas();
    this.context = this.canvas?.nativeElement.getContext('2d');
    const move$: Observable<MouseEvent> = fromEvent(this.canvas?.nativeElement, 'mousemove');
    const down$: Observable<MouseEvent> = fromEvent(this.canvas?.nativeElement, 'mousedown');
    const up$: Observable<MouseEvent> = fromEvent(this.canvas?.nativeElement, 'mouseup');
    const moveout$: Observable<MouseEvent> = fromEvent(this.canvas?.nativeElement, 'mouseout');
    const resize$ = fromEvent(window, 'resize');

    const drag$ = down$.pipe(
      mergeMap(() => move$.pipe(
        takeUntil(up$),
        takeUntil(moveout$),
      ))
    );

    this.downSubscription = down$.subscribe((mouseevent) => {
      this.drawingPoints.push({
        color: this.currentColor,
        points: [{
          x: mouseevent.offsetX,
          y: mouseevent.offsetY,
        }]
      });
      this.count++;
      this.context?.beginPath();
      this.context?.moveTo(mouseevent.offsetX, mouseevent.offsetY);
    });

    this.dragSubscription = drag$.subscribe((mouseevent) => {
      const newPoints: Coordinate = { x: mouseevent.offsetX, y: mouseevent.offsetY };
      this.drawingPoints[this.count - 1].points.push(newPoints);
      this.context?.lineTo(mouseevent.offsetX, mouseevent.offsetY);
      this.context!.strokeStyle = this.drawingPoints[this.count - 1].color;
      this.context?.stroke();
    });

    this.resizeSubscription = resize$.subscribe(() => {
      const widthDiff = this.canvas?.nativeElement.clientWidth / this.currentWidth;
      const heightDiff = this.canvas?.nativeElement.clientHeight / this.currentHeight;
      this.resizeCanvas();
      this.reDraw(widthDiff, heightDiff);
      this.image.emit(this.canvas?.nativeElement.toDataURL());
    });

    this.upSubscription = up$.pipe(
      delay(500)
    ).subscribe(() => {
      this.image.emit(this.canvas?.nativeElement.toDataURL());
    });
  }

  ngOnDestroy(): void {
    this.dragSubscription?.unsubscribe();
    this.upSubscription?.unsubscribe();
    this.downSubscription?.unsubscribe();
    this.resizeSubscription?.unsubscribe();
    this.moveSubscription?.unsubscribe();
    this.moveoutSubscription?.unsubscribe();
  }

  reDraw(widthDiff: number, heightDiff: number): void {
    this.drawingPoints.forEach((drawingPoint, drawingPointIndex) => {
      drawingPoint.points.forEach((point, pointIndex) => {
        if (pointIndex === 0) {
          this.context?.beginPath();
          point.x *= widthDiff;
          point.y *= heightDiff;
          this.context?.moveTo(point.x, point.y);
        } else {
          point.x *= widthDiff;
          point.y *= heightDiff;
          this.context?.lineTo(point.x, point.y);
          this.context!.strokeStyle = this.drawingPoints[drawingPointIndex].color;
          this.context?.stroke();
        }
      });
    });
  }

  resizeCanvas(): void {
    this.currentWidth = this.canvas?.nativeElement.clientWidth;
    this.currentHeight = this.canvas?.nativeElement.clientHeight;
    this.canvas!.nativeElement.height = this.canvas?.nativeElement.clientHeight;
    this.canvas!.nativeElement.width = this.canvas?.nativeElement.clientWidth;
  }

  clearDrawings(): void {
    this.drawingPoints = [];
    this.count = 0;
    this.context?.clearRect(0, 0, this.canvas?.nativeElement.clientWidth, this.canvas?.nativeElement.clientHeight);
    this.image.emit(this.canvas?.nativeElement.toDataURL());
  }

  trackByFn(index: number): number {
    return index;
  }

}
