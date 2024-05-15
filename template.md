# Template

Templates are JSON files that lists how assignments, quizzes, and announcements should look.

start dates are always the start of the day (00:00)
due and end dates are always the end of the day (11:59)

## Object definitions

```ts
// Represents a difference from the semester start date
interface DateOffset {
  weeks?: number;
  days?: number;
}

// Represent an assignment in the course.
// Additionally ALL assignments default to
// - being displayed in the calendar
// - being visible at all time
interface Assignment {
  name: string; // must be exact match, sometimes assignments have trailing spaces that have to be fixed in Brightspace.
  start?: DateOffset; // default to semester start date
  due: DateOffset;
  end?: DateOffset; //  default to due date + 1 week
}

// Additionally ALL quizz default to
// - being displayed in the calendar
// - being visible at all time
interface Quiz {
  name: string; // must be exact match
  start?: DateOffset; // default to semester start date
  due: DateOffset;
  end?: DateOffset; //  default to due date + 1 week
}

// Additionally ALL announcement default to
// - original author information not shown.
// - set to "ready for publish"
interface Announcement {
  name: string; // must be exact match
  start?: DateOffset; // default to semester start date
  end?: DateOffset; // default to announcement start date + 2 weeks
}

interface Template {
  assignments?: Assignment[];
  quizzes?: Quiz[];
  news?: Announcement[];
}
```

## Example

```json
{
  "news": [
    { "name": "Week 5", "start": { "weeks": 4 } },
    { "name": "Week 6", "start": { "weeks": 5 } }
  ],
  "quizzes": [
    { "name": "Midterm Exam", "due": { "weeks": 7 }, "start": { "weeks": 5 } }
  ],
  "assignments": [
    {
      "name": "Assignment 1 – Serverless Application Design Proposal & Feasibility Study",
      "due": { "weeks": 6 }
    }
  ]
}
```
