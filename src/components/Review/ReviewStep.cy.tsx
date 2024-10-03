import React from "react";
import { ReviewStep } from "./ReviewStep";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import type { PlanState } from "../../store/plan";
import { addAssignmentPlan, addNewsPlan, addQuizPlan } from "../../store/plan";

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
      for (const n of plan.news) {
        cy.contains(n.name);
      }
    });

    cy.contains("Lab 3").click();
    cy.contains("Due: 2024-09-15 23:59:00").trigger("mouseover");
    cy.contains("semester start + 4 weeks + 6 days + 1 holidays");
  });
});
