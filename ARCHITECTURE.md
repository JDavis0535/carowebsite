# How this website works

A plain-English guide to how the Barker & Bow / Caro Scarfs site is put together,
so anyone can understand it without being a developer.

## The big idea

**GitHub is the heart of everything.** All the content and code live there, and
every change flows *into* GitHub, then *out* to the live site automatically.

> The one thing to remember: **if it's not in GitHub, it's not on your site.**

```
   You & Claude                         Admins
   (edit code files)              (edit via /admin panel)
          \                              /
           \   code edits      publish  /
            \                          /
             v                        v
        ┌─────────────────────────────────┐
        │        GitHub Repository          │   ★ single source of truth
        │   all code, scarf data & photos   │
        └─────────────────────────────────┘
                        │  auto-triggers a build
                        v
        ┌─────────────────────────────────┐
        │             Netlify               │
        │   builds with Astro · hosts site  │
        │   runs login & form services      │
        └─────────────────────────────────┘
                        │  publishes pages
                        v
        ┌─────────────────────────────────┐
        │          Live Website             │ ──► Your inbox
        │      caroscarfs.netlify.app       │     (inquiry emails)
        └─────────────────────────────────┘
                        │  serves pages
                        v
                    Visitors
```

## The pieces

### GitHub — the single source of truth
Think of this as the master filing cabinet. It holds *everything*: the page code,
the scarf data files, and uploaded photos. Nothing exists on the live site that
isn't here first. It also keeps a complete history, so any change can be undone.

- Repo: `JDavis0535/carowebsite`

### Netlify — the builder & host
Netlify *watches* GitHub. The moment anything changes there, it:
1. Runs **Astro** (the website tool), which turns the code + scarf data into plain,
   finished web pages.
2. Publishes those pages to the internet at the site address.
3. Quietly runs two small background services: the **GitHub login** for the admin
   panel, and the **contact form** handler that emails submissions to the owner.

### The live website — what the world sees
Just a stack of pre-built, finished pages on Netlify's fast global network. There's
**no database and no server doing work** when someone visits — the pages are already
done. That's why the site is fast, free to run, and very secure.

### Visitors
They browse scarves, and if they fill in the contact form, Netlify catches it and
**emails it to the owner's inbox**.

## The two ways content changes

| Path | Who | What happens |
|---|---|---|
| **Code edits** | You & Claude | Edit a file → save to GitHub → Netlify rebuilds → live in ~1 min |
| **Admin panel** | You & admins | Add/edit a scarf at `/admin` → saves straight to GitHub → rebuilds → live in ~1 min |

Both paths end up in **GitHub**, and both trigger the same automatic rebuild. The
admin panel is just a friendly, photo-uploading front door to editing those GitHub
files — so you never have to touch code to manage products.

## Why this setup is a good one

- **Free to run** — no database or server costs.
- **Fast & secure** — pre-built pages, nothing to hack into.
- **Self-updating** — change in one place, it publishes itself.
- **Reversible** — GitHub's history means no mistake is permanent.
- **No lock-in** — standard Astro + GitHub; any developer can pick it up.

## Where things live (quick map)

| What | Where |
|---|---|
| Scarf products (photos, prices, stock) | `/admin` panel → `src/data/scarves/*.json` |
| Business name | `src/components/Header.astro`, `Footer.astro`, `src/layouts/Layout.astro` |
| Home page text & tagline | `src/pages/index.astro` |
| About story | `src/pages/about.astro` |
| Contact email & socials | `src/pages/contact.astro` |
| Colours & fonts | `src/styles/global.css` (the `@theme` block) |
| Admin panel config | `public/admin/config.yml` |
| Login services | `netlify/functions/auth.js`, `callback.js` |
| Hosting/build settings | `netlify.toml` |
