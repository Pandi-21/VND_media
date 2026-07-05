import { useEffect, useState } from "react";
import { packageAPI } from "../services/api";

const accent = "#0BB80F";

const emptyEditor = {
  name: "",
  price: "",
  description: "",
  features: "",
  badge: "",
  isActive: true,
  order: 0,
};

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [editor, setEditor] = useState(emptyEditor);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 3000);
  };

  const fetchPackages = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await packageAPI.adminGetAll();
      setPackages(data.packages || []);
    } catch (err) {
      setError(err.message || "Failed to load packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSelect = (pkg) => {
    setIsAdding(false);
    setSelectedId(pkg._id);
    setEditor({
      name: pkg.name || "",
      price: pkg.price || "",
      description: pkg.description || "",
      features: (pkg.features || []).join("\n"),
      badge: pkg.badge || "",
      isActive: pkg.isActive !== undefined ? pkg.isActive : true,
      order: pkg.order !== undefined ? pkg.order : 0,
    });
  };

  const handleStartAdd = () => {
    setSelectedId("");
    setIsAdding(true);
    setEditor(emptyEditor);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editor.name || !editor.price || !editor.description) {
      showToast("error", "Name, Price, and Description are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...editor,
        features: editor.features.split("\n").map(f => f.trim()).filter(Boolean),
        order: Number(editor.order) || 0,
      };

      if (selectedId) {
        // Update
        const data = await packageAPI.update(selectedId, payload);
        setPackages(prev => prev.map(p => p._id === selectedId ? data.package : p));
        showToast("success", "Package updated successfully.");
      } else {
        // Create
        const data = await packageAPI.create(payload);
        setPackages(prev => [...prev, data.package]);
        showToast("success", "Package created successfully.");
      }

      // Reset
      setSelectedId("");
      setIsAdding(false);
      setEditor(emptyEditor);
    } catch (err) {
      showToast("error", err.message || "Failed to save package.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await packageAPI.delete(id);
      setPackages(prev => prev.filter(p => p._id !== id));
      if (selectedId === id) {
        setSelectedId("");
        setEditor(emptyEditor);
      }
      showToast("success", "Package deleted successfully.");
    } catch (err) {
      showToast("error", err.message || "Failed to delete package.");
    }
  };

  return (
    <div style={s.page}>
      {toast && (
        <div style={{ ...s.toast, ...(toast.type === "success" ? s.toastSuccess : s.toastError) }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>
            MANAGE <span style={{ color: accent }}>PACKAGES</span>
          </h1>
          <p style={s.pageSubtitle}>
            Configure combo packages, silver/gold plans, and target marketing deliverables.
          </p>
        </div>
        <button style={s.primaryBtn} onClick={handleStartAdd}>
          + Add New Plan
        </button>
      </div>

      {error && <div style={s.pageError}>{error}</div>}

      <div style={s.layout}>
        {/* Left Side: Packages List */}
        <section style={s.sidebarCard}>
          <div style={s.sidebarHeader}>
            <h2 style={s.cardTitle}>Combo Plans</h2>
          </div>

          <div style={s.listWrap}>
            {loading ? (
              <div style={s.emptyState}>Loading packages...</div>
            ) : packages.length === 0 ? (
              <div style={s.emptyState}>No packages configured yet. Click "+ Add New Plan" to start.</div>
            ) : (
              packages.map((pkg) => (
                <button
                  key={pkg._id}
                  type="button"
                  onClick={() => handleSelect(pkg)}
                  style={{
                    ...s.listItem,
                    ...(selectedId === pkg._id ? s.listItemActive : {}),
                  }}
                >
                  <div style={s.listTop}>
                    <span style={s.listName}>{pkg.name}</span>
                    {pkg.badge && <span style={s.badgeLabel}>{pkg.badge}</span>}
                  </div>
                  <div style={s.listMeta}>{pkg.price}</div>
                  <div style={s.listFooter}>
                    <span style={pkg.isActive ? s.statusDone : s.statusPending}>
                      {pkg.isActive ? "Active" : "Disabled"}
                    </span>
                    <span style={s.orderText}>Order: {pkg.order}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Right Side: Add / Edit Form */}
        <section style={s.detailCard}>
          {!selectedId && !isAdding ? (
            <div style={s.emptyDetail}>
              Select a plan from the list to modify it, or click "+ Add New Plan" to design a new combo package.
            </div>
          ) : (
            <form onSubmit={handleSave} style={s.form}>
              <div style={s.detailHeader}>
                <h2 style={s.detailTitle}>{selectedId ? "Edit Plan Details" : "Create New Combo Plan"}</h2>
                <div style={s.actionRow}>
                  {selectedId && (
                    <button
                      type="button"
                      style={s.ghostBtn}
                      onClick={() => handleDelete(selectedId)}
                    >
                      Delete
                    </button>
                  )}
                  <button type="submit" style={s.primaryBtn} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Plan Name *</label>
                  <input
                    type="text"
                    style={s.input}
                    placeholder="e.g. Gold Marketing Plan"
                    value={editor.name}
                    onChange={(e) => setEditor(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div style={s.formGroup}>
                  <label style={s.label}>Price Tag *</label>
                  <input
                    type="text"
                    style={s.input}
                    placeholder="e.g. ₹49,999/mo or Custom"
                    value={editor.price}
                    onChange={(e) => setEditor(p => ({ ...p, price: e.target.value }))}
                    required
                  />
                </div>

                <div style={s.formGroup}>
                  <label style={s.label}>Badge label (Optional)</label>
                  <input
                    type="text"
                    style={s.input}
                    placeholder="e.g. Popular or Best Value"
                    value={editor.badge}
                    onChange={(e) => setEditor(p => ({ ...p, badge: e.target.value }))}
                  />
                </div>

                <div style={s.formGroup}>
                  <label style={s.label}>Display Order Rank</label>
                  <input
                    type="number"
                    style={s.input}
                    placeholder="e.g. 0, 1, 2"
                    value={editor.order}
                    onChange={(e) => setEditor(p => ({ ...p, order: e.target.value }))}
                  />
                </div>
              </div>

              <div style={s.formGroup} style={{ marginTop: 16 }}>
                <label style={s.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={editor.isActive}
                    onChange={(e) => setEditor(p => ({ ...p, isActive: e.target.checked }))}
                  />
                  <span style={{ marginLeft: 8 }}>Active / Show on Website</span>
                </label>
              </div>

              <div style={s.formGroup} style={{ marginTop: 16 }}>
                <label style={s.label}>Short Summary Description *</label>
                <input
                  type="text"
                  style={s.input}
                  placeholder="e.g. Best for growing enterprises looking to scale Meta and Google ad channels."
                  value={editor.description}
                  onChange={(e) => setEditor(p => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>

              <div style={s.formGroup} style={{ marginTop: 16 }}>
                <label style={s.label}>Deliverables / Included Services (One per line) *</label>
                <textarea
                  style={s.textarea}
                  rows={8}
                  placeholder="e.g.&#10;5 Custom Meta Ads&#10;Google Search Setup&#10;Bi-weekly Consulting call&#10;Conversion Tracking API"
                  value={editor.features}
                  onChange={(e) => setEditor(p => ({ ...p, features: e.target.value }))}
                  required
                />
              </div>
            </form>
          )}
        </section>
      </div>
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
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
    width: "100%",
  },
  listName: {
    fontWeight: 800,
    fontSize: 14,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: 800,
    textTransform: "uppercase",
    background: `${accent}20`,
    color: accent,
    padding: "2px 6px",
    borderRadius: 99,
    border: `1px solid ${accent}40`,
  },
  listMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#9ca3af",
  },
  listFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
    width: "100%",
  },
  statusPending: {
    display: "inline-flex",
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    color: "#888",
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
  orderText: {
    fontSize: 11,
    color: "#6b7280",
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
  form: {
    display: "flex",
    flexDirection: "column",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  detailTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
    fontStyle: "italic",
  },
  actionRow: {
    display: "flex",
    gap: 10,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#9ca3af",
    marginBottom: 8,
    fontWeight: 700,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 12,
    background: "#0a0a0a",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    outline: "none",
    fontSize: 13,
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: 14,
    background: "#0a0a0a",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    outline: "none",
    fontSize: 13,
    lineHeight: 1.6,
    resize: "vertical",
  },
  checkboxContainer: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 13,
    color: "#9ca3af",
    cursor: "pointer",
  },
  emptyState: {
    padding: 24,
    color: "#6b7280",
    fontSize: 13,
  },
};
