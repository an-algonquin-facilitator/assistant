import { TemplateStep } from "./TemplateStep";
import { Provider } from "react-redux";
import type { Store } from "../../store/store";
import { store } from "../../store/store";
import { insertToken } from "../../store/token";
import { resetTemplate } from "../../store/template";

const interceptCourseFetch = (): void => {
  cy.intercept(
    "GET",
    "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/lp/1.9/courses/1016",
    { fixture: "api/CST2000_course" },
  ).as("course");

  cy.intercept(
    "GET",
    "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/dropbox/folders/",
    { fixture: "api/CST2000_folders" },
  ).as("folders");

  cy.intercept(
    "GET",
    "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/quizzes/",
    { fixture: "api/CST2000_quizzes" },
  ).as("quizzes");

  cy.intercept(
    "GET",
    "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/le/1.74/1016/news/",
    { fixture: "api/CST2000_news" },
  ).as("news");
};

const waitCourseFetch = (): void => {
  cy.wait(["@course", "@folders", "@quizzes", "@news"]);
};

describe("<TemplateStep />", () => {
  beforeEach(() => {
    store.dispatch(insertToken("TOKEN"));
    store.dispatch(resetTemplate());

    cy.fixture("templates/CST2000.yaml").as("CST2000.yaml");
    cy.fixture("templates/CST2000_incomplete.yaml").as(
      "CST2000_incomplete.yaml",
    );
    cy.fixture("templates/empty").as("empty");
    cy.fixture("templates/CST2000.json").as("CST2000.json");

    cy.intercept(
      "GET",
      "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/lp/1.9/enrollments/myenrollments/",
      { fixture: "api/myenrollments" },
    ).as("enrollments");
  });

  afterEach(() => {
    cy.wait(["@enrollments"]);
  });

  it("should not accept invalid template", () => {
    cy.mount(
      <Provider store={store}>
        <TemplateStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );

    cy.get("input[type=file]").selectFile(
      { contents: "@empty", fileName: "template.yml" },
      { force: true },
    );
    cy.contains("error in your template");
  });

  it("should accept json and yaml", () => {
    cy.mount(
      <Provider store={store}>
        <TemplateStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    interceptCourseFetch();
    cy.get("input[type=file]").selectFile(
      { contents: "@CST2000.yaml", fileName: "template.yml" },
      { force: true },
    );
    waitCourseFetch();
    cy.get("button").contains(/select course/i);

    cy.get("input[type=file]").selectFile(
      { contents: "@CST2000.json", fileName: "template.yml" },
      { force: true },
    );
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

    interceptCourseFetch();
    cy.get("input[type=file]").selectFile(
      { contents: "@CST2000_incomplete.yaml", fileName: "template.yml" },
      {
        force: true,
      },
    );
    waitCourseFetch();
    cy.get("button").contains(/select course/i);

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
    cy.wrap(store).as("store");

    interceptCourseFetch();
    cy.get("input[type=file]").selectFile(
      { contents: "@CST2000.yaml", fileName: "template.yml" },
      { force: true },
    );
    waitCourseFetch();

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
      cy.fixture("store/template").then((template) => {
        expect(state.template.value).to.deep.eq(template);
      });
    });
  });
});
