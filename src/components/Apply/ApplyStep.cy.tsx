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
import type { Topic } from "../../api/discussion";
import {
  addAgentPlan,
  addAssignmentPlan,
  addDiscussionPlan,
  addNewsPlan,
  addQuizPlan,
  resetPlan,
  type PlanState,
} from "../../store/plan";
import { resetTasks } from "../../store/apply";

const storePlan = (plan: PlanState): void => {
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
};

describe("<ApplyStep />", () => {
  beforeEach(() => {
    store.dispatch(resetTasks());
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
            cy.fixture("api/CST2000_topics_forum1").then((t1) => {
              cy.fixture("api/CST2000_topics_forum2").then((t2) => {
                store.dispatch(
                  setCourse({
                    course: c as Course,
                    folders: f as Folder[],
                    quizzes: (q as Paginated<Quiz>).Objects,
                    news: n as News[],
                    topics: [...(t1 as Topic[]), ...(t2 as Topic[])],
                    agents: [],
                    roles: [
                      { id: 500, name: "Facilitator" },
                      { id: 578, name: "Learner" },
                    ],
                  }),
                );
              });
            });
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

  it("should update discussion topic", () => {
    cy.mount(
      <Provider store={store}>
        <ApplyStep next={() => undefined} previous={() => undefined} />
      </Provider>,
    );
    cy.fixture("store/single_discussion_plan").then((fix: unknown) => {
      storePlan(fix as PlanState);
    });

    cy.fixture("api/GET_topic1").then((fix): void => {
      cy.intercept(
        {
          method: "GET",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.90/1016/discussions/forums/1/topics/300001",
        },
        (req) => {
          req.reply({ body: fix as unknown });
        },
      );
    });

    cy.fixture("api/PUT_topic1").then((fix): void => {
      cy.intercept(
        {
          method: "PUT",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.90/1016/discussions/forums/1/topics/300001",
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

  it("should create agent and set release conditions", () => {
    cy.mount(
      <Provider store={store}>
        <ApplyStep next={() => undefined} previous={() => undefined} />
      </Provider>,
    );
    cy.fixture("store/single_agent_plan").then((fix: unknown) => {
      storePlan(fix as PlanState);
    });

    cy.fixture("api/POST_agent_missed_lab1").then((fix): void => {
      cy.intercept(
        {
          method: "POST",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.93/1016/agents",
        },
        (req) => {
          expect(req.body).to.be.deep.eq(fix);
          req.reply({ body: { ...(fix as object), AgentId: 700002 } });
        },
      );
    });

    cy.fixture("api/GET_conditions_empty").then((fix): void => {
      cy.intercept(
        {
          method: "GET",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/lp/1.49/1016/conditionalRelease/conditions/intelligentAgents/700002",
        },
        (req) => {
          req.reply({ body: fix as unknown });
        },
      );
    });

    cy.fixture("api/PUT_conditions_agent").then((fix): void => {
      cy.intercept(
        {
          method: "PUT",
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/lp/1.49/1016/conditionalRelease/conditions/intelligentAgents/700002",
        },
        (req) => {
          expect(req.body).to.be.deep.eq(fix);
          req.reply({ body: fix as unknown });
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
