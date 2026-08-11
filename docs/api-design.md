# API Design

## Meeting APIs

### Create Meeting

POST /api/meetings

### Get All Meetings

GET /api/meetings

### Get Meeting

GET /api/meetings/:id

### Update Meeting

PUT /api/meetings/:id

### Delete Meeting

DELETE /api/meetings/:id

## AI API

### Generate Meeting Minutes

POST /api/meetings/:id/generate

## Search API

GET /api/meetings/search?q=keyword

## Export APIs

GET /api/meetings/:id/export/pdf

GET /api/meetings/:id/export/txt

## Prompt Template APIs

GET /api/prompts

POST /api/prompts

PUT /api/prompts/:id

DELETE /api/prompts/:id