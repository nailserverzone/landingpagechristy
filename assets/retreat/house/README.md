# Lake house photographs

Eleven interiors and exteriors of the two lake houses, supplied by Danielle
Russo in September and October 2026. They appear in the retreat page gallery,
ahead of the earlier property shots and the stock lake set.

They are listed in `GALLERY` in `app.jsx`. Each entry carries the folder, the
filename, alt text and a caption. The alt text describes what is in the frame;
the caption is the mood line, so the two deliberately differ.

## Replacing or adding one

1. **Strip the metadata.** Phone photographs carry GPS coordinates, and the
   exact property address is meant to reach registered guests only. Re-encoding
   through an image library writes a fresh file from pixels alone, which drops
   every EXIF and ICC block.
2. Save as WebP, around 1400px wide, quality 82.
3. If you replace a file rather than add one, **bump `ASSET_V` in `rooms.js`**.
   Filenames are stable, so without a bump a returning visitor keeps the old
   picture. A new filename needs no bump.

Landscape crops work best. The first tile in the gallery spans 2x2, so whatever
leads the list wants to be a wide shot that reads at size.
