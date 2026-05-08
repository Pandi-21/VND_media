import React, { useEffect, useRef, useState } from "react";

const accent = "#0BB80F";
const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;
const SITE_BASE = API_ROOT.endsWith("/api") ? API_ROOT.slice(0, -4) : API_ROOT;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("vnd_admin_token")}`,
});

const resolveAssetUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${SITE_BASE}${url}`;
};

const AdminAbout = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    photo: null,
    photoPreview: null,
  });
  const [teamError, setTeamError] = useState("");
  const [teamSaving, setTeamSaving] = useState(false);
  const [teamDeletingId, setTeamDeletingId] = useState("");
  const teamPhotoRef = useRef(null);

  const [clients, setClients] = useState([]);
  const [clientForm, setClientForm] = useState({
    name: "",
    company: "",
    video: null,
    videoName: "",
  });
  const [clientError, setClientError] = useState("");
  const [clientSaving, setClientSaving] = useState(false);
  const [clientDeletingId, setClientDeletingId] = useState("");
  const clientVideoRef = useRef(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 3500);
  };

  const fetchAboutData = async () => {
    setPageLoading(true);
    setPageError("");

    try {
      const res = await fetch(`${API_BASE}/about`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch about data.");
      }

      setTeamMembers(data.data?.teamMembers || []);
      setClients(data.data?.testimonials || []);
    } catch (error) {
      setPageError(error.message || "Failed to load about data.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleTeamPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setTeamError("Only image files are allowed.");
      if (teamPhotoRef.current) teamPhotoRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setTeamError("Photo must be under 5 MB.");
      if (teamPhotoRef.current) teamPhotoRef.current.value = "";
      return;
    }

    setTeamError("");
    setTeamForm((current) => ({
      ...current,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    }));
  };

  const handleAddTeamMember = async () => {
    if (!teamForm.name.trim()) {
      setTeamError("Member name is required.");
      return;
    }
    if (!teamForm.role.trim()) {
      setTeamError("Role is required.");
      return;
    }
    if (!teamForm.photo) {
      setTeamError("Please upload a photo.");
      return;
    }

    setTeamError("");
    setTeamSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", teamForm.name.trim());
      formData.append("role", teamForm.role.trim());
      formData.append("photo", teamForm.photo);
      formData.append("order", String(teamMembers.length));

      const res = await fetch(`${API_BASE}/about/admin/team`, {
        method: "POST",
        headers: authHeader(),
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add team member.");
      }

      setTeamMembers((current) => [...current, data.member]);
      setTeamForm({ name: "", role: "", photo: null, photoPreview: null });
      if (teamPhotoRef.current) teamPhotoRef.current.value = "";
      showToast("success", "Team member added successfully.");
    } catch (error) {
      setTeamError(error.message || "Failed to add team member.");
    } finally {
      setTeamSaving(false);
    }
  };

  const handleRemoveTeam = async (id) => {
    setTeamDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/about/admin/team/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete team member.");
      }

      setTeamMembers((current) => current.filter((member) => member._id !== id));
      showToast("success", "Team member removed.");
    } catch (error) {
      showToast("error", error.message || "Failed to delete team member.");
    } finally {
      setTeamDeletingId("");
    }
  };

  const handleClientVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setClientError("Only video files are allowed.");
      if (clientVideoRef.current) clientVideoRef.current.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setClientError("Video must be under 50 MB.");
      if (clientVideoRef.current) clientVideoRef.current.value = "";
      return;
    }

    setClientError("");
    setClientForm((current) => ({
      ...current,
      video: file,
      videoName: file.name,
    }));
  };

  const handleAddClient = async () => {
    if (!clientForm.name.trim()) {
      setClientError("Client name is required.");
      return;
    }
    if (!clientForm.company.trim()) {
      setClientError("Company name is required.");
      return;
    }
    if (!clientForm.video) {
      setClientError("Please upload a video.");
      return;
    }

    setClientError("");
    setClientSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", clientForm.name.trim());
      formData.append("company", clientForm.company.trim());
      formData.append("video", clientForm.video);
      formData.append("order", String(clients.length));

      const res = await fetch(`${API_BASE}/about/admin/testimonials`, {
        method: "POST",
        headers: authHeader(),
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add client video.");
      }

      setClients((current) => [...current, data.testimonial]);
      setClientForm({ name: "", company: "", video: null, videoName: "" });
      if (clientVideoRef.current) clientVideoRef.current.value = "";
      showToast("success", "Client testimonial added successfully.");
    } catch (error) {
      setClientError(error.message || "Failed to add client video.");
    } finally {
      setClientSaving(false);
    }
  };

  const handleRemoveClient = async (id) => {
    setClientDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/about/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete testimonial.");
      }

      setClients((current) => current.filter((client) => client._id !== id));
      showToast("success", "Client testimonial removed.");
    } catch (error) {
      showToast("error", error.message || "Failed to delete testimonial.");
    } finally {
      setClientDeletingId("");
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
            ABOUT <span style={{ color: accent }}>MANAGER</span>
          </h1>
          <p style={s.pageSubtitle}>
            {teamMembers.length} team member{teamMembers.length !== 1 ? "s" : ""}
            {" · "}
            {clients.length} client video{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button style={s.saveBtn} onClick={fetchAboutData} disabled={pageLoading}>
          {pageLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {pageError && <div style={s.pageError}>{pageError}</div>}

      <section style={s.card}>
        <div style={s.cardHeader}>
          <h2 style={s.cardTitle}>
            TEAM <span style={{ color: accent }}>MEMBERS</span>
          </h2>
          <p style={s.cardDesc}>Upload team photos, then the public About page will show them.</p>
        </div>

        <div style={s.formRow}>
          <div
            style={{
              ...s.uploadBox,
              borderColor: teamForm.photoPreview ? accent : "rgba(255,255,255,0.1)",
            }}
            onClick={() => teamPhotoRef.current?.click()}
          >
            {teamForm.photoPreview ? (
              <img src={teamForm.photoPreview} alt="preview" style={s.photoPreview} />
            ) : (
              <>
                <div style={s.uploadIcon}>Photo</div>
                <p style={s.uploadLabel}>Click to upload photo</p>
                <p style={s.uploadHint}>Max 5 MB · JPG, PNG, WEBP</p>
              </>
            )}
            <input
              ref={teamPhotoRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleTeamPhotoChange}
            />
          </div>

          <div style={s.fields}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Full Name *</label>
              <input
                style={s.input}
                placeholder="e.g. Karthik Rajan"
                value={teamForm.name}
                onChange={(e) => setTeamForm((current) => ({ ...current, name: e.target.value }))}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Role / Designation *</label>
              <input
                style={s.input}
                placeholder="e.g. Senior Designer"
                value={teamForm.role}
                onChange={(e) => setTeamForm((current) => ({ ...current, role: e.target.value }))}
              />
            </div>
            {teamError && <p style={s.error}>{teamError}</p>}
            <button style={s.addBtn} onClick={handleAddTeamMember} disabled={teamSaving}>
              {teamSaving ? "Saving..." : "+ Add Member"}
            </button>
          </div>
        </div>

        {pageLoading ? (
          <div style={s.emptyState}>Loading team members...</div>
        ) : teamMembers.length > 0 ? (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={{ ...s.th, textAlign: "left" }}>Member</th>
                  <th style={s.th}>Role</th>
                  <th style={s.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member._id} style={s.tr}>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={resolveAssetUrl(member.photoUrl)}
                          alt={member.name}
                          style={s.tableAvatar}
                        />
                        <span style={{ fontWeight: 700, color: "#fff" }}>{member.name}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: "center", color: "#9ca3af" }}>{member.role}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <button
                        style={s.deleteBtn}
                        onClick={() => handleRemoveTeam(member._id)}
                        disabled={teamDeletingId === member._id}
                      >
                        {teamDeletingId === member._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={s.emptyState}>No team members added yet.</div>
        )}
      </section>

      <section style={s.card}>
        <div style={s.cardHeader}>
          <h2 style={s.cardTitle}>
            CLIENT <span style={{ color: accent }}>TESTIMONIALS</span>
          </h2>
          <p style={s.cardDesc}>Upload client videos and they will show on the public About page.</p>
        </div>

        <div style={s.formRow}>
          <div
            style={{
              ...s.uploadBox,
              borderColor: clientForm.videoName ? accent : "rgba(255,255,255,0.1)",
              background: clientForm.videoName ? `${accent}12` : "#111",
            }}
            onClick={() => clientVideoRef.current?.click()}
          >
            {clientForm.videoName ? (
              <>
                <div style={s.uploadIcon}>Video</div>
                <p style={{ ...s.uploadLabel, color: accent }}>Video selected</p>
                <p style={{ ...s.uploadHint, wordBreak: "break-all" }}>{clientForm.videoName}</p>
              </>
            ) : (
              <>
                <div style={s.uploadIcon}>Video</div>
                <p style={s.uploadLabel}>Click to upload video</p>
                <p style={s.uploadHint}>Max 50 MB · MP4, MOV, WEBM</p>
              </>
            )}
            <input
              ref={clientVideoRef}
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleClientVideoChange}
            />
          </div>

          <div style={s.fields}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Client Name *</label>
              <input
                style={s.input}
                placeholder="e.g. Priya Sharma"
                value={clientForm.name}
                onChange={(e) => setClientForm((current) => ({ ...current, name: e.target.value }))}
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Company Name *</label>
              <input
                style={s.input}
                placeholder="e.g. TechNova Pvt Ltd"
                value={clientForm.company}
                onChange={(e) => setClientForm((current) => ({ ...current, company: e.target.value }))}
              />
            </div>
            {clientError && <p style={s.error}>{clientError}</p>}
            <button style={s.addBtn} onClick={handleAddClient} disabled={clientSaving}>
              {clientSaving ? "Saving..." : "+ Add Client"}
            </button>
          </div>
        </div>

        {pageLoading ? (
          <div style={s.emptyState}>Loading client videos...</div>
        ) : clients.length > 0 ? (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={{ ...s.th, textAlign: "left" }}>Client</th>
                  <th style={s.th}>Company</th>
                  <th style={s.th}>File</th>
                  <th style={s.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id} style={s.tr}>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={s.videoThumb}>VID</div>
                        <span style={{ fontWeight: 700, color: "#fff" }}>{client.name}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: "center", color: "#9ca3af" }}>{client.company}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span style={s.fileBadge}>{client.videoFilename || "Uploaded video"}</span>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <button
                        style={s.deleteBtn}
                        onClick={() => handleRemoveClient(client._id)}
                        disabled={clientDeletingId === client._id}
                      >
                        {clientDeletingId === client._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={s.emptyState}>No client videos added yet.</div>
        )}
      </section>
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    paddingBottom: 60,
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px 32px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexWrap: "wrap",
    gap: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 900,
    fontStyle: "italic",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  pageSubtitle: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 4,
  },
  saveBtn: {
    padding: "12px 28px",
    background: accent,
    color: "#000",
    border: "none",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  pageError: {
    margin: "24px 32px 0",
    padding: "12px 16px",
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.15)",
    color: "#fca5a5",
    borderRadius: 12,
    fontSize: 13,
  },
  card: {
    margin: "28px 32px 0",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "#111",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "24px 28px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 900,
    fontStyle: "italic",
    letterSpacing: "-0.3px",
    margin: "0 0 4px",
  },
  cardDesc: {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    gap: 24,
    padding: "24px 28px",
    alignItems: "start",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  uploadBox: {
    border: "2px dashed",
    borderRadius: 14,
    padding: "18px 12px",
    textAlign: "center",
    cursor: "pointer",
    background: "#111",
    transition: "all 0.2s",
    minHeight: 150,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadIcon: { fontSize: 20, fontWeight: 800, color: "#d1d5db" },
  uploadLabel: { fontSize: 12, fontWeight: 700, color: "#d1d5db", margin: 0 },
  uploadHint: { fontSize: 11, color: "#6b7280", margin: 0 },
  photoPreview: { width: "100%", height: 140, objectFit: "cover", borderRadius: 10 },
  fields: { display: "flex", flexDirection: "column", gap: 14 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  input: {
    padding: "10px 14px",
    background: "#0a0a0a",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontSize: 14,
    color: "#fff",
    outline: "none",
  },
  error: {
    color: "#f87171",
    fontSize: 12,
    margin: 0,
    padding: "8px 14px",
    background: "rgba(248,113,113,0.08)",
    borderRadius: 10,
    border: "1px solid rgba(248,113,113,0.2)",
  },
  addBtn: {
    padding: "10px 20px",
    background: accent,
    color: "#000",
    border: "none",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  thead: { borderBottom: "1px solid rgba(255,255,255,0.05)" },
  th: {
    padding: "12px 20px",
    textAlign: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td: { padding: "14px 20px", verticalAlign: "middle" },
  tableAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    objectFit: "cover",
    flexShrink: 0,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  videoThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `${accent}18`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
    color: accent,
  },
  fileBadge: {
    display: "inline-block",
    maxWidth: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "3px 8px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: 6,
    fontSize: 11,
    color: "#9ca3af",
  },
  deleteBtn: {
    padding: "6px 16px",
    background: "transparent",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#f87171",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  emptyState: {
    padding: "24px 28px",
    color: "#6b7280",
    fontSize: 13,
  },
};

export default AdminAbout;
