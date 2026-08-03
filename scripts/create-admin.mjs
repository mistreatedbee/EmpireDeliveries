#!/usr/bin/env node
// One-off tool to create a real admin-role user against the live InsForge + Express backend.
// Requires the InsForge project's public/anon key in the INSFORGE_ANON_KEY env var
// (dashboard -> API Keys). Usage:
//   INSFORGE_ANON_KEY=anon_xxx node scripts/create-admin.mjs register <email> <password>
//   INSFORGE_ANON_KEY=anon_xxx node scripts/create-admin.mjs verify <email> <otp>

const INSFORGE_URL = "https://mnf8bzhv.us-east.insforge.app";
const API_BASE_URL = "https://empire-backend-8066.onrender.com";
const ANON_KEY = process.env.INSFORGE_ANON_KEY;

const [, , cmd, email, secondArg] = process.argv;

if (!ANON_KEY) {
  console.error("Missing INSFORGE_ANON_KEY env var (get it from InsForge dashboard -> API Keys).");
  process.exit(1);
}

async function main() {
  if (cmd === "register") {
    const password = secondArg;
    const res = await fetch(`${INSFORGE_URL}/api/auth/users?client_type=mobile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON_KEY}` },
      body: JSON.stringify({ email: email.toLowerCase().trim(), password, name: "Admin User" }),
    });
    const data = await res.json();
    console.log("status:", res.status);
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (cmd === "verify") {
    const otp = secondArg;
    const verifyRes = await fetch(`${INSFORGE_URL}/api/auth/email/verify?client_type=mobile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON_KEY}` },
      body: JSON.stringify({ email: email.toLowerCase().trim(), otp }),
    });
    const verifyData = await verifyRes.json();
    console.log("verify status:", verifyRes.status);
    console.log(JSON.stringify(verifyData, null, 2));
    if (!verifyRes.ok) return;

    const { accessToken } = verifyData;
    const syncRes = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ firstName: "Admin", lastName: "User", email: email.toLowerCase().trim(), role: "admin" }),
    });
    const syncData = await syncRes.json();
    console.log("sync status:", syncRes.status);
    console.log(JSON.stringify(syncData, null, 2));

    const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meData = await meRes.json();
    console.log("me status:", meRes.status);
    console.log(JSON.stringify(meData, null, 2));
    return;
  }

  console.error("Usage: node scripts/create-admin.mjs register <email> <password>");
  console.error("       node scripts/create-admin.mjs verify <email> <otp>");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
