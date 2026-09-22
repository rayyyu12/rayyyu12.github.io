# Portfolio

A single-page portfolio. Plain HTML and CSS, with no build step, no
dependencies, no JavaScript, and no network requests.

```
index.html    the page
style.css     palette, type, layout
favicon.svg   eclipse crescent
```

## Editing

Everything you'd normally want to change is in one of two places:

- **Copy, links, project list** live in `index.html`. Each project is one
  `<li class="project">` containing an inline SVG mark, a title, a description,
  and a tag line.
- **Colors and type** live in the `:root` block at the top of `style.css`.

## Preview

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deploying

Any static host works, since there is nothing to build.

### GitHub Pages

Naming the repo `rayyyu12.github.io` is what puts the site on a clean root URL.
Any other name puts it on a subpath instead.

```bash
cd ~/Desktop/portfolio
git init -b main
git add .
git commit -m "Portfolio site"
gh repo create rayyyu12.github.io --public --source=. --push
```

A repo named `<user>.github.io` publishes from the default branch on its own.
Give it a minute, then load https://rayyyu12.github.io. If it 404s, check
Settings, Pages, and set the source to `main` / `/ (root)`.

To update later:

```bash
git add . && git commit -m "Update copy" && git push
```

### Netlify

No terminal at all: sign in at app.netlify.com, then drag this folder onto the
deploy area. It goes live on a random subdomain you can rename in Site settings.

### Custom domain

Buy a domain, add a file named `CNAME` to this folder containing just the
domain, push, then point the domain's DNS at the host. Both GitHub Pages and
Netlify issue an HTTPS certificate automatically once DNS resolves.

## Notes

- The type uses system font stacks: a serif for headings (New York on macOS,
  Georgia elsewhere) and the system UI sans for body text. Nothing is fetched
  from a font CDN, so the page renders instantly and offline.
- The page is light-only by design. The warm beige is the identity, and a dark
  variant would throw it away for half of visitors.
- Link and tag colors were picked to clear WCAG AA contrast against the beige
  background. If you retune `--clay` or `--sage`, re-check them.
