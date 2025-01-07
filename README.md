# NextJS Dynamic Image Generator

## Getting Started

First, Install the dependencies:

```bash
pnpm i
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You will find a page like this:

![Demo](https://cdn.hashnode.com/res/hashnode/image/upload/v1736281154117/00d0cf4a-6a88-48e4-91c7-f1dc20069b22.png)

Change this page in `/app/page.tsx`

## API Route

You will find the Generation process inside `/app/og/[name]`. The `route.ts` handles the GET Request, and `generator.ts` handles the logic of generation.

## Generator (Renderer)

The logic of creating the image is inside the `generator.ts` typescript file. You can change the variables to add your name, website. Or change the names of the files according to what you have inside the public folder.

```typescript
export class Renderer {

//...

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
    private readonly _titleFontName = "urbanist-extra-bold.ttf";
    private readonly _titleFontFileName = "Urbanist bold";

//...
}
```

## Font

The current implementation loads the font files from `/public/fonts` folder for the custom font. If you use system font and don't need the font loading. Remove the `_loadFont` function from the constructor:

```diff
constructor(private title: string) {
    const canvas = new Canvas(this.width, this.height);
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx.imageSmoothingEnabled = true; // for better image quality
-   this._loadFont();
+   // this._loadFont();
}
```

The used font names are also variables, you can just change them in one place.

## Read the Article

Check the full article for this project [Here](https://mehdijai.com/blog/next-dynamic-image)
