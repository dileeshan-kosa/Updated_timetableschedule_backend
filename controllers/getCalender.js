const calenderTable = require("../models/calenderTable");
const router = require("../routes");

const calenderCtrl = {
  createTestData: async (req, res) => {
    try {
      const {
        faculty,
        department,
        batch,
        modulename,
        lecturername,
        building,
        halls,
        lecture_date,
        start_time,
        end_time,
        year,
      } = req.body;
      // const existingOne = await calenderTable.findOne({});

      // if (existingOne) return res.status(400).json({ msg: "it's existing." });

      // const newData = new calenderTable({ faculty_name });
      const newData = new calenderTable({
        faculty,
        department,
        batch,
        modulename,
        lecturername,
        building,
        halls,
        lecture_date,
        start_time,
        end_time,
        year,
      });
      await newData.save();

      res.json({ msg: "Created" });
    } catch (error) {
      console.log("error", error);
    }
  },

  getCalender: async (req, res) => {
    try {
      let calenderTables = await calenderTable.find();
      res.send(calenderTables);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  },

  getSingleCalenderData: async (req, res) => {
    const { id } = req.params;
    // console.log("wdwdwdww", req.p)
    try {
      // let calenderTables = await calenderTable.findByIdAndUpdate;
      let calenderTables = await calenderTable.findById(id);
      res.send(calenderTables);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  },

  createUpdateData: async (req, res) => {
    const { id } = req.params;
    const {
      faculty,
      department,
      batch,
      modulename,
      lecturername,
      building,
      halls,
      lecture_date,
      start_time,
      end_time,
      year,
    } = req.body;
    console.log(id, faculty);
    try {
      const updatedData = await calenderTable.findOneAndUpdate(
        { _id: id },
        {
          faculty,
          department,
          batch,
          modulename,
          lecturername,
          building,
          halls,
          lecture_date,
          start_time,
          end_time,
          year,
        }
      );
      if (!updatedData) {
        return res.status(404).json({ msg: "Data not found" });
      }
      res.json({ msg: "Updated calendar data", updatedData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = calenderCtrl;
