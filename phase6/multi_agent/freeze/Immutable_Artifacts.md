# Immutable Artifacts

By order of the Governance Board, the following assets are designated as immutable:

1. **The PyTest Suite:** No tests may be altered to artificially pass in future phases.
2. **The Reducer Logic:** `append_to_list` and `merge_dicts` in `state.py` are mathematically sound and locked.
3. **The Agent Registry:** The DI factory pattern must not be subverted.
4. **The Base Agent:** Security hooks must never be removed or bypassed.
