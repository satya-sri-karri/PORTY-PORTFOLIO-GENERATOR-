---
title: PORTY Character Studio
emoji: 🎨
colorFrom: teal
colorTo: blue
sdk: gradio
app_file: app.py
python_version: '3.10'
license: apache-2.0
---

# PORTY Character Studio

An API-only photo-to-character worker for PORTY. Uses the Apache-2.0 **black-forest-labs/FLUX.2-klein-4B** image-editing model (four inference steps) on Hugging Face ZeroGPU. Background removal uses rembg (MIT) with the U²-Net small model (upstream Apache-2.0). These are 3D-style images, not rigged 3D models. Quality and recognizable likeness need human review.

## Activate

1. Create a **Gradio Space** in your own Hugging Face account. Upload this directory's `app.py`, `requirements.txt` and `README.md` to its root.
2. Select **ZeroGPU** hardware in Space settings. Eligibility and quotas are controlled by Hugging Face; do not select a paid GPU to work around unavailable free hardware.
3. Add a **Space secret** named `PORTY_SPACE_KEY` containing a random value of at least 32 characters. Generate one locally with `python -c "import secrets; print(secrets.token_urlsafe(32))"`. Never commit it or put it in frontend variables.
4. Let the Space finish installing and downloading the model. Copy its actual `https://…hf.space` app URL from the Space's API/embedded-app link.
5. Configure the PORTY backend (local `.env` or hosting secret settings): `HF_CHARACTER_SPACE_URL` = app URL; `HF_CHARACTER_SPACE_KEY` = the same secret. Optional `HF_TOKEN` is a server-only Hugging Face token with permission to access the Space. Restart the backend.
6. Open Personal Info → Turn your photo into a character. Upload a photo, confirm processing, generate, review, then choose **Use character**. Save the portfolio separately.

Without configuration PORTY disables generation and retains ordinary avatar uploads. No credentials are currently included and this worker has not yet been deployed or tested on a live GPU.

## API and data

The backend submits `[photoDataURL, style]` to `/gradio_api/call/generate` and reads the Gradio event stream. Both requests require `X-Porty-Key`; private Spaces also require `Authorization: Bearer HF_TOKEN`. Inputs never include a caller-controlled prompt or remote URL. Styles are `soft-3d`, `clay` and `chibi`.

The worker returns a transparent WebP data URL. The accepted image uses PORTY's existing avatar storage and save flow; temporary Space file URLs are not stored. No new storage account is required. Photos are sent to Hugging Face only after the user confirms processing. The worker does not write photos to a dataset or permanent file; Gradio/platform request caches and logs remain subject to the hosting service's behavior.

Generation runs as an authenticated background job, so free GPU queue waits do not hold a frontend HTTP connection open. Jobs expire after ten minutes and stop waiting after four minutes. Cancel stops PORTY from waiting/using the result; already-running remote GPU work may finish and use quota. The prototype allows one pending job and three new requests per account per day, with at most 50 temporary jobs per server process. Limits and jobs are in memory and reset on restart; run one backend instance for this prototype. Multi-instance production needs shared durable job/quota storage. All server-side requests share the HF quota of the configured identity; it is not a separate free allowance for each PORTY user.

Free eligibility, queues and daily quotas: https://huggingface.co/docs/hub/spaces-zerogpu

Model and licence: https://huggingface.co/black-forest-labs/FLUX.2-klein-4B

Model API: https://huggingface.co/docs/diffusers/api/pipelines/flux2

Background-removal model: https://github.com/xuebinqin/U-2-Net

Gradio API protocol: https://gradio.app/guides/querying-gradio-apps-with-curl
