# Jackpot Roofing & Gutters website

A static site ready for GitHub Pages. All site files live in the repository root; image assets live in `img/`.

## Add finished-roof photos

1. Put `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.avif` photos in `img/`.
2. Run `node update-gallery.js`.
3. Commit the photos and the updated `gallery-data.js` file.

Every listed photo becomes a scrollable gallery card and can be opened full-screen. The company logo is intentionally excluded from the project gallery.

## Publish with GitHub Pages

Push these files to the root of a GitHub repository. In **Settings → Pages**, choose **Deploy from a branch**, select the branch, and use the **/(root)** folder.
