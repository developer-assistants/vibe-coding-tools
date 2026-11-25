# Vibe Coding Tools

Static directory comparing 36 AI coding platforms, editors, terminal agents, and browser app builders.

Live site: https://developer-assistants.github.io/vibe-coding-tools/

## What is in this repository

- `data/tools.json`: Structured catalog of 36 vibe coding tools with pricing tier, open-source license, target build goals, source code export details, pros, cons, and official or GitHub links.
- `index.html`, `css/`, `js/app.js`: Single-page static site with instant search, category and open-source filtering, a goal-based matcher, tool detail modal, and a 4-column side-by-side comparison table.
- `tests/validate_data.mjs`: Schema and link validator for `data/tools.json`.

No backend, user registration, or external API keys are required.

## Goal-based quick index

| Build goal | Recommended platforms |
| --- | --- |
| Website without coding | Lovable, Bolt.new, v0 by Vercel, Firebase Studio |
| Android app | Codex, Claude Code, Gemini CLI, Firebase Studio |
| Chrome extension | Cursor, Codex, Windsurf, Continue |
| SaaS product | Lovable, Replit Agent, Codex, Cursor |
| Desktop app | Claude Code, Cursor, Zed AI, Goose |
| Free and open source | Aider, Continue, Cline, OpenHands, Dyad |

## Local preview and validation

Validate the JSON dataset:

```bash
node tests/validate_data.mjs
```

Serve locally with Python:

```bash
python3 -m http.server 4178
```

Then open `http://127.0.0.1:4178/`.

## Contributing a tool

Add an entry to `data/tools.json` following the existing fields, run `node tests/validate_data.mjs`, and open a pull request.

## License

MIT. See [LICENSE](LICENSE).
