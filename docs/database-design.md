# Database Design

## 1. Meetings

The Meetings entity contains:

- MeetingId
- Title
- Date
- Participants
- Transcript

## 2. MeetingMinutes

The MeetingMinutes entity contains:

- MeetingId
- Summary
- ActionItems
- Decisions
- Risks
- OpenQuestions

## 3. PromptTemplates

The PromptTemplates entity contains:

- TemplateId
- Name
- Prompt

## Relationships

Meeting
   │
   │
   └──── MeetingMinutes

PromptTemplates