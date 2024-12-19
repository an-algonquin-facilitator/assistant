import React from "react";
import { TemplateStep } from "./TemplateStep";
import { Provider } from "react-redux";
import type { Store } from "../../store/store";
import { store } from "../../store/store";
import { setToken } from "../../store/token";
import { resetTemplateStep } from "../../store/templateStep";
import { resetTemplate } from "../../store/template";
import { resetCourse } from "../../store/course";
import { resetPlan } from "../../store/plan";

describe("<TemplateStep />", () => {
  beforeEach(() => {
    store.dispatch(setToken("TOKEN"));
    store.dispatch(resetTemplateStep());
    store.dispatch(resetTemplate());
    store.dispatch(resetCourse());
    store.dispatch(resetPlan());
    cy.fixture("api/myenrollments").then((myenrollments) => {
      cy.intercept(
        {
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/lp/1.9/enrollments/myenrollments/",
          headers: {
            Authorization: "Bearer TOKEN",
          },
        },
        (req) => {
          req.reply({ body: myenrollments as unknown });
        },
      );
    });

    cy.fixture("api/CST2000_course").then((course) => {
      cy.intercept(
        {
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/lp/1.9/courses/1016",
          headers: {
            Authorization: "Bearer TOKEN",
          },
        },
        (req) => {
          req.reply({ body: course as unknown });
        },
      );
    });

    cy.fixture("api/CST2000_folders").then((folders) => {
      cy.intercept(
        {
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/dropbox/folders/",
          headers: {
            Authorization: "Bearer TOKEN",
          },
        },
        (req) => {
          req.reply({ body: folders as unknown });
        },
      );
    });

    cy.fixture("api/CST2000_quizzes").then((quizzes) => {
      cy.intercept(
        {
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/quizzes/",
          headers: {
            Authorization: "Bearer TOKEN",
          },
        },
        (req) => {
          req.reply({ body: quizzes as unknown });
        },
      );
    });

    cy.fixture("api/CST2000_news").then((news) => {
      cy.intercept(
        {
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/news/",
          headers: {
            Authorization: "Bearer TOKEN",
          },
        },
        (req) => {
          req.reply({ body: news as unknown });
        },
      );
    });
  });

  it("should not accept invalid template", () => {
    cy.mount(
      <Provider store={store}>
        <TemplateStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );

    cy.fixture("templates/empty").as("templatefile");
    cy.get("input[type=file]").selectFile("@templatefile", { force: true });
    cy.contains("error in your template");
  });

  it("should accept json and yaml", () => {
    cy.mount(
      <Provider store={store}>
        <TemplateStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );

    cy.fixture("templates/CST2000.yaml").as("templatefileyaml");
    cy.get("input[type=file]").selectFile("@templatefileyaml", { force: true });
    cy.get("button").contains(/select course/i);

    cy.fixture("templates/CST2000.json").as("templatefilejson");
    cy.get("input[type=file]").selectFile("@templatefilejson", { force: true });
    cy.get("button").contains(/select course/i);

    cy.contains("24F_CST2000_000");
    cy.contains(
      "Start: Tue Sep 10 2024 00:00:00 GMT-0400 (Eastern Daylight Time)",
    );
    cy.contains(
      "End: Wed Dec 18 2024 00:00:00 GMT-0500 (Eastern Standard Time)",
    );
  });

  it("should show warning on incomplete template", () => {
    cy.mount(
      <Provider store={store}>
        <TemplateStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );

    cy.fixture("templates/CST2000_incomplete.yaml").as("templatefileyaml");
    cy.get("input[type=file]").selectFile("@templatefileyaml", { force: true });
    cy.get("button").contains(/select course/i);

    cy.contains("24F_CST2000_000");
    cy.contains(
      "Start: Tue Sep 10 2024 00:00:00 GMT-0400 (Eastern Daylight Time)",
    );
    cy.contains(
      "End: Wed Dec 18 2024 00:00:00 GMT-0500 (Eastern Standard Time)",
    );

    const expectedText = ["Lab 1", "Quiz 2", "Late Policy"];
    const buttons = cy.get("table").find("button");
    buttons.each((b, i) => {
      b.trigger("click");
      cy.contains(expectedText[i]);
    });
  });

  it("should populate the store", () => {
    cy.mount(
      <Provider store={store}>
        <TemplateStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );

    cy.fixture("templates/CST2000.yaml").as("templatefileyaml");
    cy.get("input[type=file]").selectFile("@templatefileyaml", { force: true });
    cy.get("button").contains(/select course/i);

    cy.contains("24F_CST2000_000");
    cy.contains(
      "Start: Tue Sep 10 2024 00:00:00 GMT-0400 (Eastern Daylight Time)",
    );
    cy.contains(
      "End: Wed Dec 18 2024 00:00:00 GMT-0500 (Eastern Standard Time)",
    );

    cy.get("table").find("button").should("be.disabled");

    cy.wrap(store).as("store");
    cy.get("@store").then((s: unknown) => {
      const state = (s as Store).getState();
      expect(state.template.value).to.deep.eq({
        courseCode: "",
        assignments: [],
        quizzes: [],
        news: [],
      });
    });

    cy.contains(/plan/i).click();
    cy.get("@store").then((s: unknown) => {
      const state = (s as Store).getState();
      cy.fixture("store/template").then((template) => {
        expect(state.template.value).to.deep.eq(template);
      });
    });
  });
});
