# CampusConnect

**CampusConnect** is a web-based university management and student services platform designed to bring important campus services into one place.

The system combines a **Smart Digital Notice Board**, **University Complaint & Issue Management System**, and **University Lost & Found System** into a single platform.

It helps students stay updated with university notices, report campus-related problems, find lost items, and interact with university administration through an easy-to-use web interface.

---

## Project Overview

In universities, students often need to use different platforms or contact different departments for common campus-related activities such as checking notices, reporting classroom or laboratory issues, or finding lost belongings.

**CampusConnect** provides a centralized platform where these services can be managed together.

The system provides separate functionality for **students** and **administrators**, making it easier to publish information, manage complaints, handle lost and found items, and keep students informed.

---

## Main Modules

### 1. Smart Digital Notice Board

The Notice Board module allows university administrators to publish and manage important notices.

Students can:

* View university notices
* Search notices
* Filter notices according to department and semester
* View notice details
* See notice deadlines
* Receive deadline reminders
* Receive notifications for important notices
* View pinned/important notices
* Get short AI-generated summaries of lengthy notices

Administrators can:

* Create notices
* Edit notices
* Delete notices
* Pin important notices
* Set notice deadlines
* Target notices to specific departments and semesters
* Manage published notices

---

### 2. University Complaint & Issue Management

This module allows students to report problems and issues within the university.

Students can report issues related to:

* Classrooms
* Computer Labs
* Electricity
* Wi-Fi
* Furniture
* Other campus facilities

Students can:

* Submit complaints
* Add complaint descriptions
* Upload images as evidence
* Select complaint category
* Track complaint status
* View complaint history
* Check updates on submitted complaints

Administrators can:

* View all complaints
* Filter complaints by category and status
* Assign complaints to responsible staff
* Update complaint status
* Monitor pending and resolved complaints
* Manage complaints through an admin dashboard

### Complaint Status

The system can use statuses such as:

`Submitted → Assigned → In Progress → Resolved`

---

### 3. University Lost & Found

The Lost & Found module helps students report lost or found items within the university.

Users can:

* Report a lost item
* Report a found item
* Add item name and description
* Upload item images
* Add location information
* Add date and time
* Search for lost or found items
* Filter listings
* Submit a claim for an item

Administrators can:

* Manage lost and found listings
* Manage submitted claims
* Verify claims
* Manage users
* Remove inappropriate listings
* Monitor the Lost & Found system

---

## AI Feature

CampusConnect also includes an AI-powered feature for the Digital Notice Board.

### AI Notice Summarization

Long university notices can sometimes contain a lot of information.

The system can generate a short and easy-to-understand summary of a notice.

For example:

**Original Notice:**

A lengthy university announcement containing details about registration dates, required documents, fees, deadlines, and instructions.

**AI Summary:**

> Registration starts on 20 September. Students must submit the required documents before 30 September. Late submissions may not be accepted.

This helps students quickly understand the important information without reading the complete notice first.

---

## User Roles

### Student

Students can:

* Register/Login
* View notices
* Search and filter notices
* Receive notifications
* View AI summaries
* Submit complaints
* Upload complaint images
* Track complaint status
* Report lost items
* Report found items
* Search Lost & Found listings
* Submit item claims

### Administrator

Administrators can:

* Login to the admin panel
* Manage students/users
* Create and manage notices
* Pin important notices
* Manage notice deadlines
* Manage complaints
* Assign complaints to staff
* Update complaint status
* Manage Lost & Found listings
* Review item claims
* Monitor system activity
* View dashboard statistics

---

## Admin Dashboard

The admin dashboard provides an overview of the university platform.

Possible dashboard statistics include:

* Total Students
* Total Notices
* Active Notices
* Pending Complaints
* Resolved Complaints
* Lost Items
* Found Items
* Pending Claims

The dashboard can also display recent complaints, recent notices, and recent Lost & Found reports.

---

## Key Features

* Student Authentication
* Admin Authentication
* Role-Based Access
* Smart Digital Notice Board
* Department-Based Notices
* Semester-Based Notices
* Notice Search & Filtering
* Pinned Notices
* Deadline Reminders
* Notifications
* AI Notice Summarization
* Complaint Submission
* Complaint Image Upload
* Complaint Status Tracking
* Complaint Assignment
* Lost Item Reporting
* Found Item Reporting
* Image Uploads
* Item Search & Filtering
* Item Claim System
* Admin Dashboard
* User Management

---

## Suggested Website Structure

```text
CampusConnect
│
├── Home
├── Notices
│   ├── All Notices
│   ├── Important Notices
│   └── Notice Details
│
├── Complaints
│   ├── Submit Complaint
│   ├── My Complaints
│   └── Complaint Details
│
├── Lost & Found
│   ├── Lost Items
│   ├── Found Items
│   ├── Report Lost Item
│   ├── Report Found Item
│   └── Item Details
│
├── Notifications
│
├── Student Profile
│
└── Admin Panel
    ├── Dashboard
    ├── Users
    ├── Notices
    ├── Complaints
    ├── Lost & Found
    └── Claims
```

---

## Basic Workflow

### Notice Workflow

```text
Admin Creates Notice
        ↓
Select Department / Semester
        ↓
Publish Notice
        ↓
Student Receives Notification
        ↓
Student Views Notice
        ↓
AI Summary Available
        ↓
Deadline Reminder
```

### Complaint Workflow

```text
Student Submits Complaint
        ↓
Admin Reviews Complaint
        ↓
Complaint Assigned to Staff
        ↓
Staff Works on Issue
        ↓
Status Updated
        ↓
Complaint Resolved
```

### Lost & Found Workflow

```text
Student Reports Lost/Found Item
        ↓
Listing Published
        ↓
Other Students Search Listings
        ↓
Student Finds Matching Item
        ↓
Claim Submitted
        ↓
Admin Verifies Claim
        ↓
Item Returned
```

---

## Technology Stack

The project can be developed using the technologies taught in the Web Technologies course.

### Frontend

* HTML5
* CSS3
* Bootstrap
* JavaScript

### Backend

* Flask / Python

### Database

* MySQL

### AI

* AI API for notice summarization

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Browser Developer Tools

---

## Database Modules

The database can contain tables such as:

```text
users
departments
notices
notifications
complaints
complaint_images
staff
lost_found_items
claims
```

The exact database structure can be expanded according to the final implementation.

---

## Security

The system should include basic security features such as:

* User authentication
* Admin authentication
* Password protection
* Role-based access control
* Input validation
* File upload validation
* Protected admin routes
* Secure database queries

---

## Project Objectives

The main objectives of CampusConnect are:

1. To provide a centralized platform for university students.
2. To make university notices easier to access and search.
3. To help students report and track campus issues.
4. To provide a digital Lost & Found system.
5. To improve communication between students and administration.
6. To reduce manual handling of common student services.
7. To use AI to simplify lengthy university notices.

---

## Future Improvements

Future versions of CampusConnect can include:

* Email notifications
* Mobile application
* Real-time notifications
* WhatsApp notifications
* Advanced AI notice summarization
* AI chatbot for university information
* Complaint priority detection
* Analytics and reports
* Staff-specific dashboards
* QR-based item verification
* Multi-language support

---

## Project Status

**Status:** In Development

CampusConnect is being developed as a semester project for the **Web Technologies** course.

---

## Team

**Project:** CampusConnect
**Type:** University Web Application
**Course:** Web Technologies
**Purpose:** Semester Project
