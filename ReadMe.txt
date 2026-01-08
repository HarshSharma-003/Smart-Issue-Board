Smart Issue Board

Overview

Smart Issue Board is a simple web application built as part of an internship assignment.
The goal of this project is to manage issues (bugs, tasks, or requests) in a structured way while keeping the solution practical and easy to understand.
The application allows users to log in, create issues, view all issues in real time, and manage them using Firebase as the backend.

Tech Stack Used

Frontend

HTML
CSS
JavaScript 

Backend/Database

Firebase Firestore
Authentication
Firebase Authentication (Email & Password)
Hosting
Vercel
Code Hosting
GitHub (Public Repository)


Ques 1. Why did u choose the frontend stack u used?

I chose plain HTML, CSS, and JavaScript because the project requirements did not demand a heavy frontend framework. This helped me focus more on logic, Firebase integration, and problem-solving rather than setup complexity.


Features Implemented

1. Authentication

Users can sign up and log in using email and password.

Firebase Authentication handles security.

The logged-in user’s email is displayed on the dashboard.

Unauthorized users are redirected back to the login page.


2. Create Issue

Each issue contains:

Title
Description
Priority (Low / Medium / High)
Status (Open by default)
Created Time
Created By (user email)
Issues are stored in Firebase Firestore.

3. Similar Issue Handling

-> While creating a new issue:

The app checks existing issues in the database.
If a similar title already exists, a warning message is shown.
The user can decide whether to continue or cancel.
This helps reduce duplicate issues without completely blocking the user.

4. Issue List

All issues are displayed in real time using Firestore listeners.
Issues are sorted by newest first.
Each issue shows title, priority, status, creator, and description.

5. Logout

Users can securely log out.
After logout, the user is redirected to the login page.


Ques 2. Explain your Firestore Data Structure?

Collection: issues

Each document contains:
title (string)
description (string)
priority (string)
status (string)
createdAt (timestamp)
createdBy (string – user email)

-> This structure is simple and easy to scale for future improvements.

Ques 3. Challenges Faced

Understanding how Firebase Authentication and Firestore work together
Detecting similar issues without making the logic too complex
Handling real-time updates properly
Managing authentication state between pages

Ques 4. What I Would Improve Next?

Add issue assignment to specific users
Add comments on issues
Improve UI design and responsiveness
Add pagination for large issue lists
Use Firestore security rules more strictly

Ques 5. Deployment

-> The project is deployed on Vercel and connected directly to the GitHub repository.


Live URL: https://smart-issue-board-navy.vercel.app/


GitHub Repository


