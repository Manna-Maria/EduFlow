require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Progress = require("./models/Progress");

const resetProgress = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    const email = "mullaperiyar1000@gmail.com";
    console.log(`Finding user with email: ${email}`);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }

    console.log(`Found user: ${user._id}`);
    console.log(`Deleting all progress records for this user...`);
    
    const result = await Progress.deleteMany({ studentId: user._id });
    console.log(`✅ Deleted ${result.deletedCount} progress records`);
    
    // Verify deletion
    const remaining = await Progress.countDocuments({ studentId: user._id });
    console.log(`Remaining progress records: ${remaining}`);
    
    console.log("✅ Reset complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetProgress();
