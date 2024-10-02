import { Provider } from "react-redux";
import { IntroductionStep } from "./IntroductionStep";
import type { RootState, Store } from "../../store/store";
import { store } from "../../store/store";
import { localStorageDoNotWarnKey } from "../Risk/Risk";
import { expect } from "chai";
import { CopyTokenJS } from "./AcquireTokenCodeSnippet";
import { localStorageTokenKey, setToken } from "../../store/token";

const endOfTime = 4102462800; // Jan 1 2100
const createToken = (exp: number): string => {
  const header = {
    alg: "RS256",
    kid: "abcd1234-abcd-1234-abcd-1234abcd1234",
    typ: "JWT",
  };
  const body = {
    nbf: 946702800, // jan 1 2000
    exp: exp,
    iss: "https://api.brightspace.com/auth",
    aud: "https://api.brightspace.com/auth/token",
    sub: "123456",
    tenantid: "abcd1234-ab94-4159-bbef-ace0093616dc",
    azp: "lms",
    scope: "*:*:*",
    jti: "abcd1234-ab94-4159-bbef-ace0093616dc",
  };

  return (
    btoa(JSON.stringify(header)) +
    "." +
    btoa(JSON.stringify(body)) +
    ".abcd1234"
  );
};

describe("<IntroductionStep />", () => {
  afterEach(() => {
    store.dispatch(setToken(""));
  });
  it("should show warning first time", () => {
    window.localStorage.removeItem(localStorageDoNotWarnKey);
    cy.mount(
      <Provider store={store}>
        <IntroductionStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    cy.get("button:contains('I understand')");
  });

  it("should not show warning if dismissed", () => {
    window.localStorage.setItem(localStorageDoNotWarnKey, "true");
    cy.mount(
      <Provider store={store}>
        <IntroductionStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    cy.get("button:contains('I understand')").should("not.exist");
  });

  it("should set localstorage when accepting with the checkbox", () => {
    window.localStorage.removeItem(localStorageDoNotWarnKey);
    cy.mount(
      <Provider store={store}>
        <IntroductionStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    cy.get('input[type="checkbox"]').check();
    cy.get("button:contains('I understand')").click();
    cy.getAllLocalStorage().should(() =>
      expect(localStorage.getItem(localStorageDoNotWarnKey)).to.be.eq("true"),
    );
  });

  it("should have certain visual elements", () => {
    window.localStorage.setItem(localStorageDoNotWarnKey, "true");
    cy.mount(
      <Provider store={store}>
        <IntroductionStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );
    cy.get('a[href*="https://brightspace.algonquincollege.com/"]');

    cy.contains("console.log").click();
    cy.window().then(async (win) =>
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(CopyTokenJS);
      }),
    );

    cy.get('input[placeholder="Copy paste the token here"]').clear();

    cy.get("button")
      .contains(/validate/i)
      .should("be.visible")
      .should("be.disabled");
  });

  it("should not allow expired token", () => {
    window.localStorage.setItem(localStorageDoNotWarnKey, "true");
    cy.mount(
      <Provider store={store}>
        <IntroductionStep next={() => undefined} previous={() => undefined} />,
      </Provider>,
    );

    const token = createToken(0);
    cy.get('input[placeholder="Copy paste the token here"]')
      .clear()
      .invoke("val", token)
      .type("a")
      .type("{backspace}");
    // .type(createToken(0), { delay: 0 });

    cy.get("button")
      .contains(/validate/i)
      .click();
    cy.contains("Expired Token");
  });

  it("should allow valid token", () => {
    window.localStorage.setItem(localStorageDoNotWarnKey, "true");

    const stepper = {
      next: (): void => undefined,
      previous: (): void => undefined,
    };
    cy.spy(stepper, "next").as("nextStep");

    cy.mount(
      <Provider store={store}>
        <IntroductionStep next={stepper.next} previous={stepper.previous} />,
      </Provider>,
    );

    const token = createToken(endOfTime);
    cy.get('input[placeholder="Copy paste the token here"]')
      .clear()
      .invoke("val", token)
      .type("a")
      .type("{backspace}");

    cy.fixture("api/whoami").then((whoami) =>
      cy.intercept(
        {
          url: "https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com/d2l/api/lp/1.9/users/whoami",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
        (req) => {
          req.reply({ body: whoami as unknown });
        },
      ),
    );
    cy.get("button")
      .contains(/validate/i)
      .click();
    cy.contains("Valid Token");
    cy.contains("John Smith");
    cy.contains("smithj");
    cy.contains(/\d+ minutes \d+ seconds/i);
    cy.get("button").contains(/ok/i).click();
    cy.get("@nextStep").should("have.been.called");
    cy.wrap(store).as("store");
    cy.get("@store").then((s: unknown) => {
      const state: RootState = (s as Store).getState();
      expect(state.token.value).to.be.eq(token);
    });
    cy.getAllLocalStorage().should(() =>
      expect(localStorage.getItem(localStorageTokenKey)).to.be.eq(token),
    );
  });
});
