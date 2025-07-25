db.receipts.insertMany([
  {
    user_id: 1,
    expense_id: 1,
    note: "Electricity bill paid via UPI",
    scanned_receipt: {
      filename: "electricity_july2025.pdf",
      filetype: "pdf",
      size_kb: 340
    },
    uploaded_at: ISODate("2025-07-25T10:30:00Z")
  },
  {
    user_id: 1,
    expense_id: 2,
    note: "Monthly grocery shopping at SuperMart",
    scanned_receipt: {
      filename: "groceries_july2025.jpeg",
      filetype: "jpeg",
      size_kb: 280
    },
    uploaded_at: ISODate("2025-07-20T15:10:00Z")
  },
  {
    user_id: 2,
    expense_id: 3,
    note: "Cab expense reimbursed by office",
    scanned_receipt: {
      filename: "cab_bill.pdf",
      filetype: "pdf",
      size_kb: 150
    },
    uploaded_at: ISODate("2025-07-18T09:50:00Z")
  },
  {
    user_id: 2,
    expense_id: 4,
    note: "Lunch meeting at Café Delight",
    scanned_receipt: {
      filename: "lunch_receipt.jpg",
      filetype: "jpg",
      size_kb: 180
    },
    uploaded_at: ISODate("2025-07-22T12:45:00Z")
  },
  {
    user_id: 3,
    expense_id: 5,
    note: "Stationery purchase for home office",
    scanned_receipt: {
      filename: "stationery_invoice.pdf",
      filetype: "pdf",
      size_kb: 120
    },
    uploaded_at: ISODate("2025-07-21T14:05:00Z")
  }
]);
// Index on user_id for fast lookup by user
db.receipts.createIndex({ user_id: 1 });

// Index on expense_id to link with MySQL data
db.receipts.createIndex({ expense_id: 1 });

// Optional: Index on filetype or date
db.receipts.createIndex({ uploaded_at: -1 });
