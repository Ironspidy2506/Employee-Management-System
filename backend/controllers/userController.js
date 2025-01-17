import User from "../models/User.js";
import bcrypt from "bcrypt";

const getUserData = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json({
      success: true,
      users,
      message: "User Data fetched Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const deleteUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete({ _id: userId });
    return res.json({
      success: true,
      message: "User Data deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .json({ success: false, message: "Wrong Old Password!" });
    }
    
    const hashPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { getUserData, deleteUserData, updatePassword };
