import Portfolio from "../models/portfolioModel.js";

export const addPortfolio = async (req, res) => {
  try {
    const { strategy, ROI, CAGR, drawdown, allocation, transactions } =
      req.body;

    const portfolio = new Portfolio({
      strategy,
      ROI,
      CAGR,
      drawdown,
      allocation,
      transactions,
    });

    await portfolio.save();
    res.status(201).json({
      success: true,
      message: "Portfolio added successfully !",
      portfolio,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error !" });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();

    if (!portfolios || portfolios.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No portfolio found !" });
    }

    res.status(200).json({
      success: true,
      message: "Portfolios fetched successfully !",
      portfolios,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const filterPortfolioData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const portfolios = await Portfolio.find({
      "transactions.date": {
        $gte: start,
        $lte: end,
      },
    });

    if (portfolios.length === 0) {
      return res
        .status(404)
        .json({ error: "No portfolios found within the selected date range." });
    }

    const filteredPortfolios = portfolios
      .map((portfolio) => {
        const transactions = portfolio.transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= start && transactionDate <= end;
        });

        if (transactions.length === 0) return null;

        const totalValue = transactions.reduce(
          (acc, transaction) => acc + (transaction.amount || 0),
          0
        );
        const profitableTransactions = transactions.filter(
          (transaction) => transaction.amount > 0
        ).length;
        const winRate =
          transactions.length > 0
            ? (profitableTransactions / transactions.length) * 100
            : 0;

        return {
          strategy: portfolio.strategy || "N/A",
          totalValue: totalValue.toFixed(2),
          winRate: winRate.toFixed(2),
          transactions: transactions.length,
        };
      })
      .filter((portfolio) => portfolio !== null);

    return res.json({ portfolios: filteredPortfolios });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
