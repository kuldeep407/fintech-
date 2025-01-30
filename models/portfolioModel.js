import mongoose from "mongoose";

const PortfolioSchema = mongoose.Schema(
  {
    strategy: {
      type: String,
      required: true,
    },
    ROI: {
      type: Number,
      required: true,
    },
    CAGR: {
      type: Number,
      required: true,
    },
    drawdown: {
      type: Number,
      required: true,
    },
    allocation: {
      stocks: { type: Number },
      bonds: { type: Number },
      others: { type: Number },
    },
    transactions: [
      {
        description: {
          type: String,
        },
        amount: {
          type: Number,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", PortfolioSchema);
