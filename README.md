# Estudiar

**Estudiar** is a study buddy network for students. Members share what they are studying, browse a study feed, see who is studying right now and track their weekly study hours on a dashboard.

This is an individual project for **IMS566 Advanced Web Design Development and Content Management**. It is a front-end prototype: there is no backend or database, and all sample data is hardcoded.

- **Live website:** https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
- **Repository:** https://github.com/YOUR-USERNAME/YOUR-REPO-NAME

## Features

- **Login and sign up** with simulated authentication, clear error messages (empty fields, wrong credentials, taken username, weak password) and a show/hide password toggle
- **Consistent, responsive navigation bar** on every page, with a notifications menu and an account menu with log out
- **Dashboard** with weekly stats (hours, sessions, active days, groups), a weekly goal bar, who is studying now and upcoming group sessions
- **Interactive chart** (Chart.js) that switches between hours per day (stacked bar) and share per subject (doughnut). The numbers are calculated from the same data as the stat cards.
- **Study feed** (cards): subject filter chips, search, like button and a form to post your own update
- **Members page** (table): search, sortable columns, a sort menu and a "studying now" status. On phones the table turns into cards.
- **Protected pages:** visiting any page without logging in sends you back to the login page
- **Footer and page metadata** (title, description, author and keywords) on every page

## How to test the login

Use the test account:

| Username | Password |
|----------|----------|
| `hisham` | `estudiar123` |

You can also open the **Sign up** tab, create your own account and log in with it. New accounts are saved in the browser's `localStorage`, so they only exist in that browser.

To check error handling, try an empty form, a wrong password or a username that does not exist.

## Frameworks and libraries used

- [Bootstrap 5.3](https://getbootstrap.com/) for layout, grid, navbar and dropdowns
- [Chart.js 4.4](https://www.chartjs.org/) for the dashboard chart
- [Google Fonts](https://fonts.google.com/): Bricolage Grotesque and DM Sans
- Plain HTML, CSS and JavaScript (no build step)

## Project structure

```
estudiar/
├── index.html        Login and sign up
├── dashboard.html    Dashboard with chart
├── feed.html         Study feed (cards)
├── members.html      Members (table)
├── css/
│   └── style.css     Theme colours and all custom styles
├── js/
│   ├── auth.js       Simulated login, sign up and session helpers
│   ├── layout.js     Shared navbar and footer
│   ├── data.js       Sample data for all pages
│   ├── dashboard.js  Dashboard stats and chart
│   ├── feed.js       Feed filters, search, likes and new posts
│   └── members.js    Members search and sorting
└── README.md
```

## Run it locally

Download or clone the repository, then either:

- copy the `estudiar` folder into XAMPP's `htdocs` folder, start Apache and open `http://localhost/estudiar/`, or
- open `index.html` directly in Google Chrome.

An internet connection is needed because Bootstrap, Chart.js and the fonts load from a CDN.

## Notes

- Best viewed in Google Chrome on desktop or mobile.
- Data is simulated. Posts and accounts are saved in `localStorage`, so they are per browser and are not shared between devices.
- The theme colours are defined as CSS variables at the top of `css/style.css`.
