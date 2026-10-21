// Template for emi-tracker/data.js — copy to data.js and fill in.
// data.js is gitignored so personal financial figures never get committed.
window.EMI_DATA = {
  asOf: "YYYY-MM-DD",
  source: "manual",
  netWorth: 0,

  loans: [
    {
      name: "Home Loan",
      lender: "Bank name",
      balance: 5000000,
      rate: 8.5,          // annual %
      tenureMonths: 240   // remaining months
    }
  ],

  cards: [
    { name: "Card •• 1234", due: 0, dueDate: "YYYY-MM-DD" }
  ]
};
