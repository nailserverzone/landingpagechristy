# Room photographs

All six rooms have a real photograph. The site picks a file up automatically from
its filename — no code change needed. If a file is missing or fails to load, that
card falls back to a grey placeholder rather than a broken image.

| Filename | Room | How Danielle described it |
| --- | --- | --- |
| `new-master.jpg` | Newer House — Downstairs Master Suite | dark blue comforter |
| `new-king.jpg` | Newer House — King Room | light green comforter |
| `new-bunk.jpg` | Newer House — Bunk Room | the bunks |
| `old-master.jpg` | Older House — Master Suite | queen/full, tan comforter |
| `old-loft.jpg` | Older House — Loft King | king, tan-brown comforter |
| `old-twin.jpg` | Older House — Full & Twin Room | the little boat bed |

`old-master` and `old-loft` were matched by judgement, not by an explicit label —
that batch held two similar cream-and-tan rooms and Danielle distinguished them
only by bed size. Worth confirming with her; if they are swapped, exchange the
two files and bump `ASSET_V`.

## Replacing a photo

1. Strip the metadata. Phone pictures carry GPS coordinates, and the exact
   property address is meant to reach registered guests only. Remove every APPn
   and COM segment — dropping the segments whole leaves the image data untouched,
   so there is no re-encoding and no quality loss.
2. Save it over the existing filename.
3. **Bump `ASSET_V` in `rooms.js`.** Filenames are stable, so without a bump a
   returning visitor keeps seeing the old picture.

Landscape crops work best — the card area is roughly 3:2. Around 1600px wide is
plenty; anything larger just slows the page down.
