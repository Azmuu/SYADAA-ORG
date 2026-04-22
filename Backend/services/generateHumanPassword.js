import crypto from "crypto";

/** Short friendly words — letters only, easy to read and type like a normal passphrase. */
const ADJECTIVES = [
  "happy",
  "bright",
  "swift",
  "calm",
  "lucky",
  "gentle",
  "noble",
  "sunny",
  "merry",
  "brave",
  "cozy",
  "clever",
  "kind",
  "sweet",
  "warm",
  "quiet",
  "fresh",
  "vivid",
  "sturdy",
  "humble",
  "golden",
  "silver",
  "peaceful",
  "lively",
  "smooth",
  "rapid",
  "grand",
];

const NOUNS = [
  "river",
  "meadow",
  "garden",
  "forest",
  "harbor",
  "summit",
  "breeze",
  "maple",
  "canyon",
  "orchid",
  "falcon",
  "pebble",
  "amber",
  "willow",
  "spruce",
  "coral",
  "linen",
  "oasis",
  "harvest",
  "violet",
  "cedar",
  "birch",
  "cloud",
  "stone",
  "bridge",
  "horizon",
  "lantern",
  "compass",
];

function pick(list) {
  return list[crypto.randomInt(0, list.length)];
}

function titleCase(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Normal-looking password: two title-case words + 4 digits (e.g. `SunnyHarbor2847`).
 * Only letters and numbers — no symbols. Used for member portal accounts (bcrypt).
 */
export function generateHumanReadablePassword() {
  let adj = pick(ADJECTIVES);
  let noun = pick(NOUNS);
  if (adj === noun) noun = pick(NOUNS);
  const digits = String(crypto.randomInt(0, 10000)).padStart(4, "0");
  return `${titleCase(adj)}${titleCase(noun)}${digits}`;
}
