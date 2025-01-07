import User from "../models/User.js";

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

export { getUserData, deleteUserData };
