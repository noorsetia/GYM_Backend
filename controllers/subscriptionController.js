import Subscription from "../models/Subscription.js";
import Member from "../models/Member.js";
import Plan from "../models/Plan.js";

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("member", "name email phone")
      .populate("plan", "name duration price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single subscription
// @route   GET /api/subscriptions/:id
// @access  Private
export const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate("member", "name email phone")
      .populate("plan", "name duration price");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get subscriptions by member
// @route   GET /api/subscriptions/member/:memberId
// @access  Private
export const getSubscriptionsByMember = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ member: req.params.memberId })
      .populate("plan", "name duration price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private
export const createSubscription = async (req, res) => {
  try {
    const { member, plan, paymentMethod, amountPaid } = req.body;

    // Check if member exists
    const memberExists = await Member.findById(member);
    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Check if plan exists
    const planExists = await Plan.findById(plan);
    if (!planExists) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Create subscription
    const subscription = await Subscription.create({
      member,
      plan,
      paymentMethod,
      amountPaid: amountPaid || planExists.price,
    });

    // Populate the response
    await subscription.populate("member", "name email phone");
    await subscription.populate("plan", "name duration price");

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
export const updateSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("member", "name email phone")
      .populate("plan", "name duration price");

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    await subscription.deleteOne();

    res.json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get active subscriptions
// @route   GET /api/subscriptions/active
// @access  Private
export const getActiveSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ status: "active" })
      .populate("member", "name email phone")
      .populate("plan", "name duration price")
      .sort({ endDate: 1 });

    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get expired subscriptions
// @route   GET /api/subscriptions/expired
// @access  Private
export const getExpiredSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ status: "expired" })
      .populate("member", "name email phone")
      .populate("plan", "name duration price")
      .sort({ endDate: -1 });

    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
