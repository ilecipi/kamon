import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import OpenSimplexNoise from 'open-simplex-noise';


@Component({
  selector: 'app-perlin-field',
  templateUrl: './perlin-field.component.html',
  styleUrls: ['./perlin-field.component.css']
})
export class PerlinFieldComponent implements OnInit, OnDestroy {


  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() screenHeight: number;

  private running: boolean;

  public fps = 0;
  private now: number;
  private lastUpdate = new Date().getTime();
  public frameFps = 0;
  // The higher this value, the less the FPS will be affected by quick changes
  // Setting this to 1 will show you the FPS of the last sampled frame only
  public fpsFilter = 100;

  //Declaration of noise type which provides noise functions
  private noise = new OpenSimplexNoise(Date.now());

  private spacing = 30;
  private columns: number;
  private rows: number;
  private field: number[][] = [];
  private inc = 0.1;
  private time = 0;
  private timeInc = 0.01;

  private numOfParticles: number = 1000;
  private particles: number[][] = [];
  //[x,y,vx,vy]
  private maxSpeed: number = 10;
  private particlesSize = 5;
  private particleMass: number = 1;

  private xPos = 0;
  private yPos = 0;

  constructor() {
  }

  ngOnInit() {
    this.running = true;
    this.setup();
    this.paint();

  }

  ngOnDestroy() {
    this.running = false;
  }

  private paint(): void {
    // Check that we're still running.
    if (!this.running) {
      return;
    }
    // Calculates fps
    this.now = new Date().getTime();
    this.frameFps = 1000 / (this.now - this.lastUpdate);
    if (this.now != this.lastUpdate) {
      this.fps += (this.frameFps - this.fps) / this.fpsFilter;
      this.frameFps = Math.ceil(this.frameFps);
      this.lastUpdate = this.now;
    }


    // Paint current frame
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.updateField();
    this.updateParticles();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    for (let k = 0; k < this.rows * this.columns - 1; k++) {
      let angle = this.field[this.xPos][this.yPos] * 2 * Math.PI;

      //output = output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)


      ctx.strokeStyle = '#777777';
      ctx.beginPath();
      ctx.moveTo(this.xPos * this.spacing, this.yPos * this.spacing);
      ctx.lineTo((this.xPos + Math.cos(angle)) * this.spacing, (this.yPos + Math.sin(angle)) * this.spacing);
      ctx.closePath();
      ctx.stroke();


      this.xPos += 1;
      if (this.xPos >= this.columns) {
        this.yPos += 1;
        this.xPos = 0;
      }
      if (this.yPos >= this.rows) {
        this.yPos = 0;
        //this.running = false;
        //console.log('ended');
      }
    } // this is the other parenthesis of the for loop over

    for (let i = 0; i < this.numOfParticles; ++i) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.particles[i][0], this.particles[i][1], this.particlesSize, this.particlesSize);    }


    // Schedule next
    requestAnimationFrame(() => this.paint());
  }

  private setup(): void {
    this.columns = Math.ceil(this.screenWidth / this.spacing);
    this.rows = Math.ceil(this.screenHeight / this.spacing);

    for (let x = 0; x < this.columns; x++) {
      this.field.push([]);
      for (let y = 0; y < this.rows; y++) {
        this.field[x].push(0.5 * this.noise.noise3D(x * this.inc, y * this.inc, this.time * this.timeInc) + 0.5);
      }
    }

    for (let i = 0; i < this.numOfParticles; i++) {
      let x = Math.random() * this.screenWidth;
      let y = Math.random() * this.screenHeight;
      this.particles.push([x, y, 0, 0]);
    }
  }


  private updateField(): void {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.field[x][y] = (0.5 * this.noise.noise3D(x * this.inc, y * this.inc, this.time * this.timeInc) + 0.5);
      }
    }
    this.time++;
  }

  private updateParticles(): void {
    for (let i = 0; i < this.numOfParticles; i++) {
      let posOnGridX = Math.floor(this.particles[i][0] / this.spacing);
      let posOnGridY = Math.floor(this.particles[i][1] / this.spacing);
      let forceX = Math.cos(this.field[posOnGridX][posOnGridY]);
      let forceY = Math.sin(this.field[posOnGridX][posOnGridY]);

      // Apply Force
      this.particles[i][2] += 1000*forceX/this.particleMass;
      this.particles[i][3] += 1000*forceY/this.particleMass;

      // Check that speed is lower than maxSpeed
      let speedValue = Math.sqrt(Math.pow(this.particles[i][2], 2) + Math.pow(this.particles[i][3], 2));
      if (speedValue >= this.maxSpeed) {
        this.particles[i][2] *= this.maxSpeed / speedValue;
        this.particles[i][3] *= this.maxSpeed / speedValue;
      }
      this.particles[i][0] += this.particles[i][2];
      this.particles[i][1] += this.particles[i][3];

      // Boundary check
      if (this.particles[i][0] < 0) {
        this.particles[i][0] = this.screenWidth;
      }
      if (this.particles[i][0] > this.screenWidth) {
        this.particles[i][0] = 0;
      }
      if (this.particles[i][1] < 0) {
        this.particles[i][1] = this.screenHeight;
      }
      if (this.particles[i][1] > this.screenHeight) {
        this.particles[i][1] = 0;
      }
    }
  }
}