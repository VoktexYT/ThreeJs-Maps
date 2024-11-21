import Phaser from 'phaser';


const WIDTH = 805;
const HEIGHT = 585;

const BACKGROUND_COLOR = 0xABABAB;
const RECT_COLOR = 0xFBFBFB;
const RECT_SIZE = 40;
const RECT_SPACING = 5;
const NOMBER_LINE_X = 17;
const NOMBER_LINE_Y = 12;

const RED_COLOR: number = 0xFF0000;
const BLUE_COLOR: number = 0x0000FF;

const RED_TEXT_TRUN = "Red player ";
const BLUE_TEXT_TRUN = "Blue player ";

class MainScene extends Phaser.Scene {
    map: Array<Array<[Phaser.GameObjects.Rectangle, boolean]>> = [];
    
    clickCasePosition: Array<number> = [];

    textBox: Phaser.GameObjects.Text | undefined;

    redTurn: boolean = true;
    oneCLick: boolean = true;
    finishCubeFalling = true;

    lastTime = new Date();

    constructor() {
        super('MainScene');
    }

    preload(): void {
        this.textBox = this.add.text(WIDTH / 2, 5, "", {fontSize: 30, color: "#000"}).setOrigin(0.5, 0);
    }

    create(): void {
        for (let y=1; y<NOMBER_LINE_Y; y++)
        {
            let row: Array<[Phaser.GameObjects.Rectangle, boolean]> = [];

            for (let x=1; x<NOMBER_LINE_X; x++)
            {
                const rectangle = this.add.rectangle(
                    x * (RECT_SIZE + RECT_SPACING), 
                    y * (RECT_SIZE + RECT_SPACING), 
                    RECT_SIZE,
                    RECT_SIZE, 
                    RECT_COLOR
                );

                rectangle.setOrigin(0, 0);
                rectangle.setInteractive();

                rectangle.on("pointerdown", () => {
                    this.clickCasePosition = [x-1, y-1];

                    if (this.finishCubeFalling)
                    {
                        this.oneCLick = true;
                    }
                });

                rectangle.on("pointerup", () => {
                    this.clickCasePosition = [];
                });

                row.push([rectangle, false]);
            }
            this.map.push(row);
        }

        console.log(this.map);
    }

    update_case_color()
    {
        if (this.oneCLick)
        {
            if (this.clickCasePosition.length == 2 && this.textBox)
            {
                let color: number = this.redTurn ? RED_COLOR : BLUE_COLOR;
                
                let [x, y] = this.clickCasePosition;

                if (this.map[y][x][0].fillColor == RECT_COLOR)
                {
                    this.finishCubeFalling = false;

                    this.map[y][x][0].fillColor = color;
                
                    if (this.redTurn)
                    {
                        this.textBox.text = RED_TEXT_TRUN;
                    }
        
                    else
                    {
                        this.textBox.text = BLUE_TEXT_TRUN;
                    }
    
                    this.redTurn = !this.redTurn;
                }
            }

            this.oneCLick = false;
        }
  
    }

    square_fall_update(): void {
        if (new Date().getTime() - this.lastTime.getTime() > 100)
        {
            this.lastTime = new Date();

            for (let y=0; y<this.map.length; y++)
            {
                for (let x=0; x<this.map[y].length; x++)
                {
                    let case_map = this.map[y][x];
                    if (y+1 < this.map.length)
                    {
                        if (case_map[0].fillColor != RECT_COLOR && !case_map[1])
                        {
                            if (this.map[y+1][x][0].fillColor == RECT_COLOR && !this.map[y+1][x][1])
                            {
                                let color = case_map[0].fillColor;
                                case_map[0].fillColor = RECT_COLOR;
                                this.map[y+1][x][0].fillColor = color;
                            }
    
                            else
                            {
                                this.map[y+1][x][1] = true;
                                this.finishCubeFalling = true;
                            }
    
                            return;
                        }
                    }

                    else if (case_map[0].fillColor != RECT_COLOR && !this.map[y][x][1])
                    {
                        this.map[y][x][1] = true;
                        this.finishCubeFalling = true;
                    }
                }
            }
        }
    }

    update(): void {
        this.update_case_color();
        this.square_fall_update();
    }
}


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
    scene: MainScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
        }
    }
};


const game = new Phaser.Game(config);
