# Template Guide

Templates are YAML files that lists how assignments, quizzes, discussions, intelligent agents, and announcements (called news in brightspace) should look.

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

// Represent a discussion topic in the course.
// Topics are matched by name across ALL forums of the course, so topic names
// must be unique within the course.
// ALL discussions default to
// - being displayed in the calendar
// - being visible at all time
interface Discussion {
  id?: string; // used in announcement Mustache template. Use all lower no space, no userscore, no dash for simplicity, like "discussion1"
  name: string; // must be exact match with the topic name in Brightspace
  start?: DateOffset; // default to semester start date
  due: DateOffset;
  end?: DateOffset; // default to due date + 1 week
}

// Represent an intelligent agent. Maps onto the Brightspace Intelligent Agents API:
// https://docs.valence.desire2learn.com/res/intelligentagents.html
// Agents are matched by name: an existing agent with the same name is updated in place,
// otherwise it is created.
interface Agent {
  name: string; // unique in the course
  description?: string;
  enabled?: boolean; // default true
  roles?: string[]; // role display names (e.g. "Learner"), resolved through the course classlist
  roleIds?: number[]; // numeric role ids, for when nobody with that role is enrolled yet
  criteria?: {
    loginActivity?: { type: "notLoggedIn" | "loggedIn"; days: number };
    courseActivity?: { type: "notAccessed" | "accessed"; days: number };
  };
  conditions?: {
    operator?: "all" | "any"; // default all
    items: (
      | {
          type:
            | "submittedToDropbox"
            | "notSubmittedToDropbox"
            | "receivesFeedback";
          assignment: string;
        } // assignment template id
      | {
          type: "submitsQuizAttempt" | "notSubmittedQuizAttempt";
          quiz: string;
          attempts?: number;
        } // quiz template id
      | { raw: object } // any release condition block sent verbatim, see the Release Conditions API
    )[];
  };
  schedule?: {
    // when omitted the agent has no schedule and must be run manually.
    type: "once" | "daily" | "weekly" | "monthly";
    start: DateOffset; // day the agent (first) runs
    time?: string; // "HH:mm" local time, default "09:00"
    end?: DateOffset; // repeating types only, end of that day
    every?: number; // repeating types only, default 1
    onDays?: string[]; // weekly only
  };
  action?: {
    repeat?: "firstTimeOnly" | "everyTime"; // default firstTimeOnly
    email?: {
      to: string; // e.g. "{InitiatingUser}", Brightspace expands its own {...} replace strings
      cc?: string;
      bcc?: string;
      subject: string; // mustache template, same view as news content
      message: string; // mustache template, HTML
    };
    enrollment?: {
      type: "enroll" | "unenroll";
      orgUnitId: number;
      roleId: number;
    };
  };
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
  discussions?: Discussion[];
  agents?: Agent[];
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
  discussions: {
    [discussionID: string]: Element;
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
      <br>
      and that discussion 1 runs from {{discussions.d1.start.date}} to {{discussions.d1.end.date}}
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
discussions:
  - name: "Discussion 1: Introductions"
    id: d1
    start:
      weeks: 0
    due:
      weeks: 1
      days: 2
    end:
      weeks: 1
      days: 2
agents:
  - name: CST1234 Missed Assignment 1 Deadline
    roles: [Learner]
    conditions:
      items:
        - type: notSubmittedToDropbox
          assignment: a1
    schedule:
      type: once
      start: # the day after assignment 1 is due
        weeks: 6
        days: 3
    action:
      repeat: firstTimeOnly
      email:
        to: "{InitiatingUser}"
        bcc: me@algonquincollege.com
        subject: "CST1234 Missed {{assignments.a1.name}} Deadline"
        message: |
          <p>Hello {InitiatingUserFirstName},</p>
          <p>It seems you have missed the deadline of {{assignments.a1.name}} on {{assignments.a1.due.date}}.</p>
```

Intelligent agents need the LE API 1.93+ (LMS 20.26.4) and release conditions the LP API 1.49+. When
they cannot be loaded the Template step shows a warning on the Intelligent Agents row and the rest of the
template still works. Mustache uses `{{ }}` while Brightspace replace strings use `{ }`, so both can be
mixed in the same email.
