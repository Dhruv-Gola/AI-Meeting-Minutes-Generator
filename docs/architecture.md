# System Architecture

## High-Level Architecture

User
 ↓
React Frontend
 ↓
Backend REST API
 ↓
Node.js + Express
 ↓
 ├── AI Provider
 │      ↓
 │   Gemini API
 │
 └── PostgreSQL Database
        ↓
   Meeting Data
   Meeting Minutes
   Prompt Templates

## Architecture Flow

Frontend
   ↓
Backend API
   ↓
Business Logic
   ↓
 ├── AI Provider
 └── Database

## Main Components

### Frontend

Responsible for:

- User interface
- Meeting creation
- Transcript input
- Meeting history
- Search
- Meeting details
- Export controls

### Backend

Responsible for:

- REST APIs
- Business logic
- Database communication
- AI communication
- Validation
- Error handling
- Secure API key handling

### AI Provider

Responsible for:

- Transcript analysis
- Summary generation
- Action item extraction
- Decision extraction
- Risk identification
- Open question identification

### Database

Responsible for storing:

- Meetings
- Meeting minutes
- Prompt templates