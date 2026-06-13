# Debug Session: add-file-save-stuck

Status: [OPEN]
Started: 2026-06-13

Symptom:
- In `Teach AI add  files`, clicking `[data-test="confirm-add-file-button"]` does not close the dialog.
- `Cancel` remains visible and `expect(cancelButton).toBeHidden()` times out.

Expected:
- Clicking `Save` starts upload/generation and the add-file dialog progresses or closes.

Current Evidence:
- Runtime failure at `tests/test-1.spec.ts` in `addTeachAiFile()`.
- `Save` button is visible.
- `Cancel` button remains visible for 30s after the click.

Hypotheses:
1. The `Save` click fires before the uploaded file is fully registered by the dialog, so submit is ignored.
2. The visible `Save` button is not the actionable state yet, even though Playwright sees it as enabled.
3. The submit starts, but the dialog intentionally stays open until generation completes, so waiting for hidden buttons is the wrong success signal.
4. Another overlay, animation, or focus issue prevents the click from triggering the actual submit handler.
5. The upload succeeds only after a distinct UI signal appears in the dialog, and the test currently misses that prerequisite.

Planned Evidence Collection:
- Inspect current error context screenshot/log.
- Add minimal instrumentation around file upload and `Save` click.
- Re-run only the single Chromium test and compare pre-fix vs post-fix behavior.
