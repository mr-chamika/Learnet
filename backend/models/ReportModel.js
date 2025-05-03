const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReportSchema = new Schema({
    // Reporter Information
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Content Being Reported (Polymorphic Reference)
    contentId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    contentType: {
        type: String,
        enum: ['note', 'blog', 'group', 'community', 'file'],
        required: true,
        index: true
    },

    // Report Details
    //   reason: {
    //     type: String,
    //     enum: ['Harassment', 'Violence', 'Misinformation', 'Spam', 'Inappropriate', 'Other'],
    //     required: true
    //   },
    reason: {
        type: String,
        enum: [
            "AcademicIntegrityViolation",
            "CopyrightViolation",
            "Inappropriate",
            "Misinformation",
            "Spam",
            "Harassment"
        ],
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        trim: true
    },
//   evidence: [{
//     type: String, // URLs to screenshots or other evidence
//     validate: {
//       validator: v => /https?:\/\/.+/i.test(v),
//       message: 'Evidence must be a valid URL'
//     }
//   }],

    // Moderation System
    assignedModerators: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        validate: {
            validator: function(v) {
                return v.length <= 3; // Validate the whole array length
            },
            message: 'Maximum 3 moderators per report'
        }
    },
    votes: [
        {
            moderator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
            },
            decision: {
                type: String,
                enum: ['Approve', 'Reject', 'Pending'],
                default: 'Pending'
            },
            comment: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    finalDecision: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending', 'Escalated', 'Dismissed'],
        default: 'Pending',
        index: true
    },
    adminReviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    // Priority Management
    priority: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
        index: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Priority Scoring Logic
const PRIORITY_WEIGHTS = {
  'Harassment': 90,
  'AcademicIntegrityViolation': 95,
  'CopyrightViolation': 80,
  'Misinformation': 75,
  'Spam': 40,
  'Inappropriate': 60,
  'Other': 30
};

const SEVERITY_THRESHOLDS = {
  Critical: 90,
  High: 70,
  Medium: 40
};

ReportSchema.pre('save', async function(next) {
  // Auto-set priority based on reason
  this.priority = PRIORITY_WEIGHTS[this.reason] || 30;
  
  // Increase priority if reporter has high reputation
  if (this.reporter && typeof this.reporter.reputation?.reputationScore === 'number') {
    this.priority += Math.min(20, Math.floor(this.reporter.reputation.reputationScore / 5));
  }
  
  // Set severity level
  this.severity = 
    this.priority >= SEVERITY_THRESHOLDS.Critical ? 'Critical' :
    this.priority >= SEVERITY_THRESHOLDS.High ? 'High' :
    this.priority >= SEVERITY_THRESHOLDS.Medium ? 'Medium' : 'Low';

  // Update timestamps
  if (this.isModified('finalDecision') && this.finalDecision !== 'Pending') {
    this.resolvedAt = new Date();
  }

  this.updatedAt = new Date();
  next();
});


// Assign to 3 random moderators when report is created
ReportSchema.post('save', async function(doc) {
    if (doc.isNew) {
        const moderators = await User.aggregate([
            { $match: { role: 'moderator' } },
            { $sample: { size: 3 } }
        ]);
    
        doc.assignedModerators = moderators.map(m => m._id);
        await doc.save();
    
        // Update moderator assignments
        await User.updateMany(
            { _id: { $in: doc.assignedModerators } },
            { $push: { moderatedReports: doc._id } }
        );
    }
});

// Virtual for vote counts
ReportSchema.virtual('voteCounts').get(function() {
  return this.votes.reduce((acc, vote) => {
    if (vote.decision !== 'Pending') {
      acc[vote.decision] = (acc[vote.decision] || 0) + 1;
    }
    return acc;
  }, {});
});

// Indexes for optimized queries
ReportSchema.index({
  contentType: 1,
  finalDecision: 1,
  priority: -1
});

ReportSchema.index({
  assignedModerators: 1,
  finalDecision: 1
});

const Report = mongoose.model("Report", ReportSchema)
module.exports = Report