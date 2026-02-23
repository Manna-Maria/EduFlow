# EduFlow Backend - Member 2 Implementation

## Overview
This document describes the implementation of Member 2 – Admin + Course & Video Management for the EduFlow backend.

## Database Models

### Course Model (`models/Course.js`)
- **Title**: Course name (max 100 characters)
- **Description**: Course description (max 1000 characters)
- **Category**: One of [Programming, Design, Business, Science, Math, Languages, Other]
- **Instructor**: Name of the instructor
- **InstructorEmail**: Email of the instructor
- **Duration**: Course duration in hours
- **Level**: One of [Beginner, Intermediate, Advanced]
- **Thumbnail**: Course thumbnail image URL
- **Videos**: Array of Video references
- **Modules**: Array of course modules with sections
- **EnrolledStudents**: Array of User references
- **TotalStudents**: Count of enrolled students
- **Rating**: Course rating (0-5)
- **IsPublished**: Boolean flag for publication status
- **Timestamps**: CreatedAt and UpdatedAt

### Video Model (`models/Video.js`)
- **Title**: Video title (max 100 characters)
- **Description**: Video description (max 1000 characters)
- **CourseId**: Reference to parent Course
- **VideoUrl**: URL to the video file
- **Duration**: Video duration in seconds
- **Thumbnail**: Video thumbnail image URL
- **UploadedBy**: Reference to User who uploaded
- **Order**: Video order in the course
- **Module**: Module name (optional)
- **Section**: Section name (optional)
- **FileSize**: Size in bytes
- **MimeType**: Video MIME type
- **ViewCount**: Number of views
- **IsPublished**: Boolean flag for publication status
- **Quiz**: Array of Question references
- **Timestamps**: CreatedAt and UpdatedAt

## API Endpoints

### Course Endpoints

#### Create Course
```http
POST /api/courses
Content-Type: application/json

{
  "title": "Introduction to React",
  "description": "Learn React fundamentals",
  "category": "Programming",
  "instructor": "John Doe",
  "instructorEmail": "john@example.com",
  "duration": 20,
  "level": "Beginner",
  "thumbnail": "https://example.com/thumb.jpg"
}
```

#### Get All Courses
```http
GET /api/courses?category=Programming&level=Beginner&isPublished=true
```

#### Get Course by ID
```http
GET /api/courses/:courseId
```

#### Update Course
```http
PUT /api/courses/:courseId
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublished": true
}
```

#### Delete Course
```http
DELETE /api/courses/:courseId
```

#### Add Module to Course
```http
POST /api/courses/:courseId/modules
Content-Type: application/json

{
  "title": "Module 1",
  "description": "First module"
}
```

#### Get Course Statistics
```http
GET /api/courses/:courseId/stats
```

### Video Endpoints

#### Upload Video
```http
POST /api/videos
Content-Type: multipart/form-data

{
  "title": "Lesson 1",
  "description": "First lesson",
  "courseId": "course_id_here",
  "duration": 300,
  "order": 0,
  "module": "Module 1",
  "section": "Introduction",
  "uploadedBy": "user_id_here",
  "video": <file>
}
```

Or with URL:
```http
POST /api/videos
Content-Type: application/json

{
  "title": "Lesson 1",
  "courseId": "course_id_here",
  "duration": 300,
  "uploadedBy": "user_id_here",
  "videoUrl": "https://example.com/video.mp4"
}
```

#### Get All Videos
```http
GET /api/videos?courseId=course_id&isPublished=true
```

#### Get Video by ID
```http
GET /api/videos/:videoId
```

#### Get Videos by Course
```http
GET /api/videos/course/:courseId
```

#### Update Video
```http
PUT /api/videos/:videoId
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublished": true
}
```

#### Delete Video
```http
DELETE /api/videos/:videoId
```

#### Reorder Videos
```http
PUT /api/videos/course/:courseId/reorder
Content-Type: application/json

{
  "videoOrder": ["video_id_1", "video_id_2", "video_id_3"]
}
```

#### Get Video Analytics
```http
GET /api/videos/:videoId/analytics
```

## File Structure

```
Backend/
├── models/
│   ├── Course.js          ✅ New - Course schema
│   ├── Video.js           ✅ New - Video schema
│   ├── Question.js        (existing)
│   └── Progress.js        (existing)
├── controllers/
│   ├── courseController.js ✅ New - Course operations
│   ├── videoController.js  ✅ New - Video operations
│   └── questionController.js (existing)
├── routes/
│   ├── courseRoutes.js    ✅ New - Course routes
│   ├── videoRoutes.js     ✅ New - Video routes
│   ├── questionRoutes.js  (existing)
│   └── progressRoutes.js  (existing)
├── server.js              ✅ Updated with new routes
├── package.json           ✅ Updated with multer
├── .env.example           ✅ New - Environment template
└── .gitignore             (existing)
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Steps

1. **Navigate to Backend Directory**
```bash
cd Backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run Backend Server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## Testing the APIs

### Using Postman or cURL

#### Create a Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Basics",
    "description": "Learn React from scratch",
    "category": "Programming",
    "instructor": "Jane Doe",
    "instructorEmail": "jane@example.com",
    "duration": 30,
    "level": "Beginner"
  }'
```

#### Upload a Video
```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Content-Type: multipart/form-data" \
  -F "title=Introduction" \
  -F "courseId=<COURSE_ID>" \
  -F "duration=600" \
  -F "uploadedBy=<USER_ID>" \
  -F "video=@./my-video.mp4"
```

## Features Implemented

### Course Management
✅ Create courses with metadata
✅ Read/retrieve courses with filtering
✅ Update course information
✅ Delete courses (cascades to videos)
✅ Add modules to courses
✅ View course statistics
✅ Support for course levels and categories
✅ Thumbnail support
✅ Student enrollment tracking

### Video Management
✅ Upload videos (file or URL)
✅ Video metadata and ordering
✅ Course organization with modules/sections
✅ View count tracking
✅ Video analytics
✅ Publish/draft status
✅ Automatic removal from courses on deletion
✅ Video reordering within course

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Validation errors include detailed field information.

## Future Enhancements

1. **Authentication Middleware**: Add JWT authentication checks
2. **File Upload**: Integrate AWS S3 or similar for video storage
3. **Video Processing**: Add FFmpeg integration for video transcoding
4. **Pagination**: Implement pagination for large datasets
5. **Search**: Add full-text search capabilities
6. **Caching**: Implement Redis caching for frequently accessed data
7. **Video Streaming**: Add HLS/DASH streaming support
8. **Notifications**: Trigger notifications when courses are updated
9. **Webhooks**: Support external integrations
10. **Rate Limiting**: Add API rate limiting

## Notes

- Videos can reference questions from the Question model
- Courses maintain enrollment count for analytics
- Soft delete not implemented; deletions are permanent
- File uploads currently stored as paths; consider cloud storage
- All timestamps are automatically managed by Mongoose

## Contributing

Follow the existing code patterns:
- Use consistent error handling
- Validate input data
- Use descriptive variable names
- Add comments for complex logic
