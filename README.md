# Portfolio

A small portfolio: a home page plus one page per project. Plain HTML and CSS,
with no build step, no dependencies, no JavaScript, and no network requests.

```
index.html                 home page, links to each project
tophat/index.html          project page
throttle-tune/index.html   project page
eclipse-cli/index.html     project page
style.css                  palette, type, layout (shared by every page)
favicon.svg                eclipse crescent
```

## Editing

Everything you'd normally want to change is in one of three places:

- **Copy, links, project list** live in `index.html`. Each project is one
  `<li class="project">` containing an inline SVG mark, a title, a description,
  a tag line, and a link to its project page.
- **Project write-ups** live in each project's folder. A project page has a
  header (mark, name, one-line summary, tags, GitHub link), a demo video, a
  "What it does" / "How it works" write-up, and a link to the next project.
- **Colors and type** live in the `:root` block at the top of `style.css`.

To add a project, copy one of the project folders, rename it, edit the copy,
add an `<li class="project">` to `index.html` that links to it, and update the
"Next project" links so the chain still loops through every project.

## Adding a demo video

Each project page has a placeholder where the video goes, with instructions in
an HTML comment right above it. Either:

- **Save the video in the project's folder** (e.g. `tophat/demo.mp4`) and
  replace the placeholder `<div>` with
  `<video src="demo.mp4" poster="poster.jpg" controls playsinline preload="metadata"></video>`.
  The poster is an optional still frame shown before playback.
- **Or embed it from YouTube** with the `<iframe>` snippet in the same comment.
  This is the only thing on the site that makes a network request.

Keep self-hosted videos short and compressed. GitHub warns on files over 50 MB
and rejects anything over 100 MB. Something like this gets a 1080p recording
well under that:

```bash
ffmpeg -i recording.mov -vf "scale=1920:-2" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -map_metadata -1 -movflags +faststart demo.mp4
```

It also matters for phone footage specifically. iPhones record HEVC, which
Chrome on Windows can't play, and embed the GPS location where the clip was
shot; the command converts to H.264 and `-map_metadata -1` drops the location.
Before publishing, scrub through any screen recording for keys, RPC URLs or
anything else that shouldn't be public.

Put raw recordings in `videos/`. It's in `.gitignore`, so originals never get
published by accident; only the processed copies in each project folder do.

For a silent demo that should play on its own like a GIF, use
`autoplay muted loop playsinline controls`. Throttle Tune's demo needs its
sound, so it uses `controls` alone.

The frame is 16:9. For a vertical phone video, add `portrait` to the figure
(`<figure class="demo portrait">`) to get a narrow 9:16 frame that never
outgrows the screen. Eclipse's page also shows the two-clip comparison layout
(`demo compare`).

## Preview

Serve the folder, then open http://localhost:8000:

```bash
python3 -m http.server 8000
```

Opening `index.html` straight from disk also works, but the project links point
at folders (`tophat/`), which only resolve to their `index.html` through a
server.

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
