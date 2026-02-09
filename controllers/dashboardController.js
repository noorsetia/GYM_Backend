import Member from "../models/Member.js";
import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import Contact from "../models/Contact.js";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // Total members
    const totalMembers = await Member.countDocuments();

    // Active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({ status: "active" });

    // Expired subscriptions
    const expiredSubscriptions = await Subscription.countDocuments({ status: "expired" });

    // Total plans
    const totalPlans = await Plan.countDocuments({ isActive: true });

    // Unread contacts
    const unreadContacts = await Contact.countDocuments({ isRead: false });

    // Total revenue (sum of all paid subscriptions)
    const revenueData = await Subscription.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amountPaid" },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Current month revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueData = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: "$amountPaid" },
        },
      },
    ]);

    const monthlyRevenue = monthlyRevenueData.length > 0 ? monthlyRevenueData[0].monthlyRevenue : 0;

    // Subscriptions expiring in next 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const expiringSubscriptions = await Subscription.find({
      status: "active",
      endDate: { $gte: today, $lte: nextWeek },
    })
      .populate("member", "name email phone")
      .populate("plan", "name duration")
      .sort({ endDate: 1 });

    // Recent members (last 5)
    const recentMembers = await Member.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email phone createdAt");

    // Recent subscriptions (last 5)
    const recentSubscriptions = await Subscription.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("member", "name email")
      .populate("plan", "name duration price");

    // Plan-wise subscription distribution
    const planDistribution = await Subscription.aggregate([
      {
        $match: { status: "active" },
      },
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "_id",
          foreignField: "_id",
          as: "planDetails",
        },
      },
      {
        $unwind: "$planDetails",
      },
      {
        $project: {
          planName: "$planDetails.name",
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalMembers,
          activeSubscriptions,
          expiredSubscriptions,
          totalPlans,
          unreadContacts,
          totalRevenue,
          monthlyRevenue,
        },
        expiringSubscriptions: {
          count: expiringSubscriptions.length,
          subscriptions: expiringSubscriptions,
        },
        recentMembers,
        recentSubscriptions,
        planDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get revenue statistics
// @route   GET /api/dashboard/revenue
// @access  Private
export const getRevenueStats = async (req, res) => {
  try {
    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amountPaid" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      success: true,
      data: monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get member growth statistics
// @route   GET /api/dashboard/member-growth
// @access  Private
export const getMemberGrowthStats = async (req, res) => {
  try {
    // Member growth for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const memberGrowth = await Member.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      success: true,
      data: memberGrowth,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
