// Stub for Node's `crypto` module, referenced only inside a Node-only code
// path in @insforge/sdk (guarded by `process.versions?.node`, which is never
// true in React Native) — this file is never actually executed at runtime,
// it just satisfies Metro's static bundling of the dynamic import().
module.exports = {};
