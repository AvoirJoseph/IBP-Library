// Initial seed data for Koha NextGen ILS

export const INITIAL_BOOKS = [
  {
    id: "B-1001",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    callNumber: "QA76.76.C38 M37 2008",
    barcode: "399990148201",
    publisher: "Prentice Hall",
    year: "2008",
    itemType: "Book",
    branch: "Main Library",
    location: "Stacks / Computer Science",
    copies: 5,
    availableCopies: 3,
    coverColor: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    status: "Available",
    subjects: ["Software Engineering", "Agile", "Programming"],
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    marc: [
      { tag: "001", ind1: " ", ind2: " ", value: "0001001" },
      { tag: "020", ind1: " ", ind2: " ", value: "$a 9780132350884" },
      { tag: "100", ind1: "1", ind2: " ", value: "$a Martin, Robert C., $e author." },
      { tag: "245", ind1: "1", ind2: "0", value: "$a Clean code : $b a handbook of agile software craftsmanship / $c Robert C. Martin." },
      { tag: "260", ind1: " ", ind2: " ", value: "$a Upper Saddle River, NJ : $b Prentice Hall, $c c2008." },
      { tag: "300", ind1: " ", ind2: " ", value: "$a xxix, 434 p. : $b ill. ; $c 24 cm." },
      { tag: "650", ind1: " ", ind2: "0", value: "$a Agile software development." },
      { tag: "852", ind1: "8", ind2: " ", value: "$b MAIN $c STACKS $h QA76.76.C38 M37 2008 $p 399990148201" }
    ]
  },
  {
    id: "B-1002",
    title: "Introduction to Algorithms (4th Edition)",
    author: "Thomas H. Cormen, Charles E. Leiserson",
    isbn: "978-0262046305",
    callNumber: "QA76.6 .I58 2022",
    barcode: "399990148202",
    publisher: "MIT Press",
    year: "2022",
    itemType: "Book",
    branch: "Main Library",
    location: "Reference Desk",
    copies: 3,
    availableCopies: 1,
    coverColor: "linear-gradient(135deg, #831843 0%, #ec4899 100%)",
    status: "Available",
    subjects: ["Algorithms", "Data Structures", "Computer Science"],
    description: "A comprehensive update of the leading algorithms text, with new material on matchings in bipartite graphs, online algorithms, and machine learning.",
    marc: [
      { tag: "001", ind1: " ", ind2: " ", value: "0001002" },
      { tag: "020", ind1: " ", ind2: " ", value: "$a 9780262046305" },
      { tag: "100", ind1: "1", ind2: " ", value: "$a Cormen, Thomas H., $e author." },
      { tag: "245", ind1: "1", ind2: "0", value: "$a Introduction to algorithms / $c Thomas H. Cormen ... [et al.]." },
      { tag: "260", ind1: " ", ind2: " ", value: "$a Cambridge, MA : $b MIT Press, $c 2022." },
      { tag: "650", ind1: " ", ind2: "0", value: "$a Computer algorithms." },
      { tag: "852", ind1: "8", ind2: " ", value: "$b MAIN $c REF $h QA76.6 .I58 2022 $p 399990148202" }
    ]
  },
  {
    id: "B-1003",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1449373320",
    callNumber: "QA76.9.D3 K54 2017",
    barcode: "399990148203",
    publisher: "O'Reilly Media",
    year: "2017",
    itemType: "Book",
    branch: "Science Branch",
    location: "Stacks / Databases",
    copies: 4,
    availableCopies: 0,
    coverColor: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
    status: "Checked Out",
    subjects: ["Distributed Systems", "Database Design", "System Architecture"],
    description: "Data is at the center of many challenges in system design today. Difficult issues such as scalability, consistency, and reliability need to be figured out.",
    marc: [
      { tag: "001", ind1: " ", ind2: " ", value: "0001003" },
      { tag: "020", ind1: " ", ind2: " ", value: "$a 9781449373320" },
      { tag: "100", ind1: "1", ind2: " ", value: "$a Kleppmann, Martin, $e author." },
      { tag: "245", ind1: "1", ind2: "0", value: "$a Designing data-intensive applications / $c Martin Kleppmann." },
      { tag: "260", ind1: " ", ind2: " ", value: "$a Sebastopol, CA : $b O'Reilly Media, $c 2017." },
      { tag: "852", ind1: "8", ind2: " ", value: "$b SCIENCE $c STACKS $h QA76.9.D3 K54 2017 $p 399990148203" }
    ]
  },
  {
    id: "B-1004",
    title: "Artificial Intelligence: A Modern Approach (4th Ed)",
    author: "Stuart Russell, Peter Norvig",
    isbn: "978-0134610993",
    callNumber: "Q335 .R86 2020",
    barcode: "399990148204",
    publisher: "Pearson",
    year: "2020",
    itemType: "Book",
    branch: "Main Library",
    location: "Reserves",
    copies: 6,
    availableCopies: 4,
    coverColor: "linear-gradient(135deg, #581c87 0%, #a855f7 100%)",
    status: "Available",
    subjects: ["Artificial Intelligence", "Machine Learning", "Robotics"],
    description: "The long-anticipated revision of this best-selling text offers the most comprehensive, up-to-date introduction to AI.",
    marc: [
      { tag: "001", ind1: " ", ind2: " ", value: "0001004" },
      { tag: "020", ind1: " ", ind2: " ", value: "$a 9780134610993" },
      { tag: "100", ind1: "1", ind2: " ", value: "$a Russell, Stuart J. (Stuart Jonathan), $e author." },
      { tag: "245", ind1: "1", ind2: "0", value: "$a Artificial intelligence : $b a modern approach / $c Stuart Russell, Peter Norvig." },
      { tag: "260", ind1: " ", ind2: " ", value: "$a Hoboken, NJ : $b Pearson, $c [2020]" },
      { tag: "852", ind1: "8", ind2: " ", value: "$b MAIN $c RESERVES $h Q335 .R86 2020 $p 399990148204" }
    ]
  },
  {
    id: "B-1005",
    title: "Nature - Scientific Journal (Vol. 628)",
    author: "Springer Nature",
    isbn: "ISSN 0028-0836",
    callNumber: "Q1 .N2 2026",
    barcode: "399990148205",
    publisher: "Nature Publishing Group",
    year: "2026",
    itemType: "Journal",
    branch: "Science Branch",
    location: "Current Serials",
    copies: 2,
    availableCopies: 2,
    coverColor: "linear-gradient(135deg, #7c2d12 0%, #f97316 100%)",
    status: "Available",
    subjects: ["Science", "Research", "Multidisciplinary"],
    description: "Weekly international scientific journal publishing peer-reviewed research across all science domains.",
    marc: [
      { tag: "001", ind1: " ", ind2: " ", value: "0001005" },
      { tag: "022", ind1: " ", ind2: " ", value: "$a 0028-0836" },
      { tag: "245", ind1: "0", ind2: "0", value: "$a Nature : $b international weekly journal of science." },
      { tag: "852", ind1: "8", ind2: " ", value: "$b SCIENCE $c SERIALS $h Q1 .N2 2026 $p 399990148205" }
    ]
  },
  {
    id: "B-1006",
    title: "The Pragmatic Programmer: 20th Anniversary Edition",
    author: "David Thomas, Andrew Hunt",
    isbn: "978-0135957059",
    callNumber: "QA76.6 .H85 2019",
    barcode: "399990148206",
    publisher: "Addison-Wesley",
    year: "2019",
    itemType: "Book",
    branch: "Main Library",
    location: "Stacks",
    copies: 3,
    availableCopies: 2,
    coverColor: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    status: "Available",
    subjects: ["Software Engineering", "Career", "Best Practices"],
    description: "Illustrates the best approaches and major pitfalls of many aspects of software development.",
    marc: [
      { tag: "001", ind1: " ", ind2: " ", value: "0001006" },
      { tag: "020", ind1: " ", ind2: " ", value: "$a 9780135957059" },
      { tag: "100", ind1: "1", ind2: " ", value: "$a Thomas, David, $e author." },
      { tag: "245", ind1: "1", ind2: "0", value: "$a The pragmatic programmer : $b your journey to mastery / $c David Thomas, Andrew Hunt." },
      { tag: "852", ind1: "8", ind2: " ", value: "$b MAIN $c STACKS $h QA76.6 .H85 2019 $p 399990148206" }
    ]
  }
];

export const INITIAL_PATRONS = [
  {
    id: "P-8801",
    cardNum: "2390100491",
    name: "Alex Rivera",
    email: "arivera@university.edu",
    phone: "+1 (555) 234-5678",
    category: "Student",
    branch: "Main Library",
    status: "Active",
    borrowedCount: 2,
    fineBalance: 0.00,
    expiryDate: "2027-06-30",
    avatarColor: "#3b82f6"
  },
  {
    id: "P-8802",
    cardNum: "2390100492",
    name: "Dr. Eleanor Vance",
    email: "evance@university.edu",
    phone: "+1 (555) 876-5432",
    category: "Faculty",
    branch: "Science Branch",
    status: "Active",
    borrowedCount: 3,
    fineBalance: 4.50,
    expiryDate: "2028-12-31",
    avatarColor: "#8b5cf6"
  },
  {
    id: "P-8803",
    cardNum: "2390100493",
    name: "Marcus Brody",
    email: "mbrody@university.edu",
    phone: "+1 (555) 345-6789",
    category: "Research Fellow",
    branch: "Main Library",
    status: "Active",
    borrowedCount: 1,
    fineBalance: 0.00,
    expiryDate: "2027-08-15",
    avatarColor: "#10b981"
  },
  {
    id: "P-8804",
    cardNum: "2390100494",
    name: "Sophia Chen",
    email: "schen@student.edu",
    phone: "+1 (555) 987-6543",
    category: "Student",
    branch: "Main Library",
    status: "Suspended (Fine)",
    borrowedCount: 1,
    fineBalance: 12.00,
    expiryDate: "2026-11-30",
    avatarColor: "#ef4444"
  },
  {
    id: "P-8805",
    cardNum: "2390100495",
    name: "James Wilson",
    email: "jwilson@community.org",
    phone: "+1 (555) 456-7890",
    category: "Guest / Visitor",
    branch: "Law Library",
    status: "Active",
    borrowedCount: 0,
    fineBalance: 0.00,
    expiryDate: "2026-12-01",
    avatarColor: "#f59e0b"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TX-901",
    itemBarcode: "399990148203",
    bookTitle: "Designing Data-Intensive Applications",
    patronCardNum: "2390100491",
    patronName: "Alex Rivera",
    issueDate: "2026-08-15",
    dueDate: "2026-09-05",
    status: "Issued",
    branch: "Science Branch"
  },
  {
    id: "TX-902",
    itemBarcode: "399990148202",
    bookTitle: "Introduction to Algorithms (4th Edition)",
    patronCardNum: "2390100492",
    patronName: "Dr. Eleanor Vance",
    issueDate: "2026-08-01",
    dueDate: "2026-08-22",
    status: "Overdue",
    branch: "Main Library"
  },
  {
    id: "TX-903",
    itemBarcode: "399990148201",
    bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
    patronCardNum: "2390100494",
    patronName: "Sophia Chen",
    issueDate: "2026-08-10",
    dueDate: "2026-08-24",
    status: "Overdue",
    branch: "Main Library"
  }
];

export const KOHA_SYSTEM_PREFS = {
  libraryName: "Metropolitan University Koha ILS",
  defaultBranch: "Main Library",
  fineRatePerDay: 0.50,
  maxLoansStudent: 5,
  maxLoansFaculty: 15,
  loanDurationDays: 14,
  renewLimit: 2,
  allowSelfCheckout: true,
  opacPublicAccess: true,
  branches: [
    { code: "MAIN", name: "Main Campus Central Library" },
    { code: "SCIENCE", name: "Science & Engineering Library" },
    { code: "LAW", name: "Law & Jurisprudence Library" },
    { code: "MED", name: "Medical Center Library" }
  ]
};

export const MOCK_SQL_QUERIES = [
  {
    name: "List Overdue Loans & Calculated Fines",
    sql: "SELECT tx.id, tx.bookTitle, p.name AS patron, DATEDIFF(NOW(), tx.dueDate) AS days_overdue, (DATEDIFF(NOW(), tx.dueDate) * 0.50) AS estimated_fine FROM transactions tx JOIN patrons p ON tx.patronCardNum = p.cardNum WHERE tx.status = 'Overdue';"
  },
  {
    name: "Top Borrowed Items Count",
    sql: "SELECT b.title, b.author, b.isbn, COUNT(tx.id) AS total_checkouts FROM books b LEFT JOIN transactions tx ON b.barcode = tx.itemBarcode GROUP BY b.id ORDER BY total_checkouts DESC;"
  },
  {
    name: "Patrons with Balance > $0",
    sql: "SELECT cardNum, name, category, fineBalance, status FROM patrons WHERE fineBalance > 0 ORDER BY fineBalance DESC;"
  }
];
