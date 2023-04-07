This repo contains user shaders for prescaling in [mpv](https://mpv.io/).

For the scripts generating these user shaders, check the [source
branch](https://github.com/bjin/mpv-prescalers/tree/source). For
comparison/performance of prescalers, check the [Comparison](https://github.com/bjin/mpv-prescalers/wiki/Comparison)
and [Performance](https://github.com/bjin/mpv-prescalers/wiki/Performance) wiki.

Shaders in [`gather/` directory](https://github.com/bjin/mpv-prescalers/tree/master/gather)
and [`compute/` directory](https://github.com/bjin/mpv-prescalers/tree/master/compute)
are **generally faster** but requires recent version of OpenGL.
Use these shaders only if they actually work (i.e. no blue screen and no noticeable distortion).

Shaders in [`vulkan/` directory](https://github.com/bjin/mpv-prescalers/tree/master/vulkan)
are using `rgba16hf` LUT, and required by `gpu-api=vulkan` and
`gpu-api=d3d11`. Use these shaders if you encountered the following error:

```
[vo/gpu] Unrecognized/unavailable FORMAT name: 'rgba16f'!
```

# Usage

You only need to download shaders you actually use. The following part of this
section assumes that they are in `shaders` directory in the `mpv` configure
folder (usually `~/.config/mpv/shaders` on Linux).

Use `glsl-shaders="prescaler.hook"` option to load those shaders. (This will
override other user shaders, use `glsl-shaders-append` in that case)

```
glsl-shaders="~~/shaders/ravu-r3.hook"
```

All shaders are for one pass only. If you want to have `4x` upscaling, trigger
the same shader twice. All the shaders here are generated with
`max-downscaling-ratio` set to `1.414213`. They will be disabled if upscaling is not necessary.

```
glsl-shaders-append="~~/shaders/ravu-r3.hook"
glsl-shaders-append="~~/shaders/ravu-r3.hook"
```

Suffix in the filename indicates the planes that the prescaler will upscale.

* Without any suffix: Works on `YUV` video, upscale only luma plane. (like the old `prescale-luma=...` option in `mpv`).
* `-chroma*`: Works on `YUV` video, upscale only chroma plane.
* `-yuv`: Works on `YUV` video, upscale all planes after they are merged.
* `-rgb`: Works on all video, upscale all planes after they are merged and
  converted to `RGB`.

For `nnedi3` prescaler, `neurons` and `window` settings are indicated in the
filename.

For `ravu` prescaler, `radius` setting is indicated in the filename.

`ravu-*-chroma-{center,left}` are implementations of `ravu`, that
will use downscaled luma plane to calculate gradient and guide chroma planes
upscaling. Due to current limitation of `mpv`'s hook system, there are some
caveats for using those shaders:

1. It works with `YUV 4:2:0` format only, and will disable itself if size is not
   matched exactly, this includes odd width/height of luma plane.
2. It will **NOT** work with luma prescalers (for example `ravu-r3.hook`).
   You should use `rgb` and `yuv` shaders for further upscaling.
3. You need to explicitly state the chroma location, by choosing one of those
   `chroma-left` and `chroma-center` shaders. If you don't know how to/don't
   bother to check chroma location of video, or don't watch ancient videos,
   just choose `chroma-left`. If you are using [auto-profiles.lua](https://github.com/wm4/mpv-scripts/blob/master/auto-profiles.lua),
   you can use `cond:get('video-params/chroma-location','unknown')=='mpeg2/4/h264'`
   for `chroma-left` shader and `cond:get('video-params/chroma-location','unknown')=='mpeg1/jpeg'`
   for `chroma-center` shader.
4. `cscale` will still be used to correct minor offset. An EWA scaler like
   `haasnsoft` is recommended for the `cscale` setting.

# Known Issue

1. `ravu-lite` is incompatible with `--fbo-format=rgb10_a2` (default
   for some OpenGL ES implementation). Use `rgba16f` or `rgba16` if available.
2. `ravu-r4-{rgb,yuv}` causes distortion with lower-end intel card.

# License

Shaders in this repo are licensed under terms of LGPLv3. Check the header of
each file for details.
