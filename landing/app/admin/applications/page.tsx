"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { adminApi, type Application } from "@/lib/adminApi"

const statusTabs = ["pending", "approved", "rejected"] as const
const typeTabs = ["all", "driver", "restaurant"] as const

function DocLink({ label, url }: { label: string; url?: string }) {
  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
      {label}
    </a>
  )
}

const IMAGE_URL_RE = /\.(jpe?g|png|webp|heic|gif)$/i

// Shows image documents as a clickable thumbnail (opens the full-size image in
// a new tab) so admins can actually judge clarity/legibility inline, instead
// of only a bare link. Non-image uploads (PDF/Word) fall back to DocLink.
function DocPreview({ label, url }: { label: string; url?: string }) {
  if (!url) return null
  if (!IMAGE_URL_RE.test(url)) return <DocLink label={label} url={url} />
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={label} className="h-32 w-full rounded-lg border border-border object-cover" />
    </a>
  )
}

function ApplicationDetail({ app }: { app: Application }) {
  const fields: Array<[string, string | number | undefined]> =
    app.applicationType === "driver"
      ? [
          ["Vehicle type", app.vehicleType],
          ["Vehicle", `${app.vehicleMake ?? ""} ${app.vehicleModel ?? ""} ${app.vehicleYear ?? ""}`.trim()],
          ["Registration", app.vehicleReg],
          ["Colour", app.vehicleColour],
          ["ID number", app.idNumber],
          ["Date of birth", app.dateOfBirth],
          ["Experience", app.yearsExperience != null ? `${app.yearsExperience} years` : undefined],
          ["PrDP number", app.prdpNumber],
          ["PrDP expiry", app.prdpExpiry],
          ["Emergency contact", app.emergencyContactName],
          ["Emergency phone", app.emergencyContactPhone],
          ["Background check consent", app.criminalRecordConsent ? "Given" : "Not given"],
          ["Bank", app.bankName],
          ["Account no.", app.bankAccountNo],
          ["Account holder", app.bankHolder],
          ["Account type", app.bankAccountType],
        ]
      : [
          ["Trading name", app.tradingName],
          ["Business reg. no.", app.businessRegNo],
          ["Cuisine type", app.cuisineType],
          ["Address", app.address],
          ["City", app.city],
        ]

  return (
    <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border pt-3 text-sm sm:grid-cols-3">
      {fields
        .filter(([, v]) => v)
        .map(([label, value]) => (
          <div key={label}>
            <p className="text-muted-foreground">{label}</p>
            <p className="text-foreground">{value}</p>
          </div>
        ))}
      {app.rejectionReason && (
        <div className="col-span-full">
          <p className="text-muted-foreground">Rejection reason</p>
          <p className="text-foreground">{app.rejectionReason}</p>
        </div>
      )}
      {(app.idDocumentUrl || app.driversLicenseUrl || app.vehicleRegistrationUrl || app.vehiclePhotoUrl || app.licensePlatePhotoUrl || app.businessDocUrl) && (
        <div className="col-span-full grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 md:grid-cols-5">
          <DocPreview label="ID document" url={app.idDocumentUrl} />
          <DocPreview label="Driver's license" url={app.driversLicenseUrl} />
          <DocPreview label="Vehicle registration" url={app.vehicleRegistrationUrl} />
          <DocPreview label="Vehicle photo" url={app.vehiclePhotoUrl} />
          <DocPreview label="License plate photo" url={app.licensePlatePhotoUrl} />
          <DocPreview label="Business document" url={app.businessDocUrl} />
        </div>
      )}
    </div>
  )
}

export default function ApplicationsPage() {
  const [status, setStatus] = useState<(typeof statusTabs)[number]>("pending")
  const [type, setType] = useState<(typeof typeTabs)[number]>("all")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-applications", type, status],
    queryFn: () => adminApi.getApplications({ type, status }),
  })

  const approve = useMutation({
    mutationFn: ({ id, applicationType }: { id: string; applicationType: "driver" | "restaurant" }) =>
      adminApi.approveApplication(id, applicationType),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-applications"] }),
  })

  const reject = useMutation({
    mutationFn: ({ id, applicationType, reason }: { id: string; applicationType: "driver" | "restaurant"; reason?: string }) =>
      adminApi.rejectApplication(id, applicationType, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] })
      setRejectingId(null)
      setReason("")
    },
  })

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-foreground">Applications</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {typeTabs.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              type === t ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="mx-1 self-center text-muted-foreground">·</span>
        {statusTabs.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              status === s ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-6 text-sm text-destructive">{(error as Error).message}</p>}
      {data && data.length === 0 && <p className="mt-6 text-sm text-muted-foreground">No {status} applications.</p>}

      <div className="mt-4 space-y-3">
        {data?.map((app) => (
          <div key={app.id} className="rounded-xl border border-border bg-background p-4">
            <button className="flex w-full items-center justify-between text-left" onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
              <div>
                <p className="font-medium text-foreground">
                  {app.firstName} {app.lastName}
                  {app.tradingName ? ` — ${app.tradingName}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {app.email} · {app.phone}
                  {app.incompleteSignup ? " · Incomplete signup" : ""}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Not submitted"}
              </p>
            </button>

            {expanded === app.id && <ApplicationDetail app={app} />}

            {status === "pending" && !app.incompleteSignup && (
              <div className="mt-3 flex gap-2 border-t border-border pt-3">
                <Button size="sm" onClick={() => approve.mutate({ id: app.id, applicationType: app.applicationType })} disabled={approve.isPending}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setRejectingId(rejectingId === app.id ? null : app.id)}>
                  Reject
                </Button>
              </div>
            )}

            {rejectingId === app.id && (
              <div className="mt-3 flex gap-2">
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-ring"
                />
                <Button size="sm" variant="destructive" onClick={() => reject.mutate({ id: app.id, applicationType: app.applicationType, reason })} disabled={reject.isPending}>
                  Confirm reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
