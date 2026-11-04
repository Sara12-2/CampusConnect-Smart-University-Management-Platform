# CampusConnect - Database Setup

### My Contribution - Task: Database Setup per Guide

This task covers the complete PostgreSQL database setup for CampusConnect platform as per the FYP guide.

### What I Did
- Configured PostgreSQL connection with SQLAlchemy in `backend/app/database.py`
- Created 8 core database models with relationships and constraints
- Added `.env.example` for database configuration
- Ensured all tables are ready for FastAPI integration

### Database Models Created (8)
Located in `backend/app/models/` :

1.  **User** - id, name, email, password, role (student/staff/admin)
2.  **Notice** - title, description, department, created_by
3.  **Complaint** - student_id, subject, status, complaint_type
4.  **LostItem** - item_name, description, location, status
5.  **Notification** - user_id, message, is_read
6.  **Reminder** - user_id, title, remind_at
7.  **ChatLog** - user_id, query, response
8.  **Base / Common** - created_at, updated_at timestamps

### Files Added by Me