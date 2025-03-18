import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculationsComponent } from './calculations.component';
import { By } from '@angular/platform-browser';

describe('CalculationsComponent', () => {
  let component: CalculationsComponent;
  let fixture: ComponentFixture<CalculationsComponent>;

  // Ustawiam opcje przed każdym testem
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculationsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Ustawiam opcje po każdym teście
  afterEach(() => {
    component.const.set(0); // Resetujemy wartość const 
  });

  it('powinien utworzyć komponent calculations', () => {
    expect(component).toBeTruthy();
  });

  // Przetestowanie wyniku jakiejś funkcji z komponentu
  it(`powinien poprawnie wykonać obliczenia w funkcji 'add'`, () => {
    // Arrange
    const a = 5;
    const b = 5;

    // Act
    const total = component.add(a, b); // Wywołujemy funkcję z podanymi parametrami

    // Assert
    expect(total).toEqual(10);
  });

  it(`powinien poprawnie ustawić wartość zmiennej 'const' w wywołaniu funkcji 'changeConst'`, () => {
    expect(component.const()).toBeDefined(); // Zmienna 'const' jest zdefiniowana
    expect(component.const()).toEqual(0); // Zmienna 'const' ma początkowo wartość '0'

    component.changeConst(); // Wywołujemy funkcję zmieniająca wartość

    expect(component.const()).toEqual(1); // Zmienna 'const' ma teraz wartość '1'
  });

  it(`powinien wywołać funkcję 'changeConst' po kliknięciu w przycisk i odpowiednio ustawić wartość`, () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-test-id="change-const-button"]'); // Odnajdujemy przycisk w html

    expect(button).toBeTruthy(); // Sprawdzamy, czy przycisk istnieje
    expect(button.textContent?.trim()).toBe('Click! 0'); // Sprawdzamy, czy ma poprawny tekst startowy, czyli 'Click! 0'

    button.click();// Symulujemy kliknięcie przycisku
    fixture.detectChanges(); // Wywołyjemy aktualizację widoku

    expect(button.textContent?.trim()).toBe('Click! 1'); // Sprawdzamy, czy tekst się zmienił na 'Click! 1'
  });

  it(`powinien zawierać komponent 'app-navbar'`, () => {
    const navComponent = fixture.debugElement.query(By.css('app-nav-bar')); // Sprawdzamy, czy komponent 'CalculationsComponent' zawiera komponent 'NavBarComponent'

    expect(navComponent).toBeTruthy();
  });
});
