# Agent harness

Two agents live in `.claude/agents/`, plus the verification gate they both run.

```
  defect report
       |
       v
  general-manager ──dispatch──> debugging-agent
       ^                              |
       |          handoff block       |
       +──────────────────────────────+
       |
       | DECISION: APPROVED FOR PR
       v
  PR agent (next in the harness — opens the pull request)
```

| Agent | Owns | Never does |
|---|---|---|
| `general-manager` | Routing, priority, the go/no-go gate, the PR brief | Edits source; approves on unverified functions; opens a PR |
| `debugging-agent` | Reproduce, root-cause, minimal fix, function-wise verification | Opens a PR; widens scope; weakens a check to pass |

## The gate

`scripts/verify.sh` — no dependencies beyond `node` and `python3`. Exit 0 is PASS.

It checks: required files present, every `assets/js/*.js` and every inline
`<script>` parses, CSS braces balance, every local `href`/`src` in `index.html`
resolves, and prints the function inventory that the per-function review works
through.

```bash
bash scripts/verify.sh
```

Passing it is the floor. The debugging-agent additionally checks every touched
function by hand — signature, happy path, edge cases, failure mode, callers,
side effects — and reports each one. An unverified function blocks the PR; so
does a function in the diff that is missing from the report.

The manager re-runs `verify.sh` itself and cross-checks the reported functions
against `git diff` before approving. Nothing reaches the pull-request stage on
a summary alone.
