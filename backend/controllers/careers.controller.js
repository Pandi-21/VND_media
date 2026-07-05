const Job = require("../models/Job.model");
const Application = require("../models/Application.model");
const {
  sendApplicationConfirmation,
  sendApplicationNotificationToAdmin,
} = require("../utils/email.utils");

// GET /api/careers/jobs
exports.getActiveJobs = async (req, res) => {
  try {
    const { department, type } = req.query;
    const query = { isActive: true };
    if (department) query.department = department;
    if (type) query.type = type;

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/careers/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/careers/apply
exports.applyJob = async (req, res) => {
  try {
    const { fullName, email, phone, position, portfolioUrl, message } = req.body;

    if (!fullName || !email || !phone || !position) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    // Find job by title (position)
    let job = await Job.findOne({ title: position, isActive: true });

    // case-insensitive fallback
    if (!job) {
      job = await Job.findOne({
        title: { $regex: new RegExp(`^${position}$`, "i") },
        isActive: true,
      });
    }

    const application = await Application.create({
      job: job?._id || null,
      jobTitle: position,
      name: fullName,
      email,
      phone,
      coverLetter: message || "",
      portfolio: portfolioUrl || "",
      resume: `/uploads/resumes/${req.file.filename}`,
    });

    // increment count if job exists
    if (job) {
      job.applicationsCount += 1;
      await job.save();
    }

    // emails (non-blocking)
    Promise.allSettled([
      sendApplicationConfirmation({
        name: fullName,
        email,
        jobTitle: position,
      }),
      sendApplicationNotificationToAdmin({
        name: fullName,
        email,
        phone,
        jobTitle: position,
      }),
    ]);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/careers/admin/jobs
exports.getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/careers/admin/jobs
exports.createJobAdmin = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/careers/admin/jobs/:id
exports.updateJobAdmin = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/careers/admin/jobs/:id
exports.deleteJobAdmin = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Job deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/careers/admin/jobs/:id/toggle
exports.toggleJobAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    job.isActive = !job.isActive;
    await job.save();
    res.json({ success: true, isActive: job.isActive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/careers/admin/applications
exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const query = {};
    if (jobId)  query.job = jobId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate("job", "title department")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/careers/admin/applications/:id
exports.getApplicationByIdAdmin = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found." });
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/careers/admin/applications/:id/status
exports.updateApplicationStatusAdmin = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    if (!application) return res.status(404).json({ success: false, message: "Application not found." });
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/careers/admin/applications/:id
exports.deleteApplicationAdmin = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Application deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
