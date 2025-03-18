# Angular SSR

W Angularze z SSR (Server-Side Rendering) główne różnice w pisaniu komponentów wynikają z obsługi przeglądarek i serwera. Oto kilka kluczowych aspektów, które warto uwzględnić.

## Unikanie bezpośrednich odniesień do window, document, localStorage

SSR renderuje stronę na serwerze, gdzie window, document i localStorage nie istnieją. Jeśli chcesz z nich korzystać, użyj isPlatformBrowser z @angular/common.

W 'home' jeśli komponent zostanie wyrenderowany na serwerze, message pozostanie SSR Compatible!, ale po uruchomieniu w przeglądarce zmieni się na Hello from the browser!.

## Lazy Loading i Dynamiczne Importy

SSR wymaga ostrożnego podejścia do dynamicznych importów, np. ładowania bibliotek tylko po stronie klienta.

```
async loadChartLibrary() {
  if (isPlatformBrowser(this.platformId)) {
    const { Chart } = await import('chart.js');
    // Możesz teraz używać Chart
  }
}
```

Unikamy błędu ReferenceError: window is not defined podczas renderowania na serwerze.

## Obsługa Asynchronicznych Danych

SSR może powodować problemy, jeśli komponenty oczekują na dane z API przed renderowaniem.

Rozwiązanie: Resolverzy w routingu

Resolver ładuje dane przed wejściem na stronę, co poprawia wydajność SSR.

## Preloading CSS i Optymalizacja Obrazów

Obrazy – w SSR najlepiej stosować ngSrc zamiast src, aby unikać błędów związanych z renderowaniem serwerowym:

```
<img [ngSrc]="imageUrl" width="500" height="300" alt="User Image">
```

Krytyczne style – warto osadzić najważniejsze style w styles.scss, aby uniknąć efektu "migania" (FOUC – Flash of Unstyled Content).

## Zabezpieczenie przed ExpressionChangedAfterItHasBeenCheckedError

W Angularze SSR komponenty mogą zostać ponownie renderowane w przeglądarce, co prowadzi do tego błędu.

Rozwiązanie: użycie ChangeDetectorRef

detectChanges() zapewnia, że zmiany zostaną poprawnie wykryte bez błędów.

## Zarządzanie Hydratacją Danych

Jeśli dane z serwera są przesyłane do klienta, możesz użyć TransferState, aby uniknąć ponownego zapytania do API.

```
import { Component } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

const USER_KEY = makeStateKey('user');

@Component({
  selector: 'app-user',
  template: `<p>{{ user?.name }}</p>`
})
export class UserComponent {
  user: any;

  constructor(private http: HttpClient, private state: TransferState) {
    const savedUser = this.state.get(USER_KEY, null);
    if (savedUser) {
      this.user = savedUser;
    } else {
      this.http.get('/api/user').subscribe(user => {
        this.user = user;
        this.state.set(USER_KEY, user);
      });
    }
  }
}
```

Dzięki temu SSR przekazuje dane do klienta bez konieczności ponownego zapytania do API.
