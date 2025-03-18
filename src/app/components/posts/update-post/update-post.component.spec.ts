import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePostComponent } from './update-post.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Post } from '../../../models/post/post';
import { of } from 'rxjs';
import { PostService } from '../../../services/post/post.service';

describe('UpdatePostComponent', () => {
  let component: UpdatePostComponent;
  let fixture: ComponentFixture<UpdatePostComponent>;

  let mockPostService = jasmine.createSpyObj('PostService', ['createPost', 'updatePost']);

  beforeEach(async () => {
    mockPostService.createPost.and.returnValue(of([]));
    mockPostService.updatePost.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [UpdatePostComponent], // HttpClientModule, RouterTestingModule <- deprecated
      providers: [
        provideHttpClient(),  // Nowa metoda zapewnienia HttpClient
        provideRouter([]),    // Zapewnia Router (z pustą ścieżką, jeśli nie używasz routera w teście)
         { provide: PostService, useValue: mockPostService}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('powinien utworzyć komponent app-update-post', () => {
    expect(component).toBeTruthy();
  });

  it('powinien utworzyć formularz z odpowiednimi polami i wartościami początkowymi', () => {
    expect(component.form).toBeDefined();
    expect(component.form.value).toEqual({
      id: null,
      title: null,
      body: null,
      userId: null,
    })
  });

  it('powinien wywołać submit i createPost przy dodawaniu nowego posta', () => {
    // Arrange
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"].submit-button'); // Odnajdujemy przycisk w html
    expect(button).toBeTruthy(); // Sprawdzamy, czy przycisk istnieje

    const data: Post = {
      id: null, // Nowy post, więc id jest null
      title: 'Test Post',
      body: 'Test description',
      userId: component.currentUserId(),
    };
    const response: Post = { ...data, id: 1 };

    mockPostService.createPost.and.returnValue(of(response));
    
    component.form.setValue(data); // Ustawiawiamy dane w formularzu, aby symulować, że użytkownik je wprowadził

    // Act
    button.click(); // Symulujemy kliknięcie przycisku
    fixture.detectChanges(); 

    // Assert
    expect(mockPostService.createPost).toHaveBeenCalledWith(data); // Sprawdzenie, czy metoda createPost została wywołana z odpowiednimi danymi
    expect(component.isSaving()).toBeFalse(); // Sprawdzenie stanu isSaving
  });

  it('powinien wywołać submit i updatePost przy aktualizowaniu posta', () => {
    // Arrange
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"].submit-button'); // Odnajdujemy przycisk w html
    expect(button).toBeTruthy(); // Sprawdzamy, czy przycisk istnieje

    const existingPost: Post = {
      id: 1,
      title: 'Test Post',
      body: 'Test content',
      userId: component.currentUserId(),
    };
    const updatedPost: Post = {
      id: 1, 
      title: 'Updated Post',
      body: 'Updated content',
      userId: component.currentUserId()
    };

    spyOn(component, 'post').and.returnValue(existingPost); // Symuluje dane początkowe
    
    mockPostService.updatePost.and.returnValue(of(updatedPost)); // Symuluje rzeczywistą odpowiedź z serwera po aktualizacji
    
    component.form.patchValue(updatedPost); // Ustawiawiamy dane w formularzu, aby symulować, że użytkownik je wprowadził

    // console.log('Wartość post():', component.post());
    // console.log('Dane w formularzu:', component.form.value);
    // console.log('Czy createPost jest szpiegiem?', jasmine.isSpy(mockPostService.createPost));

    // Act
    button.click();
    fixture.detectChanges(); 

    // Assert
    expect(mockPostService.updatePost).toHaveBeenCalledWith(updatedPost);
    expect(component.isSaving()).toBeFalse();
  });
});
