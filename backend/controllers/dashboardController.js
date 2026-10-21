const Ticket = require('../models/Ticket');

const getDashboardMetrics = async (req , res , next) => {
  try {
    const openCount = await Ticket.countDocuments({
      status: {$in : ['Open', 'In Progress']},
    });

    const resolvedCount = await Ticket.countDocuments({
      status: {$in : ['Resolved', 'Closed']},
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const overdueCount = await Ticket.countDocuments({
      priority: 'High',
      status: { $in: ['Open', 'In Progress']},
      createdAt: {$lt: twentyFourHoursAgo},
    });

    const resolvedtTickets = await Ticket.find({resolvedAt: {$ne: null}});
    let avgResolutionHours = 0;
    if (resolvedtTickets.length > 0) {
      const totalTimeMs = resolvedtTickets.reduce((acc, ticket) => {
        return acc + (ticket.resolvedAt - ticket.createdAt);
      }, 0);

      const avgTimeMs = totalTimeMs / resolvedtTickets.length
      avgResolutionHours = (avgTimeMs / (1000 * 60 * 60)).toFixed(1);
    }

    const priorityAgrregation = await Ticket.aggregate([
      {$group: {_id : '$priority', count: {$sum: 1}}},
    ]);

    const priorityBreakdown = {High: 0, Medium:0, Low:0};
    priorityAgrregation.forEach((item) => {
      if (item._id) priorityBreakdown[item._id] = item.count;
    });

    const categoryAggregation = await Ticket.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const categoryBreakdown = { Billing: 0, Technical: 0, Account: 0, Other: 0};
    categoryAggregation.forEach((item) => {
      if (item._id) {
        categoryBreakdown[item._id] = item.count;
      }
    });

    res.status(200).json({
      open: openCount,
      resolved: resolvedCount,
      overdue: overdueCount,
      avgResolutionTime: parseFloat(avgResolutionHours),
      byPriority: priorityBreakdown,
      byCategory: categoryBreakdown,
    });
  } catch (error) {
    next (error);
  }
};

module.exports = {getDashboardMetrics};