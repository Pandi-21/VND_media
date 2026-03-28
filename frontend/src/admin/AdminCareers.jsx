import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BASE =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("vnd_admin_token")}`,
  "Content-Type": "application/json",
});

// ─── small helpers ────────────────────────────────────────────────────────────

function Badge({ children, color = "green" }) {
  const palettes = {
    green:  "bg-green-500/10  text-green-400  border-green-500/20",
    gray:   "bg-white/5       text-gray-400   border-white/10",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    red:    "bg-red-500/10    text-red-400    border-red-500/20",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${palettes[color]} tracking-wider font-semibold`}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#131313] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold italic text-sm tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, required, ...props }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.12em] text-gray-500 block mb-1.5">
        {label}{required && " *"}
      </label>
      <input
        {...props}
        className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
      />
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AdminCareers() {
  const navigate  = useNavigate();
  const [tab, setTab]               = useState("jobs");        // "jobs" | "applications"
  const [jobs, setJobs]             = useState([]);
  const [apps, setApps]             = useState([]);
  const [loadingJobs, setLoadingJobs]     = useState(false);
  const [loadingApps, setLoadingApps]     = useState(false);
  const [toast, setToast]           = useState(null);          // { type, msg }

  // Job modal state
  const [jobModal, setJobModal]     = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm]       = useState({ title: "", type: "", location: "", description: "" });
  const [jobSaving, setJobSaving]   = useState(false);

  // Application detail modal
  const [selectedApp, setSelectedApp] = useState(null);

  // Search / filter
  const [appSearch, setAppSearch]   = useState("");
  const [appFilter, setAppFilter]   = useState("ALL");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── fetch ─────────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res  = await fetch(`${BASE}/api/jobs/all`);
      const data = await res.json();
      setJobs(data);
    } catch { showToast("error", "Failed to load jobs"); }
    finally   { setLoadingJobs(false); }
  }, []);

  const fetchApps = useCallback(async () => {
    setLoadingApps(true);
    try {
      const res  = await fetch(`${BASE}/api/careers/all`, { headers: authHeader() });
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch { showToast("error", "Failed to load applications"); }
    finally   { setLoadingApps(false); }
  }, []);

  useEffect(() => { fetchJobs(); fetchApps(); }, [fetchJobs, fetchApps]);

  // ── job CRUD ──────────────────────────────────────────────────────────────

  const openJobModal = (job = null) => {
    setEditingJob(job);
    setJobForm(job
      ? { title: job.title, type: job.type, location: job.location, description: job.description || "" }
      : { title: "", type: "", location: "", description: "" }
    );
    setJobModal(true);
  };

  const saveJob = async () => {
    if (!jobForm.title || !jobForm.type) {
      showToast("error", "Title and type are required"); return;
    }
    setJobSaving(true);
    try {
      const url    = editingJob ? `${BASE}/api/jobs/update/${editingJob._id}` : `${BASE}/api/jobs/add`;
      const method = editingJob ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(jobForm) });
      if (!res.ok) throw new Error();
      showToast("success", editingJob ? "Job updated!" : "Job added!");
      setJobModal(false);
      fetchJobs();
    } catch { showToast("error", "Failed to save job"); }
    finally   { setJobSaving(false); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await fetch(`${BASE}/api/jobs/delete/${id}`, { method: "DELETE", headers: authHeader() });
      showToast("success", "Job deleted");
      fetchJobs();
    } catch { showToast("error", "Failed to delete job"); }
  };

  // ── application actions ───────────────────────────────────────────────────

  const deleteApp = async (id) => {
    if (!window.confirm("Delete this application permanently?")) return;
    try {
      await fetch(`${BASE}/api/careers/delete/${id}`, { method: "DELETE", headers: authHeader() });
      showToast("success", "Application deleted");
      if (selectedApp?._id === id) setSelectedApp(null);
      fetchApps();
    } catch { showToast("error", "Failed to delete application"); }
  };

  // ── logout ────────────────────────────────────────────────────────────────

  const logout = () => {
    localStorage.removeItem("vnd_admin_token");
    navigate("/admin/login");
  };

  // ── derived ───────────────────────────────────────────────────────────────

  const positions = [...new Set(apps.map((a) => a.position).filter(Boolean))];

  const filteredApps = apps.filter((a) => {
    const matchSearch =
      !appSearch ||
      a.fullName?.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.position?.toLowerCase().includes(appSearch.toLowerCase());
    const matchFilter = appFilter === "ALL" || a.position === appFilter;
    return matchSearch && matchFilter;
  });

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl transition-all ${
          toast.type === "success"
            ? "bg-green-500/20 border border-green-500/30 text-green-400"
            : "bg-red-500/20 border border-red-500/30 text-red-400"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#0BB80F" }}>
            <span className="text-black font-black text-xs">V</span>
          </div>
          <span className="font-extrabold tracking-widest text-xs text-white">VND MEDIA</span>
          <span className="text-gray-700 text-xs ml-1">/ ADMIN</span>
        </div>
        <button
          onClick={logout}
          className="text-[10px] tracking-widest text-gray-600 hover:text-red-400 transition-colors border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg"
        >
          LOGOUT
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Page title + stats ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold italic">CAREERS DASHBOARD</h1>
            <p className="text-gray-600 text-xs mt-1">Manage job postings and applicant data</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#141414] border border-white/[0.06] rounded-xl px-5 py-3 text-center">
              <div className="text-xl font-extrabold" style={{ color: "#0BB80F" }}>{jobs.length}</div>
              <div className="text-[10px] text-gray-600 tracking-wider mt-0.5">OPEN JOBS</div>
            </div>
            <div className="bg-[#141414] border border-white/[0.06] rounded-xl px-5 py-3 text-center">
              <div className="text-xl font-extrabold text-white">{apps.length}</div>
              <div className="text-[10px] text-gray-600 tracking-wider mt-0.5">APPLICATIONS</div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 bg-[#111] border border-white/[0.06] rounded-xl p-1 w-fit">
          {["jobs", "applications"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${
                tab === t
                  ? "text-black"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              style={tab === t ? { background: "#0BB80F" } : {}}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ══════════════════ JOBS TAB ══════════════════ */}
        {tab === "jobs" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-extrabold italic tracking-wider text-gray-300">OPEN POSITIONS</h2>
              <button
                onClick={() => openJobModal()}
                className="text-black text-[10px] font-bold px-4 py-2 rounded-lg tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5"
                style={{ background: "#0BB80F" }}
              >
                + ADD JOB
              </button>
            </div>

            {loadingJobs ? (
              <div className="text-gray-700 text-xs text-center py-16 tracking-widest animate-pulse">LOADING...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <div className="text-3xl mb-3 opacity-30">💼</div>
                <p className="text-gray-600 text-xs tracking-wider">NO JOB POSTINGS YET</p>
                <button
                  onClick={() => openJobModal()}
                  className="mt-4 text-[10px] font-bold px-4 py-2 rounded-lg tracking-wider hover:opacity-90"
                  style={{ color: "#0BB80F" }}
                >
                  + CREATE YOUR FIRST JOB
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-[#111] border border-white/[0.06] rounded-xl p-5 flex items-start justify-between gap-4 hover:border-white/10 transition-all group">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-sm italic mb-1.5">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge color="green">{job.type || "Full Time"}</Badge>
                        {job.location && <Badge color="gray">{job.location}</Badge>}
                      </div>
                      {job.description && (
                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{job.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openJobModal(job)}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ APPLICATIONS TAB ══════════════════ */}
        {tab === "applications" && (
          <div>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <input
                type="text"
                placeholder="Search by name, email or position..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="flex-1 bg-[#111] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#0BB80F]/30 transition-colors"
              />
              <select
                value={appFilter}
                onChange={(e) => setAppFilter(e.target.value)}
                className="bg-[#111] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-[#0BB80F]/30 transition-colors"
              >
                <option value="ALL">ALL POSITIONS</option>
                {positions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {loadingApps ? (
              <div className="text-gray-700 text-xs text-center py-16 tracking-widest animate-pulse">LOADING...</div>
            ) : filteredApps.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <div className="text-3xl mb-3 opacity-30">📭</div>
                <p className="text-gray-600 text-xs tracking-wider">NO APPLICATIONS FOUND</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredApps.map((app) => (
                  <div
                    key={app._id}
                    className="bg-[#111] border border-white/[0.06] rounded-xl p-5 cursor-pointer hover:border-[#0BB80F]/20 transition-all group"
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <h2 className="font-extrabold text-sm italic">{app.fullName}</h2>
                          {app.position && <Badge color="green">{app.position}</Badge>}
                        </div>
                        <p className="text-gray-500 text-xs mb-0.5">{app.email}</p>
                        <p className="text-gray-600 text-xs">{app.phone}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors hidden md:block">
                          VIEW DETAILS →
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteApp(app._id); }}
                          className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ════ JOB MODAL ════ */}
      {jobModal && (
        <Modal title={editingJob ? "EDIT JOB POSTING" : "ADD JOB POSTING"} onClose={() => setJobModal(false)}>
          <div className="space-y-3">
            <InputField
              label="JOB TITLE" required
              value={jobForm.title}
              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              placeholder="e.g. META ADS SPECIALIST"
            />
            <InputField
              label="TYPE" required
              value={jobForm.type}
              onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
              placeholder="e.g. Full Time · Remote"
            />
            <InputField
              label="LOCATION"
              value={jobForm.location}
              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
              placeholder="e.g. Remote / Dubai / Hybrid"
            />
            <div>
              <label className="text-[10px] tracking-[0.12em] text-gray-500 block mb-1.5">DESCRIPTION</label>
              <textarea
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                placeholder="Brief description of the role..."
                rows={3}
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none"
              />
            </div>
            <button
              onClick={saveJob}
              disabled={jobSaving}
              className={`w-full text-black font-bold text-xs py-3 rounded-xl tracking-widest transition-all mt-1 ${
                jobSaving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ background: "#0BB80F" }}
            >
              {jobSaving ? "SAVING..." : editingJob ? "UPDATE JOB" : "ADD JOB"}
            </button>
          </div>
        </Modal>
      )}

      {/* ════ APPLICATION DETAIL MODAL ════ */}
      {selectedApp && (
        <Modal title="APPLICATION DETAILS" onClose={() => setSelectedApp(null)}>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-gray-600 tracking-wider mb-1">FULL NAME</div>
                <div className="font-semibold text-white">{selectedApp.fullName}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-600 tracking-wider mb-1">POSITION</div>
                <Badge color="green">{selectedApp.position || "—"}</Badge>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-600 tracking-wider mb-1">EMAIL</div>
              <div className="text-gray-300">{selectedApp.email}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-600 tracking-wider mb-1">PHONE</div>
              <div className="text-gray-300">{selectedApp.phone}</div>
            </div>
            {selectedApp.portfolioUrl && (
              <div>
                <div className="text-[10px] text-gray-600 tracking-wider mb-1">PORTFOLIO</div>
                <a
                  href={selectedApp.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs break-all"
                >
                  {selectedApp.portfolioUrl}
                </a>
              </div>
            )}
            {selectedApp.message && (
              <div>
                <div className="text-[10px] text-gray-600 tracking-wider mb-1">MESSAGE</div>
                <p className="text-gray-400 text-xs leading-relaxed bg-[#0a0a0a] rounded-lg p-3 border border-white/[0.05]">
                  {selectedApp.message}
                </p>
              </div>
            )}
            {selectedApp.file && (
              <div>
                <div className="text-[10px] text-gray-600 tracking-wider mb-1">RESUME</div>
                <a
                  href={`${BASE}/uploads/${selectedApp.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all"
                >
                  📄 VIEW RESUME / CV
                </a>
              </div>
            )}
            <button
              onClick={() => deleteApp(selectedApp._id)}
              className="w-full text-red-400 font-bold text-xs py-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-all mt-2"
            >
              DELETE APPLICATION
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}