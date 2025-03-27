describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  })

  it('Visits the initial project page', () => {
    cy.get('[data-test="hero-heading"]').should('contain', 'Hello, my-angular-csr-app') // Rozpoznajemy element po data-test="hero-heading"
    cy.contains('app is running')
  })

  it("li on the homepage are correct", () => { // it.only wykona tylko ten test
    cy.visit("http://localhost:4200")
    cy.get("li").eq(2).contains("Lista 3")
  })
})

describe('My Second Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  })

  // Zgrupowanie powiązanych testów
  context("Hero section", () => {

    it('Visits the initial project page 2', () => {
      cy.getByData("hero-heading").contains('Hello, my-angular-csr-app') // Rozpoznajemy element po data-test="hero-heading"
      cy.contains('app is running')
    })

    it('Usunięcie wybranego posta', () => {
      // Sprawdzamy początkową liczbę postów
      cy.get('[data-test^="post-title-"]').should('have.length', 100)

      cy.getByData("post-title-0").should('exist')

      // Klikamy "Delete" tylko w tym konkretnym poście
      cy.getByData("post-title-0").within(() => { // Podczas pracy z elementami musisz przejść do jego dzieci, wnuków itd. Możesz użyć .within(), aby ograniczyć zakres poleceń Cypress do określonego elementu.
        cy.contains("Delete").click()
      })

      // Czekamy 5s
      cy.wait(500)

      // Sprawdzamy liczbę postów po usunięciu pierwszego
      cy.get('[data-test^="post-title-"]').should('have.length', 99)
    })

    it('Przejście na stronę dodawania nowego postu', () => {
      cy.getByData("add-post-button").contains('Add post').click()

      cy.location("pathname").should("equal", "/posts/new")
    })
  })
})

describe('HTTP Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200')
  })

  it('Sprawdzenie pobierania postów z API', () => {
    // Sprawdzenie pobierania postów z API
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' }
      ]
    }).as('getPosts');

    cy.wait('@getPosts')

    cy.get('[data-test^="post-title-"]').should('have.length', 2);
  })

  it('Usunięcie pierwszego poprzez API', () => {
    // Ustawienie danych
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' }
      ]
    }).as('getPosts');

    cy.wait('@getPosts')

    // Usunięcie pierwszego posta
    cy.intercept('DELETE', 'https://jsonplaceholder.typicode.com/posts/1', {
      statusCode: 200,
      body: { success: true } // <-- dodaj cokolwiek w body
    }).as('deletePost');

    cy.getByData("post-title-0").should('exist')
    cy.getByData("post-title-1").should('exist')

    // Klikamy "Delete" tylko w tym konkretnym poście
    cy.getByData("post-title-0").within(() => {
      cy.contains("Delete").click()
    })

    cy.wait('@deletePost')  // Czekamy na zakończenie żądania DELETE
    .then(() => {
      // Po zakończeniu żądania sprawdzamy, czy post został usunięty
      cy.get('[data-test^="post-title-"]').should('have.length', 1);  // Sprawdzamy liczbę postów
    });
  })
})
