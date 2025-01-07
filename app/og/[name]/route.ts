import { Renderer } from "./generator";

export async function GET(
  _: Request,
  props: { params: Promise<{ name: string }> }
) {
  const { name } = await props.params;

  const _renderer = new Renderer(name);
  const buffer = await _renderer.draw();

  return new Response(buffer, {
    headers: {
      contentType: "image/jpeg",
    },
  });
}
