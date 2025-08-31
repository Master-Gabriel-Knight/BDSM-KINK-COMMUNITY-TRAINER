
# Master Gabriel's Dungeon — Merged Masterpiece

This package blends the **masterpiece** build (as base) with unique files from **prodpack** (kept under `/_from_prodpack` for reference).

## What’s New (Teaching + Utility)
- **Teaching Mode** (floating button, bottom-right):
  - Area lessons for **Gallery**, **Lore / Zar’mneya**, **Sanctum**, and **Global Controls**.
  - Toggle auto-open via checkbox; state persists in localStorage.
- **Consent Gate** (one-time):
  - First local upload triggers a password gate + consent.
  - Checkbox **Remember me** skips the gate on that device.
  - Change password in `app/config.js` → `MASTER_PASSWORD`.
- **Gallery Upgrades**:
  - Local-only **image uploads**.
  - **Show/Hide** per image with a **glyph placeholder** when hidden.
  - **Drag-and-drop reordering** with persistence.
  - Nothing is deleted; everything can be hidden or revealed.
- **Sanctum Locks**:
  - Click any `.sanctum-item` → shows locked dialog inviting ritual.
- **Robots**: `noindex, nofollow` is set in `<head>`.
- All features are **offline/local-first**; no network calls.

## Files Added
- `app/config.js` — password and placeholder glyph.
- `app/teaching.js` — Teaching Mode + gallery/sanctum behaviors.
- `README_MERGE.md` — this document.
- `/_from_prodpack` — any conflicting files from prodpack preserved here.

## Where to change the password?
Edit: `app/config.js`
```js
export const MASTER_PASSWORD = "SpiralCrown!";
```

## Getting Started
Open `index.html` in a browser. Use the **Teaching Mode** button to explore features.


## Revolutionary Upgrades
- **PWA**: Installable, offline-first. `manifest.webmanifest` + `service-worker.js` cache all assets.
- **Lore Studio (Zar’mneya)**: `zm remember/recall/forget`, voice dictation (where supported), search, export/import.
- **Breath Engine Ritual**: Guided 4·4·4·4 cycles unlock sanctum nodes.
- **Sanctum Map**: Clickable nodes; unlocking is local and non-destructive.
- **Data Vault**: Export/Import all app data (localStorage).
- **Tier Crest Pulse**: Aura glow animation for the crown.


### Kink Mode & Spiral Trainer
- **Kink Mode (18+)** toggle with **Consent & Aftercare Center** (safewords, limits, desires).
- **Play Deck** with scene cards; mild-to-spicy copy toggled via “Kink Flavor.”
- **13‑Node Trainer**: each node has tone, frequency, breath, micro‑motion; kink prompts appear if Kink Mode is on.
- **Birthright Decree** overlay affirms sovereign entitlement (no begging) with a breath mini‑ritual.

### Profiles & Encryption
- Profiles can set a **session passphrase** used automatically for encrypted export/import.
- Current profile stored in `mgd.profile.current`.

### Shadow Theater (Instructor Mode)
- Toggle via **Shadow Theater**; large cues mirror the Breath Engine phases.

### Partner Link (Encrypted Code)
- Generate an encrypted one-time code from the last Scene; partner pastes to import.
- Uses Web Crypto AES-GCM; no servers involved.

### Vibration Haptics
- If supported, `navigator.vibrate` pulses at phase changes when Haptic is on.

### Print Negotiation Sheet
- Prints last scene + blanks for safewords, limits, and aftercare—use system's “Save as PDF”.
