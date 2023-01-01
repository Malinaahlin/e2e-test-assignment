beforeEach(() => {
  cy.visit("/");
});

describe("Testing search function", () => {
  it("Should input text", () => {
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter")
  });

  it("Should click button", () => {
    cy.get("button").click();
  });

  it("Should give error message", () => {
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("Should not search with less than 3 caracters", () => {
    cy.get("input").type("Ha");
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("Should show Harry Potter movies", () => {
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div.movie").contains("Harry Potter");
    cy.request("GET", "http://omdbapi.com/?apikey=416ed51a&s=Harry%20Potter");
  });


  it("Should show new movie search", () => {
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div.movie").contains("Harry Potter");
    cy.get("input").clear();
    cy.get("input").type("Star Wars").should("have.value", "Star Wars");
    cy.get("button").click();
    cy.get("div.movie").contains("Star Wars");
    cy.request("GET", "http://omdbapi.com/?apikey=416ed51a&s=Star%20Wars");
  });

});

describe("Testing movie page", () => {
  it("Should find movie title", () => {
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div.movie");
    cy.get("h3").contains("Harry Potter")
  });

  it("Should find movie posters", () => {
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div.movie");
    cy.get("img");
  });

});

describe("Testing mock", () => {
  it("Should not show mocked api movies", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {fakeSearch: [] }).as("moviecall");

    cy.get("input").type("H").should("have.value", "H");
    cy.get("button").click();
    cy.wait("@moviecall").its("request.url").should("contain", "H");

    cy.get("div").contains("Inga sökresultat att visa");
  });

  it("Should show mocked api movies", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {fixture: "movies"}).as("moviecall");

    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.wait("@moviecall").its("request.url").should("contain", "Harry");

    cy.get("h3").contains("Harry Potter");
    cy.get("img");
  });
});

