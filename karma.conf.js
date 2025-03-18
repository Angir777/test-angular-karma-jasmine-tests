module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        'karma-jasmine',
        'karma-chrome-launcher',
        'karma-jasmine-html-reporter',
        '@angular-devkit/build-angular/plugins/karma',
        'karma-coverage'
      ],
      client: {
        jasmine: {
          random: false,  // Jeśli chcesz, aby testy zawsze były uruchamiane w tej samej kolejności
          stopSpecOnExpectationFailure: false,  // Jeśli testy mają być zatrzymywane po pierwszym niepowodzeniu
          failFast: true  // Jeśli chcesz zatrzymać wykonywanie testów po pierwszym błędzie
        },
        clearContext: false // Zapobiega czyszczeniu wyników testów w przeglądarce
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage'),
        subdir: '.',
        reporters: [
          { type: 'html' },  // Raport HTML
          { type: 'lcov' },  // Raport LCOV
          { type: 'text-summary' }  // Podsumowanie w konsoli
        ]
      },
      reporters: ['progress', 'coverage', 'kjhtml'],
      browsers: ['Chrome'],
      singleRun: false,
      restartOnFileChange: true
    });
  };
  