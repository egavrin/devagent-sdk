# Review Guide

Review priorities for `devagent-sdk`:

1. Correctness
2. Regression risk
3. Contract drift
4. Test coverage
5. Docs parity

Blocking findings include:

- wire-shape changes without fixture/schema/validator updates
- loosened validation without an explicit reason
- missing downstream compatibility evidence
- docs claiming validation or compatibility that tests do not prove

PR expectations:

- keep changes narrow and protocol-focused
- include fixture updates when the protocol changes
- include test evidence for every “validated” claim
