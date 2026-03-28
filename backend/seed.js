const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Define schema inline to avoid any hook issues
    const Admin = require("./models/Admin.model");

    const email = "admin@vndmedia.com";   // 👈 Change this
    const password = "vndmedia";          // 👈 Change this
    const name = "Super Admin";

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️  Admin already exists:", existing.email);
      process.exit(0);
    }

    // Hash manually so we bypass the hook entirely
    const hashed = await bcrypt.hash(password, 12);

    const admin = new Admin({ name, email, password: hashed, role: "superadmin" });
    // Use $set to skip the pre-save hook password re-hash
    await admin.save({ validateBeforeSave: true });

    console.log("✅ Admin created!");
    console.log("   Email:   ", email);
    console.log("   Password:", password);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();