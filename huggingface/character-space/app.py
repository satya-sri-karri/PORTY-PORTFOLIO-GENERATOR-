import base64
import io
import os
import secrets
import warnings

import gradio as gr
import spaces
import torch
from diffusers import Flux2KleinPipeline
from PIL import Image, ImageOps
from rembg import new_session, remove
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

KEY = os.environ.get("PORTY_SPACE_KEY", "")
if len(KEY) < 32:
    raise RuntimeError("Add a PORTY_SPACE_KEY secret of at least 32 characters.")

STYLES = {"soft-3d": "a polished soft 3D animated-film character", "clay": "a charming handmade clay-animation character", "chibi": "a cute stylized 3D chibi character"}
Image.MAX_IMAGE_PIXELS = 16_000_000
warnings.simplefilter("error", Image.DecompressionBombWarning)
pipe = Flux2KleinPipeline.from_pretrained("black-forest-labs/FLUX.2-klein-4B", torch_dtype=torch.bfloat16).to("cuda")
background = new_session("u2netp")

class PrivateAPI(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.url.path.startswith("/gradio_api") and not secrets.compare_digest(request.headers.get("x-porty-key", "").encode(), KEY.encode()):
            return JSONResponse({"error": "Unauthorized"}, status_code=403)
        return await call_next(request)

@spaces.GPU(duration=60)
def stylize(image, style):
    prompt = f"Transform the person in this reference photo into {STYLES[style]}. Preserve their recognizable facial features, skin tone, hairstyle, apparent age, clothing and pose. Keep the same portrait framing. One person, softly lit, isolated against a plain white background. No text, watermark or extra people."
    with torch.inference_mode():
        return pipe(image=image, prompt=prompt, num_inference_steps=4, guidance_scale=1.0, width=768, height=1024, generator=torch.Generator(device="cuda").manual_seed(secrets.randbelow(2**31))).images[0]

def generate(photo, style):
    if style not in STYLES or not isinstance(photo, str) or len(photo) > 5_600_000:
        raise gr.Error("Choose a supported style and a photo under 4 MB.")
    try:
        header, encoded = photo.split(",", 1)
        if header not in ("data:image/png;base64", "data:image/jpeg;base64", "data:image/webp;base64"):
            raise ValueError("Unsupported format")
        data = base64.b64decode(encoded, validate=True)
        if len(data) > 4 * 1024 * 1024:
            raise ValueError("Image too large")
        with Image.open(io.BytesIO(data)) as source:
            source.load()
            image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((1024, 1024))
    except Exception:
        raise gr.Error("Could not read that photo. Choose a PNG, JPG or WebP image.") from None
    result = remove(stylize(image, style), session=background)
    result.thumbnail((768, 1024))
    output = io.BytesIO()
    result.save(output, format="WEBP", quality=85)
    if output.tell() > 1024 * 1024:
        raise gr.Error("The generated image is too large. Try another photo.")
    return {"image": "data:image/webp;base64," + base64.b64encode(output.getvalue()).decode("ascii")}

with gr.Blocks(analytics_enabled=False, delete_cache=(600, 600)) as app:
    gr.Markdown("# PORTY character worker\nUse this service through your PORTY account.")
    photo = gr.Textbox(visible=False)
    style = gr.Textbox(visible=False)
    result = gr.JSON(visible=False)
    gr.Button("Generate", visible=False).click(generate, [photo, style], result, api_name="generate", concurrency_limit=1)

app.queue(max_size=8).launch(show_error=False, app_kwargs={"middleware": [Middleware(PrivateAPI)]})
