import React from "react";
import { ReviewStep } from "./ReviewStep";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import type { PlanState } from "../../store/plan";
import {
  addAgentPlan,
  addAssignmentPlan,
  addDiscussionPlan,
  addNewsPlan,
  addQuizPlan,
} from "../../store/plan";

describe("<ReviewStep />", () => {
  before(() => {
    cy.fixture("store/plan").then((fix: unknown) => {
      const plan = fix as PlanState;
      for (const a of plan.assignments) {
        store.dispatch(addAssignmentPlan(a));
      }
      for (const q of plan.quizzes) {
        store.dispatch(addQuizPlan(q));
      }
      for (const d of plan.discussions) {
        store.dispatch(addDiscussionPlan(d));
      }
      for (const a of plan.agents) {
        store.dispatch(addAgentPlan(a));
      }
      for (const n of plan.news) {
        store.dispatch(addNewsPlan(n));
      }
    });
  });

  it("renders", () => {
    cy.mount(
      <Provider store={store}>
        <ReviewStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );

    cy.fixture("store/plan").then((fix: unknown) => {
      const plan = fix as PlanState;
      for (const a of plan.assignments) {
        cy.contains(a.name);
      }
      for (const q of plan.quizzes) {
        cy.contains(q.name);
      }
      for (const d of plan.discussions) {
        cy.contains(d.name);
      }
      for (const a of plan.agents) {
        cy.contains(a.name);
      }
      for (const n of plan.news) {
        cy.contains(n.name);
      }
    });

    cy.contains("Lab 3").click();
    cy.contains("Due: 2024-10-15 23:59:00").trigger("mouseover");
    cy.contains("semester start + 4 weeks + 6 days + 1 holidays");

    cy.contains("Discussion 3").click();
    cy.contains("Due: 2024-10-15 23:59:00").trigger("mouseover");
    cy.contains("semester start + 4 weeks + 6 days + 1 holidays");

    cy.contains("CST2000 Missed Lab 1 Deadline").click();
    cy.contains("Start: 2024-09-26 09:00:00").trigger("mouseover");
    cy.contains("semester start + 2 weeks + 2 days");
    cy.contains("Subject: CST2000 Missed Lab 1 Deadline");
  });
});
