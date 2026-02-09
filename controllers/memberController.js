import Member from "../models/Member.js";

// @desc    Get all members
// @route   GET /api/members
// @access  Private
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private
export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Public (for "Join Now" button)
export const createMember = async (req, res) => {
  try {
    const { name, email, phone, age, gender, height, weight, address, emergencyContact } = req.body;

    // Check if member already exists
    const memberExists = await Member.findOne({ email });

    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: "Member already exists with this email",
      });
    }

    const member = await Member.create({
      name,
      email,
      phone,
      age,
      gender,
      height,
      weight,
      address,
      emergencyContact,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
export const updateMember = async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await member.deleteOne();

    res.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
