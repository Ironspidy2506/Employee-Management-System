import Employee from "../models/Employee.js";
import Helpdesk from "../models/Helpdesk.js";

const applyHelp = async (req, res) => {
  try {
    const { _id, query } = req.body;
    function generateRandomCode() {
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      return "H" + randomDigits;
    }

    if (!query) {
      return res.json({ success: false, message: "Write your query!" });
    }

    const employee = await Employee.findOne({ userId: _id });

    const help = new Helpdesk({
      employeeId: employee._id,
      helpId: generateRandomCode(),
      query,
    });

    await help.save();

    return res.json({
      success: true,
      message: "Query Submitted Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getMyHelps = async (req, res) => {
  try {
    const { _id } = req.params;

    const employee = await Employee.findOne({ userId: _id });
    const employeehelps = await Helpdesk.find({ employeeId: employee._id });
    return res.json({ success: true, employeehelps });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getHelp = async (req, res) => {
  try {
    const { _id } = req.params;
    const employeehelpdata = await Helpdesk.findById(_id).populate(
      "employeeId"
    );
    return res.json({
      success: true,
      message: "Help Data Fetched!",
      employeehelpdata,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const updateHelp = async (req, res) => {
  try {
    const { _id } = req.params;
    const { query } = req.body;
    await Helpdesk.findByIdAndUpdate(_id, { query });
    return res.json({
      success: true,
      message: "Query Updated Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getAllHelps = async (req, res) => {
  try {
    const helpdata = await Helpdesk.find().populate("employeeId");

    return res.json({
      success: true,
      helpdata,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const resolveHelp = async (req, res) => {
  try {
    const { _id } = req.params;
    await Helpdesk.findByIdAndUpdate(_id, { status: true });
    return res.json({
      success: true,
      message: "Query Resolved Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const deleteHelp = async (req, res) => {
  try {
    const { _id } = req.params;
    await Helpdesk.findByIdAndDelete(_id);
    return res.json({
      success: true,
      message: "Query Deleted Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { applyHelp, getMyHelps, getHelp, updateHelp, getAllHelps, resolveHelp, deleteHelp };
