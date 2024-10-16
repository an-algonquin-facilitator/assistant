import React from "react";
import { PlanStep } from "./PlanStep";
import { Provider } from "react-redux";
import type { Store } from "../../store/store";
import { store } from "../../store/store";
import type { CourseTemplate } from "../../store/template";
import { resetTemplate, setTemplate } from "../../store/template";
import { setCourse } from "../../store/course";
import type { Course } from "../../api/course";
import type { Folder } from "../../api/folder";
import type { Quiz } from "../../api/quiz";
import type { News } from "../../api/news";
import type { Paginated } from "../../api/api";
import type { PlanState } from "../../store/plan";

describe("<PlanStep />", () => {
  beforeEach(() => {
    store.dispatch(resetTemplate());
    cy.fixture("store/template").then((t) =>
      store.dispatch(setTemplate(t as Required<CourseTemplate>)),
    );
    cy.fixture("api/CST2000_course").then((c) => {
      cy.fixture("api/CST2000_folders").then((f) => {
        cy.fixture("api/CST2000_quizzes").then((q) => {
          cy.fixture("api/CST2000_news").then((n) => {
            store.dispatch(
              setCourse({
                course: c as Course,
                folders: f as Folder[],
                quizzes: (q as Paginated<Quiz>).Objects,
                news: n as News[],
              }),
            );
          });
        });
      });
    });
    cy.wrap(store).as("store");
  });

  it("should show computed mustache template", () => {
    cy.mount(
      <Provider store={store}>
        <PlanStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    cy.contains(/News \(0\/2\)/i).click();
    cy.get(".MuiIconButton-root").first().click();
    cy.contains("lab1-monthDate: 25");
    cy.contains("lab1-month: September");
    cy.contains("lab1-monthShort: Sep");
    cy.contains("lab1-weekDays: Wednesday");
    cy.contains("lab1-weekDaysShort: Wed");
    cy.contains("lab1-iso8601: 2024-09-26T03:59:00.000Z");
    cy.contains("lab1-date: Wed Sep 25 2024");
    cy.contains("quiz1-monthDate: 25");
    cy.contains("quiz1-month: September");
    cy.contains("quiz1-monthShort: Sep");
    cy.contains("quiz1-weekDays: Wednesday");
    cy.contains("quiz1-weekDaysShort: Wed");
    cy.contains("quiz1-iso8601: 2024-09-26T03:59:00.000Z");
    cy.contains("quiz1-date: Wed Sep 25 2024");
  });

  it("should display dates", () => {
    cy.mount(
      <Provider store={store}>
        <PlanStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    cy.contains("2024-09-15 23:59:00").trigger("mouseover");
    cy.contains("semester start + 4 weeks + 6 days + 1 holidays");
    cy.contains("2024-09-22 23:59:00").trigger("mouseover");
    cy.contains("semester start + 5 weeks + 6 days + 1 holidays");

    cy.contains(/Quizzes/i).click();
    cy.contains("2024-09-15 23:59:00").trigger("mouseover");
    cy.contains("semester start + 4 weeks + 6 days + 1 holidays");
    cy.contains("2024-09-22 23:59:00").trigger("mouseover");
    cy.contains("semester start + 5 weeks + 6 days + 1 holidays");
  });

  it("should set plan", () => {
    cy.mount(
      <Provider store={store}>
        <PlanStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    cy.contains(/review/i).should("be.disabled");
    cy.get("input").first().click();
    cy.contains(/Assignments \(3\/3\)/i);
    cy.contains(/Quizzes \(0\/3\)/i).click();
    cy.get("input").eq(1).click();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    cy.get("input").eq(3).click();
    cy.contains(/Quizzes \(2\/3\)/i);
    cy.contains(/News \(0\/2\)/i).click();
    cy.get("input").eq(1).click();
    cy.contains(/review/i).click();
    cy.get("@store").then((s: unknown) => {
      const st = (s as Store).getState();
      cy.fixture("store/plan").then((p: unknown): void => {
        const ps = p as PlanState;
        // gotta set some values to undefined because of how cypress loads json.
        ps.assignments.forEach((a) => {
          if (a.templateId === undefined) a.templateId = undefined;
        });
        ps.quizzes.forEach((q) => {
          if (q.templateId === undefined) q.templateId = undefined;
        });
        expect(st.plan).to.be.deep.eq(p);
      });
    });
  });
});
