import Holiday from "../models/Holiday.js";

const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    return res.json({ success: true, holidays });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const addHoliday = async (req, res) => {
  try {
    const { name, date } = req.body;
    const newHoliday = new Holiday({
      name,
      date,
    });

    await newHoliday.save();

    return res.json({ success: true, message: "Holiday Added Successfully!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const editHoliday = async (req, res) => {
  try {
    const { name, date } = req.body;
    const { _id } = req.params;
    await Holiday.findByIdAndUpdate({ _id }, { name, date });

    return res.json({
      success: true,
      message: "Holiday Updated Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const { _id } = req.params;
    await Holiday.findByIdAndDelete({ _id });

    return res.json({
      success: true,
      message: "Holiday Deleted Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { getHolidays, addHoliday, editHoliday, deleteHoliday };
