# Code review: `noa/refund` (refund calculation for cancelled orders)

**Reviewer:** zilberberg-batya
**Branch reviewed:** `noa/refund` (commits 61bfedd, f7e8785), checked out in its own worktree.
**Verdict: not ready to merge.** `node tests/run.js` fails on this branch: 3 passed, 4 failed.

## What I ran

```
node tests/run.js
  refund.test.js
    ✗ refund for 1 ticket   expected 315 but got 325.8
    ✗ refund for 2 tickets  expected 630 but got 651.6
```

The two `format.test.js` failures also appear here, but they are not caused by this branch:
the branch was created before the price-formatting hotfix landed on `main` (commit bbca597).
They will disappear once `main` is merged into the branch.

## Findings

1. **The refund includes the service fee, contrary to the spec and to Noa's own comment** (`js/refund.js`, `calcRefund`).
   The header comment says the customer gets back 90% of the *ticket price* and the service fee is *not* refunded,
   and the tests expect exactly that (1 ticket → 315 = 350 × 0.9). The code computes
   `qty * (TICKET_PRICE + SERVICE_FEE) * REFUND_RATE`, so the 12 ₪ fee is refunded at 90% too
   (1 ticket → 325.8). Fix: `qty * TICKET_PRICE * REFUND_RATE`.
   "It works on my machine" is not confirmed: the tests on the branch itself fail.

2. **No validation of `qty`.** `calcRefund(0)` returns 0 and `calcRefund(-2)` returns a negative refund.
   `pricing.calcTotal` is getting `null` for invalid quantities on `feature/early-access`; the refund should
   follow the same convention or at least reject `qty < 1`.

3. **Refund ignores discounts.** A member or student who paid a discounted ticket price would be refunded 90% of the
   full 350 ₪, i.e. more than they paid. `calcRefund` should take the amount actually paid (or the discount flags)
   rather than assuming the list price. Worth agreeing with product before merging.

4. **Test coverage is thin.** Only two happy-path cases. Add: invalid quantity, a discounted order, and a check that
   the fee is excluded explicitly.

5. **Commit messages** are short but acceptable ("feat: refund calculation for cancelled orders", "test: refund tests").

## Requested before merge

- Fix the formula (finding 1) and make `tests/refund.test.js` pass.
- Decide on invalid-quantity and discount behaviour (findings 2 and 3) and add tests.
- Merge `main` into the branch to pick up the formatting hotfix, then rerun the full suite.

Not merged to `main`.
