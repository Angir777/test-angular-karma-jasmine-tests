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