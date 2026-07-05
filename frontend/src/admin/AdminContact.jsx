import { useEffect, useMemo, useState } from "react";
import { contactAPI } from "../services/api";

const accent = "#0BB80F";

const emptyEditor = {
  isRead: false,
  isReplied: false,
  adminNotes: "",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminContact() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editor, setEditor] = useState(emptyEditor);
  const [filter, setFilter] = useState("all");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [pageError, setPageError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 3000);
  };

  const counts = useMemo(() => {
    const unread = submissions.filter((item) => !item.isRead).length;
    const replied = submissions.filter((item) => item.isReplied).length;
    return {
      total: submissions.length,
      unread,
      replied,
      pending: submissions.length - replied,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (filter === "unread") return submissions.filter((item) => !item.isRead);
    if (filter === "replied") return submissions.filter((item) => item.isReplied);
    if (filter === "pending") return submissions.filter((item) => !item.isReplied);
    return submissions;
  }, [filter, submissions]);

  const fetchSubmissions = async (keepSelected = true) => {
    setLoadingList(true);
    setPageError("");

    try {
      const data = await contactAPI.getAll();
      const nextSubmissions = data.submissions || [];
      setSubmissions(nextSubmissions);

      if (!keepSelected) {
        setSelectedId("");
        setSelectedSubmission(null);
        setEditor(emptyEditor);
        return;
      }

      if (nextSubmissions.length === 0) {
        setSelectedId("");
        setSelectedSubmission(null);
        setEditor(emptyEditor);
        return;
      }

      const stillExists = nextSubmissions.some((item) => item._id === selectedId);
      const nextSelectedId = stillExists ? selectedId : nextSubmissions[0]._id;

      if (!selectedId || !stillExists) {
        setSelectedId(nextSelectedId);
      }
    } catch (error) {
      setPageError(error.message || "Failed to load contact submissions.");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchSubmissionDetail = async (id) => {
    if (!id) return;

    setLoadingDetail(true);
    try {
      const data = await contactAPI.getOne(id);
      const submission = data.submission;
      setSelectedSubmission(submission);
      setEditor({
        isRead: !!submission.isRead,
        isReplied: !!submission.isReplied,
        adminNotes: submission.adminNotes || "",
      });
      setSubmissions((current) =>
        current.map((item) => (item._id === submission._id ? submission : item))
      );
    } catch (error) {
      setPageError(error.message || "Failed to load submission details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(false);
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchSubmissionDetail(selectedId);
    }
  }, [selectedId]);

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    setPageError("");

    try {
      const data = await contactAPI.update(selectedId, editor);
      setSelectedSubmission(data.submission);
      setSubmissions((current) =>
        current.map((item) => (item._id === data.submission._id ? data.submission : item))
      );
      showToast("success", "Submission updated.");
    } catch (error) {
      showToast("error", error.message || "Failed to update submission.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await contactAPI.delete(id);
      const nextSubmissions = submissions.filter((item) => item._id !== id);
      setSubmissions(nextSubmissions);

      if (selectedId === id) {
        const nextSelected = nextSubmissions[0]?._id || "";
        setSelectedId(nextSelected);
        if (!nextSelected) {
          setSelectedSubmission(null);
          setEditor(emptyEditor);
        }
      }

      showToast("success", "Submission deleted.");
    } catch (error) {
      showToast("error", error.message || "Failed to delete submission.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div style={s.page}>
      {toast && (
        <div
          style={{
            ...s.toast,
            ...(toast.type === "success" ? s.toastSuccess : s.toastError),
          }}
        >
          {toast.msg}
        </div>
      )}

      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>
            CONTACT <span style={{ color: accent }}>INBOX</span>
          </h1>
          <p style={s.pageSubtitle}>
            Track incoming leads, add notes, and mark follow-ups in one place.
          </p>
        </div>
        <button style={s.primaryBtn} onClick={() => fetchSubmissions(true)} disabled={loadingList}>
          {loadingList ? "Refreshing..." : "Refresh Inbox"}
        </button>
      </div>

      <div style={s.statsGrid}>
        <StatCard label="Total Inquiries" value={counts.total} />
        <StatCard label="Unread" value={counts.unread} highlight />
        <StatCard label="Replied" value={counts.replied} />
        <StatCard label="Pending" value={counts.pending} />
      </div>

      {pageError && <div style={s.pageError}>{pageError}</div>}

      <div style={s.layout}>
        <section style={s.sidebarCard}>
          <div style={s.sidebarHeader}>
            <h2 style={s.cardTitle}>Submissions</h2>
            <div style={s.filterRow}>
              {["all", "unread", "pending", "replied"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  style={{
                    ...s.filterBtn,
                    ...(filter === item ? s.filterBtnActive : {}),
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div style={s.listWrap}>
            {loadingList ? (
              <div style={s.emptyState}>Loading contact submissions...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div style={s.emptyState}>No submissions found for this filter.</div>
            ) : (
              filteredSubmissions.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setSelectedId(item._id)}
                  style={{
                    ...s.listItem,
                    ...(selectedId === item._id ? s.listItemActive : {}),
                  }}
                >
                  <div style={s.listTop}>
                    <span style={s.listName}>{item.name}</span>
                    {!item.isRead && <span style={s.unreadDot} />}
                  </div>
                  <div style={s.listMeta}>{item.subject}</div>
                  <div style={s.listMeta}>{item.email}</div>
                  <div style={s.listFooter}>
                    <span style={item.isReplied ? s.statusDone : s.statusPending}>
                      {item.isReplied ? "Replied" : "Pending"}
                    </span>
                    <span style={s.dateText}>{formatDate(item.createdAt)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section style={s.detailCard}>
          {!selectedId ? (
            <div style={s.emptyDetail}>
              Select a contact submission to view the full message and manage follow-up.
            </div>
          ) : loadingDetail && !selectedSubmission ? (
            <div style={s.emptyDetail}>Loading message...</div>
          ) : selectedSubmission ? (
            <>
              <div style={s.detailHeader}>
                <div>
                  <h2 style={s.detailTitle}>{selectedSubmission.subject}</h2>
                  <p style={s.detailSub}>
                    From {selectedSubmission.name} on {formatDate(selectedSubmission.createdAt)}
                  </p>
                </div>
                <div style={s.actionRow}>
                  <button
                    type="button"
                    style={s.ghostBtn}
                    onClick={() => handleDelete(selectedSubmission._id)}
                    disabled={deletingId === selectedSubmission._id}
                  >
                    {deletingId === selectedSubmission._id ? "Deleting..." : "Delete"}
                  </button>
                  <button type="button" style={s.primaryBtn} onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div style={s.infoGrid}>
                <InfoCard label="Name" value={selectedSubmission.name} />
                <InfoCard label="Email" value={selectedSubmission.email} />
                <InfoCard label="Phone" value={selectedSubmission.phone || "Not provided"} />
                <InfoCard
                  label="Status"
                  value={`${editor.isRead ? "Read" : "Unread"} • ${editor.isReplied ? "Replied" : "Pending"}`}
                />
              </div>

              <div style={s.messageBox}>
                <div style={s.sectionLabel}>Message</div>
                <p style={s.messageText}>{selectedSubmission.message}</p>
              </div>

              <div style={s.editorGrid}>
                <label style={s.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={editor.isRead}
                    onChange={(e) =>
                      setEditor((current) => ({ ...current, isRead: e.target.checked }))
                    }
                  />
                  <span>Marked as read</span>
                </label>

                <label style={s.checkboxCard}>
                  <input
                    type="checkbox"
                    checked={editor.isReplied}
                    onChange={(e) =>
                      setEditor((current) => ({ ...current, isReplied: e.target.checked }))
                    }
                  />
                  <span>Client has been replied to</span>
                </label>
              </div>

              <div style={s.notesWrap}>
                <label style={s.sectionLabel}>Admin Notes</label>
                <textarea
                  style={s.textarea}
                  rows={7}
                  placeholder="Add internal follow-up notes, call summary, budget details, next steps..."
                  value={editor.adminNotes}
                  onChange={(e) =>
                    setEditor((current) => ({ ...current, adminNotes: e.target.value }))
                  }
                />
              </div>
            </>
          ) : (
            <div style={s.emptyDetail}>Unable to load the selected submission.</div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }) {
  return (
    <div
      style={{
        ...s.statCard,
        ...(highlight ? s.statCardHighlight : {}),
      }}
    >
      <div style={s.statValue}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div style={s.infoCard}>
      <div style={s.infoLabel}>{label}</div>
      <div style={s.infoValue}>{value}</div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    paddingBottom: 48,
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 50,
    padding: "12px 18px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    border: "1px solid transparent",
  },
  toastSuccess: {
    background: "rgba(11,184,15,0.12)",
    color: "#86efac",
    borderColor: "rgba(11,184,15,0.25)",
  },
  toastError: {
    background: "rgba(248,113,113,0.12)",
    color: "#fca5a5",
    borderColor: "rgba(248,113,113,0.25)",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    padding: "40px 32px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  pageTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    fontStyle: "italic",
    letterSpacing: "-0.5px",
  },
  pageSubtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: 13,
  },
  primaryBtn: {
    padding: "12px 24px",
    borderRadius: 999,
    border: "none",
    background: accent,
    color: "#000",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },
  ghostBtn: {
    padding: "12px 18px",
    borderRadius: 999,
    border: "1px solid rgba(239,68,68,0.25)",
    background: "transparent",
    color: "#f87171",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    padding: "24px 32px 0",
  },
  statCard: {
    padding: 20,
    borderRadius: 18,
    background: "#111",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  statCardHighlight: {
    boxShadow: "0 0 0 1px rgba(11,184,15,0.2) inset",
    background: "linear-gradient(180deg, rgba(11,184,15,0.12), rgba(17,17,17,1))",
  },
  statValue: {
    fontSize: 30,
    fontWeight: 900,
    lineHeight: 1,
  },
  statLabel: {
    marginTop: 10,
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  pageError: {
    margin: "20px 32px 0",
    padding: "12px 16px",
    borderRadius: 12,
    background: "rgba(248,113,113,0.08)",
    color: "#fca5a5",
    border: "1px solid rgba(248,113,113,0.18)",
    fontSize: 13,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "360px minmax(0, 1fr)",
    gap: 20,
    padding: "24px 32px 0",
  },
  sidebarCard: {
    borderRadius: 22,
    background: "#111",
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    minHeight: 620,
  },
  detailCard: {
    borderRadius: 22,
    background: "#111",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: 24,
    minHeight: 620,
  },
  sidebarHeader: {
    padding: "22px 20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    fontStyle: "italic",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  filterBtn: {
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "transparent",
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    cursor: "pointer",
  },
  filterBtnActive: {
    background: `${accent}18`,
    borderColor: "rgba(11,184,15,0.25)",
    color: accent,
  },
  listWrap: {
    display: "flex",
    flexDirection: "column",
    maxHeight: 700,
    overflowY: "auto",
  },
  listItem: {
    textAlign: "left",
    padding: "18px 20px",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    cursor: "pointer",
    color: "#fff",
  },
  listItemActive: {
    background: "rgba(255,255,255,0.03)",
    boxShadow: `inset 3px 0 0 ${accent}`,
  },
  listTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  listName: {
    fontWeight: 800,
    fontSize: 14,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: accent,
    flexShrink: 0,
  },
  listMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#9ca3af",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  listFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
  statusPending: {
    display: "inline-flex",
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(250,204,21,0.12)",
    color: "#facc15",
    fontSize: 11,
    fontWeight: 700,
  },
  statusDone: {
    display: "inline-flex",
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(11,184,15,0.12)",
    color: "#86efac",
    fontSize: 11,
    fontWeight: 700,
  },
  dateText: {
    fontSize: 11,
    color: "#6b7280",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  detailTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: "-0.4px",
  },
  detailSub: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#9ca3af",
  },
  actionRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 14,
    marginTop: 22,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    background: "#0c0c0c",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  infoLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#6b7280",
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 14,
    color: "#fff",
    wordBreak: "break-word",
  },
  messageBox: {
    marginTop: 22,
    padding: 18,
    borderRadius: 18,
    background: "#0c0c0c",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  sectionLabel: {
    display: "block",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#6b7280",
    marginBottom: 10,
    fontWeight: 700,
  },
  messageText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.7,
    color: "#e5e7eb",
    whiteSpace: "pre-wrap",
  },
  editorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  checkboxCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    background: "#0c0c0c",
    border: "1px solid rgba(255,255,255,0.05)",
    fontSize: 13,
    color: "#e5e7eb",
  },
  notesWrap: {
    marginTop: 18,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 16,
    background: "#0a0a0a",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    resize: "vertical",
    outline: "none",
    fontSize: 14,
    lineHeight: 1.6,
  },
  emptyState: {
    padding: 24,
    color: "#6b7280",
    fontSize: 13,
  },
  emptyDetail: {
    minHeight: 420,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#6b7280",
    padding: 24,
    fontSize: 14,
  },
};
