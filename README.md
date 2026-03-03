# Join – Task Manager

Join is a task management application inspired by the Kanban system.
It allows users to create, organize, and manage tasks efficiently using drag-and-drop functionality. Tasks can be assigned to users and categorized for better workflow organization.

## Features

- Create, edit and delete tasks
- Drag & Drop functionality (Kanban board)
- Assign tasks to specific users
- Categorize tasks
- Responsive design
- Firebase backend integration

## Tech Stack

- Angular
- TypeScript
- HTML5
- CSS3
- Firebase (Authentication & Database)

## Kanban Workflow

Tasks are organized into different workflow columns, such as:

- To Do
- In Progress
- Awaiting Feedback
- Done

This structure helps users track the progress of their tasks in a clear and visual way.

## Installation & Setup

To run this project locally:

`git clone <https://github.com/nadine-wirtgen/join.git>`
`cd join`
`npm install`
`ng s -o`

Make sure you have Node.js and Angular CLI installed globally:

`npm install -g @angular/cli`

## Firebase Configuration

This project uses Firebase for backend services.
To run it locally, you need to:

- Create a Firebase project.
- Add your Firebase configuration inside the environment file.
- Enable the required Firebase services (Authentication, Firestore or Realtime Database).

## About the Project

This project was developed as part of a web development training program.
The focus was on building a structured Angular application, working with components, services, routing, and connecting a Firebase backend.

## Author

Developed by Nadine Wirtgen, Patricia Linne, Frank Meckel and Altin Torba
