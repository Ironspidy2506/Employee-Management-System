import Performance from "../models/Performance.js";
import Employee from "../models/Employee.js";

const getPerformances = async (req, res) => {
  try {
    const { month, year } = req.params;
    const performances = await Performance.find({ month, year }).populate(
      "employeeId"
    );
    return res.json({ success: true, performances });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getUserPerformances = async (req, res) => {
  try {
    const { userId } = req.params;

    const employee = await Employee.findOne({ userId });
    const employeeId = employee._id;

    const performances = await Performance.find({ employeeId });
    return res.json({ success: true, performances });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getEmployeePerformance = async (req, res) => {
  try {
    const { empId } = req.body;
    const employee = await Employee.findOne({ employeeId: Number(empId) });
    if (!employee) {
      return res.json({
        success: false,
        message: "No Employee found with this Employee ID",
      });
    }
    const employeeId = employee._id;

    const performances = await Performance.find({ employeeId }).populate(
      "employeeId"
    );
    return res.json({ success: true, performances });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const addPerformance = async (req, res) => {
  try {
    const { _id, month, year, drawings, tasks } = req.body;

    const employee = await Employee.findOne({ userId: _id });
    const employeeId = employee._id;

    const newPerformance = new Performance({
      employeeId,
      month,
      year,
      drawings,
      tasks,
    });

    await newPerformance.save();

    return res.json({
      success: true,
      message: "Performance Added Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const editPerformance = async (req, res) => {
  try {
    const { month, year, drawings, tasks } = req.body;
    const { performanceId } = req.params;
    await Performance.findByIdAndUpdate(
      { _id: performanceId },
      { month, year, drawings, tasks }
    );

    return res.json({
      success: true,
      message: "Performance Updated Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const deletePerformance = async (req, res) => {
  try {
    const { performanceId } = req.params;
    await Performance.findByIdAndDelete({ _id: performanceId });

    return res.json({
      success: true,
      message: "Performance Deleted Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export {
  getPerformances,
  getUserPerformances,
  getEmployeePerformance,
  addPerformance,
  editPerformance,
  deletePerformance,
};
