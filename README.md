# Database Integration (Project 3)

A Node.js + Express backend connected to MongoDB Atlas (via Mongoose) that stores and retrieves job application records with full CRUD support.

## Features
- Simple, validated database schema
- Create, Read (all / one / filtered), Update, Delete
- Input validation, ID checks, and proper HTTP status codes (200, 201, 400, 404, 500)

## Tech Stack
Node.js, Express, MongoDB Atlas, Mongoose

## Schema: `Application`
| Field | Type | Rules |
|---|---|---|
| company | String | required, trimmed |
| jobTitle | String | required, trimmed |
| location | String | optional |
| status | String | one of Applied / Interview / Offer / Rejected (default: Applied) |
| appliedDate | Date | default: now |
| interviewDate | Date | optional |
| createdAt / updatedAt | Date | automatic |

## API Endpoints
| Action | Method | URL |
|---|---|---|
| Create | POST | /api/applications |
| Read all | GET | /api/applications (optional `?status=Interview`) |
| Read one | GET | /api/applications/:id |
| Update | PUT | /api/applications/:id |
| Delete | DELETE | /api/applications/:id |

## Setup
1. Clone the repo and run `npm install`
2. Copy `.env.example` to `.env` and add your MongoDB Atlas connection string
3. Run `npm run dev`
4. Test with Postman, Thunder Client, or the included `requests.http`

## Data Handling
- Required fields and trimming enforced by the schema
- `status` limited to an allowed list (enum)
- `runValidators` re-checks rules on updates
- Invalid IDs return 400, missing records return 404
- Secrets kept in `.env` (not committed)

## Screenshots
Add your Postman/Atlas screenshots here.
