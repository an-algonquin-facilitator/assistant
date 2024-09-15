# Template Guide

Templates are YAML files that lists how assignments, quizzes, and announcements (called news in brightspace) should look.

start dates are always the start of the day (00:01)
due and end dates are always the end of the day (11:59)

## Object definitions

```ts
// Represents a difference from the semester start date must be whole number but CAN be negative, like 2 weeks - 1 day
interface DateOffset {
  weeks?: number;
  days?: number;
}

// Represent an assignment in the course.
// ALL assignments default to
// - being displayed in the calendar
// - being visible at all time
interface Assignment {
  id?: string; // used in announcement Mustache template. Use all lower no space, no userscore, no dash for simplicity, like "lab1"
  name: string; // must be exact match, sometimes assignments have trailing spaces that have to be fixed in Brightspace.
  start?: DateOffset; // default to semester start date
  due: DateOffset;
  end?: DateOffset; // default to due date + 1 week
}

// ALL quizz default to
// - being displayed in the calendar
// - being visible at all time
interface Quiz {
  id?: string; // used in announcement Mustache template. Use all lower no space, no userscore, no dash for simplicity, like "quiz1"
  name: string; // must be exact match
  start?: DateOffset; // default to semester start date
  due: DateOffset;
  end?: DateOffset; //  default to due date + 1 week
}

// ALL news default to
// - original author information not shown.
// - set to "ready for publish"
interface News {
  name: string; // Name of the news to create.
  content: string; // Content of the news to create, is a mustache template of HTML. So use <br> for newlines for example.
  start?: DateOffset; // default to semester start date
  end?: DateOffset; // default to news start date + 2 weeks
}

interface Template {
  courseCode: string; // [A-Z]{3}[0-9]{4}, e.g. CST8259
  assignments?: Assignment[];
  quizzes?: Quiz[];
  news?: News[];
}
```

Additionally the mustache view sent to the announcement template follows this structure

```ts
interface FlexibleDate {
  year: number; // 2024
  monthDate: number; // 15
  month: string; // January
  monthShort: string; // Jan
  weekDays: string; // Monday
  weekDaysShort: string; // Mon
  iso8601: string; // ex: 2024-08-28T23:14:53Z
  date: string; // ex: Wed Aug 28 2024
}

interface Element {
  name: string;
  start: FlexibleDate;
  due: FlexibleDate;
  end: FlexibleDate;
}

interface MustacheView {
  quizzes: {
    [quizID: string]: Element;
  };
  assignments: {
    [assignmentID: string]: Element;
  };
}
```

## Example

`CST1234.yaml`

```yaml
---
news:
  - name: Week 5
    start:
      weeks: 4
    content: Week 5 is going to be very fun, this week remember
      <br>
      that the midterm is due on {{quizzes.midterm.due.date}}
      <br>
      and that assignment 1 is due on {{assignments.a1.due.date}}
quizzes:
  - name: Midterm Exam
    id: midterm
    start:
      weeks: 5
    due:
      weeks: 7
assignments:
  - name: Assignment 1 – Serverless Application Design Proposal & Feasibility Study
    id: a1
    due:
      weeks: 6
      days: 2
```
