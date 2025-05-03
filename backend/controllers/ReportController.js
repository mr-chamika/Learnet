const Report = require("../models/ReportModel");
const { strToObjId } = require("../utils/strToObjId");

async function createReport(req, res){
    try {
      const { contentId, contentType, reason, description, evidence } = req.body;
      const reporterId = req.user.userId;
  
      // Validate content exists
    //   const content = await ContentService.validateContentExists(contentType, contentId);
    //   if (!content) {
    //     return res.status(404).json({ error: 'Content not found' });
    //   }
  
      // Check for duplicate active reports
      const existingReport = await Report.findOne({
        contentId,
        contentType,
        reporter: reporterId,
        finalDecision: 'Pending'
      });
  
      if (existingReport) {
        return res.status(409).json({ 
          error: 'You already have a pending report for this content',
          reportId: existingReport._id
        });
      }
  
      // Create the report
      const newReport = new Report({
        reporter: reporterId,
        contentId,
        contentType,
        reason,
        description,
        // evidence: evidence || [],
        priority: 0 // Will be set by pre-save hook
      });
  
      // Save to trigger pre-save hooks
      await newReport.save();
  
      // Assign moderators (3 random active moderators)
    //   const moderators = await User.aggregate([
    //     { 
    //       $match: { 
    //         role: 'moderator',
    //         isActive: true,
    //         $or: [
    //           { 'moderationPreferences.categories': contentType },
    //           { 'moderationPreferences.categories': { $exists: false } }
    //         ]
    //       } 
    //     },
    //     { $sample: { size: 3 } },
    //     { $project: { _id: 1 } }
    //   ]);
  
    //   if (moderators.length > 0) {
    //     newReport.assignedModerators = moderators.map(m => m._id);
    //     await newReport.save();
  
        // Update moderator assignments
        // await User.updateMany(
        //   { _id: { $in: newReport.assignedModerators } },
        //   { $push: { assignedReports: newReport._id } }
        // );
  
        // Send notifications
        // await NotificationService.notifyModerators(
        //   newReport._id,
        //   newReport.assignedModerators,
        //   `New ${newReport.severity} priority report assigned`
        // );
        // } else {
        //     If no moderators available, escalate to admin
        //     newReport.finalDecision = 'Escalated';
        //     await newReport.save();
        // }
  
    // Update reporter's stats
    // await User.findByIdAndUpdate(reporterId, {
    //     $inc: { 'reputation.numberOfReportsCreated': 1 },
    //     $push: { submittedReports: newReport._id }
    // });
  
    // Return the created report with moderator info
    // const populatedReport = await Report.findById(newReport._id)
    //     .populate('assignedModerators', 'name email')
    //     .populate('reporter', 'name reputation.reputationScore');
  
    // res.status(201).json({
    //     message: 'Report submitted successfully',
    //     report: populatedReport,
    //     nextSteps: moderators.length > 0 
    //       ? 'Your report has been assigned to moderators' 
    //       : 'Your report has been escalated to administrators'
    // });

    res.json(newReport)
  
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ 
            error: 'Failed to create report',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Moderator submits vote
async function submitVote(req, res){
    const report = await Report.findOne({
        _id: strToObjId(req.body.reportId),
        assignedModerators: strToObjId(req.user.userId)
    });
  
    if (!report) return res.status(403).json({ error: 'Not assigned to this report' });
  
    // Add/update vote
    const existingVote = report.votes.find(v => v.moderator.equals(req.user.userId));
    if (existingVote) {
        existingVote.decision = req.body.decision
        existingVote.comment = req.body.comment
    } else {
        report.votes.push({
            moderator: req.user.userId,
            comment: req.body.comment,
            decision: req.body.decision
        });
    }
  
    // Check for majority decision
    const votes = report.votes.filter(v => v.decision !== 'Pending');
    if (votes.length >= 2) {
        const approveCount = votes.filter(v => v.decision === 'Approve').length;
        report.finalDecision = approveCount >= 2 ? 'Approved' : 'Rejected';
      
        // Update reporter reputation if rejected
        if (report.finalDecision === 'Rejected') {
            await User.findByIdAndUpdate(report.reporter, {
              $inc: { 'reputation.numberOfFalseReports': 1 }
            });
        }
    }
  
    await report.save();
    const updatedReport = await Report.findById(report._id)
        .sort('-priority -createdAt')
        .populate('reporter', 'name reputation.reputationScore')
        .populate('assignedModerators', 'name');
    res.json(updatedReport);
};
  
// Get reports (with permissions)
async function getReports(req, res){
    let query = {};
    
    // if (req.user.role === 'moderator') {
    if (req.user.isModerator) {
        query = { assignedModerators: req.user.userId };
    } else if (!req.user.isAdmin) {
        query = { reporter: req.user.userId };
    }
    // Admins can see all reports
  
    const reports = await Report.find(query)
        .sort('-priority -createdAt')
        .populate('reporter', 'name reputation.reputationScore')
        .populate('assignedModerators', 'name');
  
    res.json(reports);
};

// Check for pending decisions every hour
// const processPendingReports = async () => {
//     const pendingReports = await Report.find({
//         finalDecision: 'Pending',
//         'votes.2': { $exists: true } // At least 3 votes
//     });

//     for (const report of pendingReports) {
//         const decisions = report.votes.reduce((acc, vote) => {
//             acc[vote.decision] = (acc[vote.decision] || 0) + 1;
//             return acc;
//         }, {});

//         if (decisions.Approve >= 2) {
//             report.finalDecision = 'Approved';
//             await takeContentAction(report);
//         } else if (decisions.Reject >= 2) {
//             report.finalDecision = 'Rejected';
//         } else {
//             report.finalDecision = 'Escalated';
//         }

//         await report.save();
//     }
// };
  
// Run hourly
// setInterval(processPendingReports, 60 * 60 * 1000);

module.exports = {
    createReport,
    submitVote,
    getReports
}