/* ==========================================================
   Estudiar - sample data (hardcoded, no database)
   The dashboard stats and charts are calculated from this,
   so the numbers always match what the chart shows.
   ========================================================== */

// Days of the week used on the chart's x-axis
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Hours studied per day, per subject, for the current week
const SUBJECTS = [
  { name: "Web Development",  color: "#ffc83d", hours: [1.5, 0,    2,   0,    0, 0,   1] },
  { name: "UX Design",        color: "#6ea8ff", hours: [0.75, 0,   0.5, 0,    0, 1.5, 0] },
  { name: "Project Quality",  color: "#7be0c3", hours: [0,   1,    0,   0.75, 0, 1,   0] },
  { name: "Decision Making",  color: "#ff9fb2", hours: [0,   0.75, 0,   0.75, 0, 0,   0] }
];

const WEEKLY_GOAL_HOURS = 15;
const GROUPS_JOINED = 3;

// Who is studying right now
const STUDYING_NOW = [
  { name: "Aina",   initials: "AN", subject: "Database Systems", minutes: 42 },
  { name: "Daniel", initials: "DR", subject: "Calculus II",      minutes: 18 },
  { name: "Sofea",  initials: "SL", subject: "Web Design",       minutes: 65 }
];

// Upcoming group study sessions
const UPCOMING = [
  { day: "Mon", date: "9 Nov",  title: "Web Dev revision",   group: "Web Wizards",  time: "8:00 PM" },
  { day: "Wed", date: "11 Nov", title: "UX case study prep", group: "UX Circle",    time: "3:30 PM" },
  { day: "Fri", date: "13 Nov", title: "Quality mgmt recap", group: "PQ Study Hub", time: "9:00 PM" }
];

// ----------------------------------------------------------
// Feed posts (feed.html). "subject" must match a name in SUBJECTS
// so the tag colour lines up with the dashboard chart.
// ----------------------------------------------------------
const FEED_POSTS = [
  { name: "Aina Najwa",   initials: "AN", subject: "Web Development", minutes: 75,  time: "12 min ago", likes: 14,
    text: "Finally got my navbar to collapse properly on mobile. Bootstrap breakpoints make sense now." },
  { name: "Daniel Raj",   initials: "DR", subject: "Project Quality", minutes: 50,  time: "40 min ago", likes: 6,
    text: "Went through the cost of quality categories again. Prevention vs failure costs is easier with real examples." },
  { name: "Sofea Lee",    initials: "SL", subject: "UX Design",       minutes: 90,  time: "1 h ago",    likes: 21,
    text: "Finished a heuristic evaluation of a clinic booking app. Found 9 issues, mostly around error messages." },
  { name: "Irfan Hakim",  initials: "IH", subject: "Decision Making", minutes: 45,  time: "2 h ago",    likes: 4,
    text: "Practised building a decision matrix for our group case. Weighting the criteria is the hard part." },
  { name: "Nurul Izzah",  initials: "NI", subject: "Web Development", minutes: 120, time: "3 h ago",    likes: 17,
    text: "Two hours on Chart.js. Stacked bars are way easier than I expected. Looking for someone to compare dashboards with." },
  { name: "Wei Jian",     initials: "WJ", subject: "UX Design",       minutes: 60,  time: "5 h ago",    likes: 9,
    text: "Drafted personas for my assignment. Starting with real interview quotes helped a lot." },
  { name: "Aisyah Rahim", initials: "AR", subject: "Project Quality", minutes: 80,  time: "Yesterday",  likes: 11,
    text: "Made flashcards for quality management tools: Pareto charts, fishbone diagrams and control charts." },
  { name: "Hafiz Zulkifli", initials: "HZ", subject: "Decision Making", minutes: 35, time: "Yesterday", likes: 3,
    text: "Short session on bounded rationality. Anyone want to do a quick quiz swap tonight?" }
];

// ----------------------------------------------------------
// Members (members.html)
// ----------------------------------------------------------
const MEMBERS = [
  { name: "Aina Najwa",     initials: "AN", course: "Information Systems",  subject: "Web Development", hours: 14.5, days: 7, studying: true },
  { name: "Sofea Lee",      initials: "SL", course: "Business Computing",   subject: "UX Design",       hours: 12.0, days: 6, studying: true },
  { name: "Hisham",         initials: "H",  course: "Information Systems",  subject: "Web Development", hours: 11.5, days: 6, studying: false },
  { name: "Nurul Izzah",    initials: "NI", course: "Computer Science",     subject: "Web Development", hours: 10.25, days: 5, studying: false },
  { name: "Daniel Raj",     initials: "DR", course: "Business Computing",   subject: "Project Quality", hours: 9.0,  days: 5, studying: true },
  { name: "Aisyah Rahim",   initials: "AR", course: "Information Systems",  subject: "Project Quality", hours: 8.5,  days: 4, studying: false },
  { name: "Wei Jian",       initials: "WJ", course: "Computer Science",     subject: "UX Design",       hours: 7.75, days: 5, studying: false },
  { name: "Irfan Hakim",    initials: "IH", course: "Business Computing",   subject: "Decision Making", hours: 6.0,  days: 4, studying: false },
  { name: "Hafiz Zulkifli", initials: "HZ", course: "Information Systems",  subject: "Decision Making", hours: 4.5,  days: 3, studying: false },
  { name: "Mei Ling",       initials: "ML", course: "Computer Science",     subject: "UX Design",       hours: 3.0,  days: 2, studying: false }
];
