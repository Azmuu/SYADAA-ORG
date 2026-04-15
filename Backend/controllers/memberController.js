import Member from "../models/Member.js";

export const getMembers = async (req, res) => {
  const data = await Member.find();
  res.json(data);
};

export const createMember = async (req, res) => {
  const data = await Member.create(req.body);
  res.status(201).json(data);
};