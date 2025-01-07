import {
  Canvas,
  CanvasRenderingContext2D,
  loadImage,
  registerFont,
} from "canvas";
import { readFileSync } from "fs";
import { join } from "path";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: Canvas;
  private width = 1200;
  private height = 630;

  private readonly _backgroundColor = "rgba(32, 68, 57, 1)";
  private readonly _borderColor = "rgba(19, 51, 41, 1)";
  private readonly _foregroundColor = "white";
  private readonly _authorName = "Mehdi Jai";
  private readonly _website = "mehdijai.com";

  private readonly _authorPictureFileName = "thumbnail.png";
  private readonly _decorationFileName = "wave.svg";
  private readonly _logoFileName = "logo.svg";

  private readonly _mainFontName = "Urbanist";
  private readonly _mainFontFileName = "urbanist-medium.ttf";
  private readonly _titleFontName = "Urbanist bold";
  private readonly _titleFontFileName = "urbanist-extra-bold.ttf";

  /**
   * Initiate the Renderer and Canvas instance
   * @param title The dynamic title of the image
   */
  constructor(private title: string) {
    const canvas = new Canvas(this.width, this.height);
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx.imageSmoothingEnabled = true; // for better image quality
    this._loadFont();
  }

  /**
   * This is public to be called from external code.
   * @return Returns the buffer of the generated image as a Promise
   */
  public async draw(): Promise<Buffer> {
    this._paintCanvas();
    this._addTitle();
    this._addWebsite();
    this._addAuthorName();
    await this._addLogo();
    await this._addDecorationImage();
    await this._addAuthorPicture();

    return this._save();
  }

  // the _ prefix is just to tell this is a private method
  // Just conventions

  /**
   * Convert the canvas to buffer of type jpeg. (You can use PNG)
   * @returns {Buffer} image buffer
   */
  private _save(): Buffer {
    return this.canvas.toBuffer("image/jpeg", { quality: 1 });
  }

  private _paintCanvas(): void {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this._backgroundColor;
    this.ctx.fill();
  }

  /**
   * Add the title text in the center of the canvas
   */
  private _addTitle() {
    this.ctx.font = `64px "${this._titleFontName}"`; // I use a custom font. This will need to be registered to work.
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this._foregroundColor;
    this.ctx.fillText(this.title, this.width / 2, this.height / 2);
  }

  /**
   * Add the website name in the bottom right corner
   * You can make it variable, but for the simplicity, it will be hard coded.
   */
  private _addWebsite() {
    this.ctx.font = `20px "${this._mainFontName}"`;
    this.ctx.textAlign = "end";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = this._foregroundColor;
    // We will leave a margin of 80px on the right. and 50px on the bottom side
    this.ctx.fillText(this._website, this.width - 80, this.height - 50);
  }
  private _addAuthorName() {
    this.ctx.font = `20px "${this._mainFontName}"`;
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = this._foregroundColor;
    // The margin on the left needs to take in consideration the image will be added.
    // You can tweak it as you desire
    this.ctx.fillText(this._authorName, 120, this.height - 50);
  }

  /**
   * Adds the Logo in the center top of the canvas.
   */
  private async _addLogo() {
    const source = await this._getImageBase64Data(this._logoFileName);
    const logo = await loadImage(source); // loadImage imported from "canvas"

    this.ctx.drawImage(logo, this.width / 2 - 15, 50);
  }

  /**
   * Add the decoration wave SVG in the center with 60% width and transparency of 30%
   */
  private async _addDecorationImage() {
    const source = await this._getImageBase64Data(this._decorationFileName);
    const wave = await loadImage(source);

    // Handle the size shrinking
    const width = wave.width * 0.6;
    const height = wave.height * 0.6;
    this.ctx.globalAlpha = 0.7; // to reduce the image opacity
    this.ctx.drawImage(
      wave,
      this.width / 2 - width / 2,
      this.height / 2 - height / 2,
      width,
      height
    );
    this.ctx.globalAlpha = 1; // get it back to the default value, otherwise, everything after this will have opacity of 0.7
  }

  /**
   * Create the author image.
   * The image is square or rectangle by default,
   * So, we will make it circle by clipping it with a circle path
   */
  private async _addAuthorPicture() {
    const source = await this._getImageBase64Data(this._authorPictureFileName);

    const pic = await loadImage(source);

    const x = 80;
    const y = this.height - 60;
    const imgSize = 50;

    this.ctx.beginPath();
    this.ctx.arc(x, y, imgSize / 2, 0, 2 * Math.PI, false); // Create the clipping circle
    this.ctx.strokeStyle = this._borderColor;
    this.ctx.fillStyle = this._borderColor;
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.clip();
    const aspect = pic.height / pic.width; // to keep the image size proportional
    this.ctx.drawImage(
      pic,
      x - imgSize / 2,
      y - imgSize / 2,
      imgSize,
      imgSize * aspect
    );
    this.ctx.restore(); // Close the clipping
  }

  private _getFont(name: string) {
    return join(process.cwd(), "public", "fonts", name);
  }

  private _loadFont() {
    registerFont(this._getFont(this._mainFontFileName), {
      family: this._mainFontName,
    });
    registerFont(this._getFont(this._titleFontFileName), {
      family: this._titleFontName,
    });
  }

  private _getMimetype(extension: string): string {
    const map: Record<string, string> = {
      svg: "image/svg+xml",
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      webp: "image/webp",
    };

    if (extension in map) {
      return map[extension];
    } else {
      return map.png;
    }
  }

  private async _getImageBase64Data(fileName: string): Promise<string> {
    const parts = fileName.split(".");
    const extension = parts[parts.length - 1];
    const mime = this._getMimetype(extension);

    const filePath = join(process.cwd(), "public", fileName);

    const fileContent = readFileSync(filePath);

    const base64Data = fileContent.toString("base64");

    return `data:${mime};base64,${base64Data}`;
  }
}
