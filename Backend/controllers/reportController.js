import Report from "../models/Report.js";

export const getReports = async (req, res) => {
  const data = await Report.find();
  res.json(data);
};

export const createReport = async (req, res) => {
  const data = await Report.create(req.body);
  res.status(201).json(data);
};