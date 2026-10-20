---
title: PORTY Minimalist Preview
emoji: 🎨
colorFrom: teal
colorTo: blue
sdk: static
app_file: index.html
license: mit
---

# PORTY Minimalist

An interactive static preview of PORTY's actual Minimalist React theme: six palettes, three font pairings, two cover compositions, motion controls and local avatar review before applying.

No GPU, backend, API token or account-age eligibility is needed to run this preview. It does not convert photographs into characters. Generate a character in an external image-editing tool, download it, then upload it here. Uploaded images and edits stay in browser memory and are cleared on reload. Fonts load from Google Fonts; system fonts are used if unavailable.

## Build

From the repository root, with frontend dependencies installed:

```sh
node frontend/scripts/build-minimalist-static.cjs
```

This creates `index.html` beside this README. Create a **Static** Hugging Face Space and upload both files to the root. No secrets are needed. The generated page is a theme preview, not the full PORTY portfolio builder.

## Enable automatic conversion later

Keep this static preview separate from the Python worker in `../character-space`. When your account is eligible for ZeroGPU hosting, create a Gradio Space using that worker and configure PORTY's backend following its README. The builder automatically switches from manual upload to integrated generation when the backend reports that the provider is available. Never place backend secrets in a Static Space.
