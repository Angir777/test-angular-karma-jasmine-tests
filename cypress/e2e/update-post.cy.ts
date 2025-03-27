describe('My Form Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/posts/new')
  })

  it('Validation test', () => {
    // Kliknięcie submit bez wpisywania wartości
    cy.getByData("submit-button").click()

    // Sprawdzanie czy pojawiły się komunikaty błędu
    cy.getByData("form-title").should('have.class', 'is-invalid')
    cy.getByData("form-body").should('have.class', 'is-invalid')

    cy.getByData("form-title-invalid-feedback").should("be.visible").contains("Please enter a valid title.")
    cy.getByData("form-body-invalid-feedback").should("be.visible").contains("Please enter a valid body.")

    // Informacje o poprawnym uzupełnieniu tutaj powinny być niewidoczne
    cy.getByData("form-title-valid-feedback").should("not.be.visible")
    cy.getByData("form-body-valid-feedback").should("not.be.visible")

    // Wpisywanie poprawnych wartości
    cy.getByData("form-title").type("Tytuł posta")
    cy.getByData("form-body").type("Treść posta")

    // Weryfikujemy czy formularz ma faktycznie wpisane dane
    cy.getByData("form-title").should('have.value', 'Tytuł posta')
    cy.getByData("form-body").should('have.value', 'Treść posta')

    // Kliknięcie submit po poprawnym uzupełnieniu
    cy.getByData("submit-button").click()

    // Sprawdzanie czy teraz pola mają klasę 'is-valid'
    cy.getByData("form-title").should('have.class', 'is-valid')
    cy.getByData("form-body").should('have.class', 'is-valid')

    // I sprawdzenie czy nie mają 'is-invalid'
    cy.getByData("form-title").should('not.have.class', 'is-invalid')
    cy.getByData("form-body").should('not.have.class', 'is-invalid')

    cy.getByData("form-title-valid-feedback").should("be.visible")
    cy.getByData("form-body-valid-feedback").should("be.visible")
  })
})

describe('HTTP Test', () => {
  it('Tworzenie nowego posta', () => {
    cy.visit('http://localhost:4200/posts/new')

    // Symuluje to co api zwraca
    cy.intercept('POST', 'https://jsonplaceholder.typicode.com/posts', {
      statusCode: 201,
      body: { id: 101, title: 'New Post', body: 'New Content', userId: 5 }
    }).as('createPost');

    cy.getByData("form-title").type("New Post")
    cy.getByData("form-body").type("New Content")

    cy.getByData("submit-button").click()

    // Sprawdza to, co aplikacja wysłała do API, a nie to, co API zwróciło.
    cy.wait('@createPost')
      .its('request.body')
      .should('deep.include', { id: null, title: 'New Post', body: 'New Content', userId: 5 });

    // Jak podejrzeć odpowiedź API w Cypress?
    // cy.wait('@createPost').then((interception) => {
    //   console.log('Request body:', interception.request.body);
    //   console.log('Response body:', interception.response?.body);
    // });

    cy.getByData("form-title").should('have.value', '')
    cy.getByData("form-body").should('have.value', '')
  });

  it.only('Aktualizacja posta', () => {
    cy.visit('http://localhost:4200/posts/1/edit')

    // Symuluje to co api zwraca
    cy.intercept('PUT', 'https://jsonplaceholder.typicode.com/posts/1', {
      statusCode: 200,
      body: { id: 1, title: 'Updated Post', body: 'Updated Content', userId: 5 }
    }).as('updatePost');

    cy.getByData("form-title").clear().type("Updated Post");
    cy.getByData("form-body").clear().type("Updated Content");

    cy.getByData("submit-button").click()

    // Sprawdza to, co aplikacja wysłała do API, a nie to, co API zwróciło.
    cy.wait('@updatePost')
      .its('request.body') // .its()jest przydatną metodą, gdy chcesz uzyskać właściwość z czegoś. tu z @updatePost
      .should('deep.include', { id: 1, title: 'Updated Post', body: 'Updated Content' });

    // Jak podejrzeć odpowiedź API w Cypress?
    // cy.wait('@updatePost').then((interception) => {
    //   console.log('Request body:', interception.request.body);
    //   console.log('Response body:', interception.response?.body);
    // });

    cy.getByData("form-title").should('have.value', 'Updated Post')
    cy.getByData("form-body").should('have.value', 'Updated Content')
  });
})