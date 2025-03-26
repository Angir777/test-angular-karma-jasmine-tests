## Przykąłd testu komponentu w cypress

import { mount } from "cypress/angular";
import { CalculationsComponent } from '../src/app/components/calculations/calculations.component';

describe('CalculationsComponent.cy.ts', () => {
  beforeEach(() => {
    // Montujemy komponent przed każdym testem
    mount(CalculationsComponent).then(({ component }) => {
      cy.wrap(component).as('component'); // Zapisujemy komponent jako alias
    });
  });

  it('powinien wyświetlać nazwę komponentu', () => {
    cy.get('p').first().should('have.text', 'calculations works!');
  });

  it(`powinien poprawnie wykonać obliczenia w funkcji 'add'`, () => {
    cy.get('@component').then((component) => {
      // Rzutowanie na odpowiedni typ
      const calculationsComponent = component as unknown as CalculationsComponent;

      const a = 5;
      const b = 5;

      const total = calculationsComponent.add(a, b);
      expect(total).to.equal(10);
    });
  });

  it(`powinien poprawnie ustawić wartość zmiennej 'const' w wywołaniu funkcji 'changeConst'`, () => {
    cy.get('@component').then((component) => {
      const calculationsComponent = component as unknown as CalculationsComponent;

      cy.wrap(calculationsComponent.const()).should('eq', 0) // Sprawdzamy początkową wartość

      cy.wrap(calculationsComponent.changeConst()) // Wywołanie metody zmieniającej wartość

      cy.wrap(calculationsComponent.const()).should('eq', 1) // Po wywołaniu powinno być 1
    });
  });

  it(`powinien wywołać funkcję 'changeConst' po kliknięciu w przycisk i odpowiednio ustawić wartość`, () => {
    cy.get('[data-test-id="change-const-button"]')
      .should('exist') // Sprawdzamy, czy przycisk istnieje
      .and('have.text', 'Click! 0'); // Początkowy tekst przycisku
    
    cy.get('[data-test-id="change-const-button"]').click(); // Kliknięcie w przycisk
    
    cy.get('[data-test-id="change-const-button"]')
      .should('have.text', 'Click! 1'); // Sprawdzamy, czy tekst się zmienił na 'Click! 1'
  });

  it(`powinien zawierać komponent 'app-navbar'`, () => {
    cy.get('app-nav-bar') // Szukamy komponentu 'app-nav-bar' w DOM
      .should('exist'); // Sprawdzamy, czy komponent istnieje
  });
})