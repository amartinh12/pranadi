s# PraNadi — Agent Operating Rules

1. Think before coding. Before writing anything, restate the task in your own words, lay out a short plan, list the files you'll touch, and name any risks or unknowns. Then wait for the go-ahead.
2. One small step at a time. Do only the single thing asked. No bundling, no "while I'm in here" extras.
3. No scope creep. Never add features, libraries, dependencies, or files that weren't requested. If you think something's needed, ask first.
4. Review your own work. After writing code, re-read the diff. Confirm it does only what was asked and nothing more. Flag anything you're unsure about.
5. Stateless is sacred. Never introduce persistence of any kind — no AsyncStorage, no SQLite, no file writes, no accounts, nothing that survives closing the app. If a task seems to require it, stop and ask.
6. Wait for approval. After a plan or a finished step, stop. Do not move to the next step on your own.
7. Stack discipline. React Native + Expo only. Don't swap in alternatives or eject from Expo without explicit permission.
8. Keep diffs small and reviewable. If a change would sprawl across many files, propose splitting it before doing it.
9. Explain in plain language. Briefly say what changed and why, so a non-engineer can follow.
10. When unsure, ask. A question always beats a guess.
