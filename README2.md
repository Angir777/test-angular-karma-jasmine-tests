## Konfiguracja testów

# Testy jednostkowe
1. W pliku angular.json w sekcji 'test' dodajemy:
"karmaConfig": "./karma.conf.js", 
"codeCoverage": true
2. Dodajemy plik karma.conf.js by móc w testach sprawdzać pokrycie przetestowanego kodu.
3. Uruchomienie testów: npm test

# Testy e2e (https://learn.cypress.io/)
1. Instalacja Cypress: ng e2e > Cypress > n > n
2. Uruchomienie testów: 
Najpierw uruchamiamy apliakcje: npm start    
Nastepnie odpalamy testy: npm run cypress:open  lub  npm run cypress:run
3. Ciekawsze zagadnienia: 
- https://learn.cypress.io/cypress-fundamentals/waiting-and-retry-ability
- https://learn.cypress.io/cypress-fundamentals/how-to-debug-failing-tests
- https://learn.cypress.io/advanced-cypress-concepts/intercepting-network-requests
- https://learn.cypress.io/advanced-cypress-concepts/how-to-test-various-browsers-and-viewports
