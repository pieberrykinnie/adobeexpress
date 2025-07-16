# Implementation Plan – BrandGenie Add-on

This roadmap decomposes the **BrandGenie** prototype into granular, actionable tasks that can each be completed in ≤ 2 hours.  Every task lists a **Conventional Commit** label, testing requirements, and documentation deliverables.

> ⚙️  **Environment**: Node 20, pnpm, Typescript, Adobe Express Add-on SDK. Lint: ESLint + Prettier + TypeScript strict.

---

## Phase 0 – Repository & Tooling (Day 0)

| # | Task | Conventional Commit | Testing Checklist | Docs / Artifacts |
|---|------|--------------------|-------------------|------------------|
|0.1|Create monorepo with `pnpm workspaces` (`brandgenie/`) | `chore(repo): setup pnpm monorepo` | `pnpm install && pnpm -r lint` passes | Update `README.md` with workspace layout |
|0.2|Add shared ESLint, Prettier, TS configs | `chore(lint): add shared configs` | `pnpm run lint` shows 0 errors | Docs section *Code Style* |
|0.3|Add Husky + lint-staged pre-commit hooks | `chore(ci): add husky pre-commit` | Commit test file → hook runs | Mention in *Contributing* |
|0.4|CI with GitHub Actions (install, test, build) | `ci(github): add build pipeline` | PR triggers workflow green | `.github/workflows/ci.yml` |

---

## Phase 1 – Add-on Skeleton (Day 1)

| # | Task | Conventional Commit | Testing Checklist | Docs |
|1.1|Generate Add-on manifest & sample panel via Adobe CLI | `feat(addon): scaffold express addon-ui` | `pnpm --filter addon-ui build` succeeds; panel loads in Code Playground | `docs/setup-local.md` |
|1.2|Configure Vite + React + TS in `packages/addon-ui` | `chore(build): vite config` | `pnpm run dev` hot-reloads | Add *Local Dev* section |
|1.3|Implement global Chakra UI theme placeholder | `feat(ui): add chakra theme` | Visual smoke test | Storybook story |
|1.4|Add basic router & sidebar layout | `feat(ui): sidebar scaffold` | Unit: rendering no crash | Docs screenshot |

---

## Phase 2 – Brand Analyzer Service (Day 2)

| # | Task | Conventional Commit | Testing Checklist | Docs |
|2.1|Create `cloud-functions/brand-analyzer` Cloudflare Worker | `feat(cf): scaffold brand-analyzer` | `wrangler dev` returns 200 | Function README |
|2.2|Implement logo upload endpoint (accept base64) | `feat(api): upload logo endpoint` | Jest unit: 415 rejects non-image | API reference |
|2.3|Integrate `node-vibrant` palette extraction | `feat(ai): extract palette from logo` | Unit: returns ≥3 colors | Palette algorithm doc |
|2.4|Scrape URL for images & CSS fonts | `feat(ai): scrape url for assets` | Playwright test with demo URL | Edge-cases section |
|2.5|Font similarity model (cosine w/ embeddings) | `feat(ai): font recommender` | Unit: returns top-5 fonts | Model choices doc |

---

## Phase 3 – Firefly Enhancers & Template Generator (Day 3)

| # | Task | Conventional Commit | Testing Checklist | Docs |
|3.1|Connect to Firefly API for palette suggestion | `feat(api): firefly palette enhancement` | Mock Firefly call in jest | API key doc |
|3.2|Generate 3 template images via Firefly prompt | `feat(api): firefly template images` | Snapshot test images saved | UX doc |
|3.3|Save temporary assets to Cloudflare KV | `feat(cf): cache generated assets` | Integration test cache hit | Architecture diagram |

---

## Phase 4 – Brand Kit Creator (Day 4)

| # | Task | Conventional Commit | Testing Checklist | Docs |
|4.1|Hook Express SDK to create Brand Kit | `feat(sdk): create brand kit` | E2E: new kit visible in Express | Update *User Flow* |
|4.2|Upload logos/colors/fonts via SDK calls | `feat(sdk): upload brand assets` | Unit: verify API payloads | API mapping table |
|4.3|Programmatically create starter templates | `feat(sdk): create starter templates` | E2E: projects appear | Template JSON doc |

---

## Phase 5 – BrandGuard Linter (Day 5)

| # | Task | Conventional Commit | Testing Checklist | Docs |
|5.1|Subscribe to canvas change events | `feat(linter): subscribe to events` | Simulate layer change → callback fires | Developer guide |
|5.2|Contrast ratio checker with `chroma.js` | `feat(linter): color contrast check` | Unit: WCAG AA pass/fail | Accessibility doc |
|5.3|Off-brand color/font detector | `feat(linter): brand violation rules` | Unit: returns list of violations | Rules YAML |
|5.4|Toast notifications & quick-fix suggestions | `feat(linter): ui toast actions` | Playwright UI test | UX guidelines |

---

## Phase 6 – Polish & QA (Day 6)

| # | Task | Conventional Commit | Testing Checklist | Docs |
|6.1|Add i18n for panel UI (en, es) | `feat(i18n): add spanish locale` | Switch locale → labels update | Translation file |
|6.2|Responsive design adjustments | `fix(ui): mobile panel layout` | Percy screenshot diff | Styleguide update |
|6.3|Performance budget (<2 s panel load) | `perf(ui): code-split & lazy` | Lighthouse <2 s | Perf report |
|6.4|Finalize unit & integration coverage ≥ 90 % | `test(coverage): improve tests` | Jest `--coverage` | Coverage badge |
|6.5|Doc pass – update README, diagrams | `docs(readme): refresh architecture` | Docs build passes | All docs |

---

## Phase 7 – Submission Prep (Day 7)

| # | Task | Conventional Commit | Testing Checklist | Docs |
|7.1|Record 3-minute demo video | `chore(marketing): add demo video` | Video plays | `/docs/demo.mp4` |
|7.2|Create launch plan & slide deck | `docs(pitch): add launch deck` | Spellcheck | slides link |
|7.3|Package sample code for judges | `chore(release): tag v0.1.0` | `pnpm build` artefacts | Release notes |

---

### Continuous Testing Matrix
• **Unit** – Jest + ts-jest for functions/components.
• **Integration** – Express Add-on SDK mocked + Cloudflare Worker.
• **E2E** – Playwright scripted through Adobe Express Code Playground.
• **Accessibility** – axe-core on panel.
• **Visual** – Percy screenshot diff for panel states.

### Documentation Duties
Every feature PR must add or update:
1. `docs/` markdown page.
2. Storybook stories (UI components).
3. API reference (`openapi.yaml` for services).
4. Diagram (`/docs/diagrams/*.drawio`).

---
_End of plan_