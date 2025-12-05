# TaskMate

## Overview

TaskMate is a student-focused app that helps you organize school tasks, track deadlines, and prioritize work by urgency — all in one clean, easy-to-use space.

Built for COMP 1800, TaskMate applies User-Centred Design principles and agile development practices. The app uses Firebase Firestore to store user tasks in real time and supports simple task management to help students stay on top of their workload.
---

## Features

- Add, edit, and delete tasks
- Track deadlines and due dates
- Prioritize tasks by urgency
- Mark tasks as complete
- Join/Create a group and share your task with classmates

---

## Technologies Used

- **Frontend**: HTML, CSS, Tailwind, JavaScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase
- **Database**: Firestore

---

## Usage

1. Open your browser and visit `https://dtc09-4e5fe.web.app/`.
2. Add school tasks with titles, due dates, and urgency levels.
3. Check off tasks as you complete them.
4. Join/Create a group and share your task with classmates.

---

## Project Structure

```
1800_202530_DTC09/
├── .firebase/                 
├── images/                    
├── src/                      
│   ├── auth/                 
│   ├── components/          
│   │   ├── site-bottom-bar.js
│   │   ├── site-footer.js
│   │   ├── site-loader.js
│   │   └── site-navbar.js
│   ├── groups/                # Group-related modules
│   │   ├── groupsAddGroup.js
│   │   ├── groupsAddTask.js
│   │   ├── groupsEdit.js
│   │   ├── groupsLoad.js
│   │   ├── groupsSave.js
│   │   ├── groupsTaskEdit.js
│   │   └── groupsTasks.js
│   ├── styles/                # CSS styles
│   │   ├── dark.css
│   │   ├── overlay.css
│   │   ├── signup.css
│   │   ├── style.css
│   │   └── tasks.css
│   ├── firebase.js            # Firebase configuration (existing)
│   ├── utils.js               # Utility/helper functions (existing)
│   ├── app.js
│   ├── authentication.js
│   ├── completedTask.js
│   ├── firebaseConfig.js      # Optional: can wrap or replace firebase.js
│   ├── loader.js
│   ├── loginSignup.js
│   ├── main.js                # Main app script (entry point)
│   ├── mainDashboard.js
│   ├── profile.js
│   ├── review.js
│   ├── taskEdit.js
│   ├── taskLoad.js
│   └── taskSave.js
│
├── .env                     
├── .firebaserc               
├── .gitignore              
│
├── aboutUs.html               
├── addTask.html               # Create new task page
├── completedTask.html         # Completed tasks page
├── faq.html                   # FAQ page
│
├── firebase.json              
├── firestore.indexes.json     
├── firestore.rules            
│
├── groupAddTask.html          # Add task within a group
├── groupCreate.html           # Create group page
├── groupDetail.html           # Group detail page
├── groupTasks.html            # View tasks inside a group
├── groups.html                # Groups overview page
│
├── index.html                 # Landing page
├── login.html                 # Login page
├── main.html                  # Main dashboard
│
├── package.json               # Project metadata & dependencies
├── package-lock.json          # Dependency lock file
│
├── profile.html               # User profile page
│
├── review.html                # Review for developer page
├── skeleton.html             
│
├── taskDetail.html            # Task detail page (individual)
├── taskDetailGroup.html       # Task detail page (inside a group)
├── viewTasks.html             # View all tasks page
│
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation```

---

## Contributors
- **Ryan** - designed the overall user interface, built the Task Detail page, implemented dark mode, and refined the app’s visual consistency to create a clean and student-friendly experience. He also developed the Index (Home) page, created the FAQ page.
- **Brendan** - implemented all major write operations, built the Add Task page, and developed the complete group system—including creating groups, joining groups, adding tasks to groups, and editing group tasks. 
- **Faye** - built the To-Do Tasks page, implemented database read functionality, and developed the Profile page. She also implemented the Sign-In and Sign-Up features and created the Review/Retrospective page, ensuring smooth user flow throughout the app. 
---

## Acknowledgments

- Firebase documentation for technical references
- Icons sourced from [FontAwesome](https://fontawesome.com/).

---

## Limitations and Future Work

### Limitations

- No notifications or reminders
- Limited accessibility features

### Future Work

- Push notifications for upcoming deadlines
- Drag-and-drop task ordering

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
