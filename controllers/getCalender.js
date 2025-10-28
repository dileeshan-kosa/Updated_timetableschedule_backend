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

      // Convert start and end time to 24-hour format for comparison (optional)
      const startTime = new Date(`${lecture_date} ${start_time}`);
      const endTime = new Date(`${lecture_date} ${end_time}`);

      // Check for existing timetable conflicts
      const existingConflict = await calenderTable.findOne({
        faculty,
        department,
        lecture_date,
        $or: [
          {
            // Overlapping condition
            $and: [
              { start_time: { $lt: end_time } },
              { end_time: { $gt: start_time } },
            ],
          },
        ],
      });
      if (existingConflict) {
        return res.status(400).json({
          message: `A timetable already exists for ${department} - ${batch} on ${lecture_date} during this time.`,
        });
      }

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
