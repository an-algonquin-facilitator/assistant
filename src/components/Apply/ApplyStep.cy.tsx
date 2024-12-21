import React from "react";
import { ApplyStep } from "./ApplyStep";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import type { CourseTemplate } from "../../store/template";
import { resetTemplate, setCourse, setTemplate } from "../../store/template";
import type { Course } from "../../api/course";
import type { Folder } from "../../api/folder";
import type { Paginated } from "../../api/api";
import type { Quiz } from "../../api/quiz";
import type { News } from "../../api/news";
import {
  addAssignmentPlan,
  addNewsPlan,
  addQuizPlan,
  resetPlan,
  type PlanState,
} from "../../store/plan";

const storePlan = (plan: PlanState): void => {
  for (const a of plan.assignments) {
    store.dispatch(addAssignmentPlan(a));
  }
  for (const q of plan.quizzes) {
    store.dispatch(addQuizPlan(q));
  }

  for (const n of plan.news) {
    store.dispatch(addNewsPlan(n));
  }
};

describe("<ApplyStep />", () => {
  beforeEach(() => {
    store.dispatch(resetPlan());
    store.dispatch(resetTemplate());
    cy.fixture("store/template").then((t) =>
      store.dispatch(setTemplate(t as Required<CourseTemplate>)),
    );
    store.dispatch(resetTemplate());
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

  it("should update assignments", () => {
    cy.mount(
      <Provider store={store}>
        <ApplyStep next={() => undefined} previous={() => undefined} />
      </Provider>,
    );
    cy.fixture("store/single_assigment_plan").then((fix: unknown) => {
      storePlan(fix as PlanState);
    });

    cy.fixture("api/GET_lab1").then((fix): void => {
      cy.intercept(
        {
          method: "GET",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/dropbox/folders/100001",
        },
        (req) => {
          req.reply({ body: fix as unknown });
        },
      );
    });

    cy.fixture("api/PUT_lab1").then((fix): void => {
      cy.intercept(
        {
          method: "PUT",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/dropbox/folders/100001",
        },
        (req) => {
          expect(req.body).to.be.deep.eq(fix);
          req.reply({ body: {} });
        },
      );
    });
    cy.contains(/apply!/i).click();
    cy.contains("Success");
  });

  it("should update quiz", () => {
    cy.mount(
      <Provider store={store}>
        <ApplyStep next={() => undefined} previous={() => undefined} />
      </Provider>,
    );
    cy.fixture("store/single_quiz_plan").then((fix: unknown) => {
      storePlan(fix as PlanState);
    });

    cy.fixture("api/GET_quiz1").then((fix): void => {
      cy.intercept(
        {
          method: "GET",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/quizzes/100001",
        },
        (req) => {
          req.reply({ body: fix as unknown });
        },
      );
    });

    cy.fixture("api/PUT_quiz1").then((fix): void => {
      cy.intercept(
        {
          method: "PUT",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/quizzes/100001",
        },
        (req) => {
          expect(req.body).to.be.deep.eq(fix);
          req.reply({ body: {} });
        },
      );
    });
    cy.contains(/apply!/i).click();
    cy.contains("Success");
  });

  it("should create new news", () => {
    cy.mount(
      <Provider store={store}>
        <ApplyStep next={() => undefined} previous={() => undefined} />
      </Provider>,
    );
    cy.fixture("store/single_create_news_plan").then((fix: unknown) => {
      storePlan(fix as PlanState);
    });

    cy.fixture("api/POST_news_welcome").then((fix): void => {
      cy.intercept(
        {
          method: "POST",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/news/",
        },
        (req) => {
          expect(req.body).to.be.deep.eq(fix);
          req.reply({ body: {} });
        },
      );
    });
    cy.contains(/apply!/i).click();
    cy.contains("Success");
  });

  it("should update existing news", () => {
    cy.mount(
      <Provider store={store}>
        <ApplyStep next={() => undefined} previous={() => undefined} />
      </Provider>,
    );
    cy.fixture("store/single_update_news_plan").then((fix: unknown) => {
      storePlan(fix as PlanState);
    });

    cy.fixture("api/PUT_news_late").then((fix): void => {
      cy.intercept(
        {
          method: "PUT",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/news/1000001",
        },
        (req) => {
          expect(req.body).to.be.deep.eq(fix);
          req.reply({ body: {} });
        },
      );
    });
    cy.contains(/apply!/i).click();
    cy.contains("Success");
  });
});
