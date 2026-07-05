const Job = require("../models/Job.model");
const Application = require("../models/Application.model");
const Contact = require("../models/Contact.model");
const {
  sendContactConfirmationToUser,
  sendContactNotificationToAdmin,
  sendApplicationConfirmation,
  sendApplicationNotificationToAdmin,
} = require("../utils/email.utils");

// GET /api/jobs/all
exports.compatGetAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/jobs/add
exports.compatAddJob = async (req, res) => {
  try {
    const { title, type, location, description, department, experience, salary } = req.body;
    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required." });
    }
    const job = await Job.create({
      title,
      type,
      location:    location    || "Remote",
      description: description || "",
      department:  department  || "General",
      experience:  experience  || "Any",
      salary:      salary      || "",
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/jobs/update/:id
exports.compatUpdateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/jobs/delete/:id
exports.compatDeleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/careers/apply
exports.compatApplyCareer = async (req, res) => {
  try {
    const { fullName, email, phone, position, portfolioUrl, message } = req.body;

    if (!fullName || !email || !phone || !position) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    // Find job by title (frontend sends title, not _id)
    let job = await Job.findOne({ title: position, isActive: true });

    // If "General Application" or job not found, still allow submission
    if (!job && position !== "General Application") {
      // Try case-insensitive match
      job = await Job.findOne({ title: { $regex: new RegExp(`^${position}$`, "i") }, isActive: true });
    }

    const application = await Application.create({
      job:         job?._id || null,
      jobTitle:    position,
      name:        fullName,
      email,
      phone,
      portfolio:   portfolioUrl || "",
      coverLetter: message || "",
      resume:      req.file ? `/uploads/resumes/${req.file.filename}` : "",
    });

    // Increment count if job found
    if (job) {
      job.applicationsCount += 1;
      await job.save();
    }

    // Send emails (non-blocking)
    Promise.allSettled([
      sendApplicationConfirmation({ name: fullName, email, jobTitle: position }),
      sendApplicationNotificationToAdmin({ name: fullName, email, phone, jobTitle: position }),
    ]);

    res.status(201).json({ success: true, message: "Application submitted successfully!", application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/careers/all
exports.compatGetAllCareers = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("job", "title department")
      .sort({ createdAt: -1 });

    const mapped = apps.map((a) => ({
      _id:          a._id,
      fullName:     a.name,
      email:        a.email,
      phone:        a.phone,
      position:     a.jobTitle || a.job?.title || "",
      portfolioUrl: a.portfolio || a.linkedIn || "",
      message:      a.coverLetter || "",
      file:         a.resume ? a.resume.replace("/uploads/resumes/", "") : "",
      status:       a.status,
      createdAt:    a.createdAt,
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/careers/delete/:id
exports.compatDeleteCareer = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/send-email
exports.compatSendEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email and message are required." });
    }

    const lines   = message.split("\n");
    const service = lines[0]?.replace("Service: ", "").trim() || "General Inquiry";
    const phone   = lines[1]?.replace("Phone: ", "").trim()   || "";
    const body    = lines.slice(3).join("\n").trim() || message;

    await Contact.create({ name, email, phone, subject: service, message: body });

    Promise.allSettled([
      sendContactConfirmationToUser({ name, email, subject: service }),
      sendContactNotificationToAdmin({ name, email, phone, subject: service, message: body }),
    ]);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
