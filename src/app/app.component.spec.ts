import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('powinien utworzyć komponent app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    expect(app).toBeTruthy();
  });

  it(`powinien mieć w zmiennej 'title' wartość 'my-angular-csr-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    expect(app.title).toEqual('my-angular-csr-app');
  });

  it(`powinien wyrenderować 'title' w html jako <h1>Hello, my-angular-csr-app</h1>`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-angular-csr-app');
  });
});
