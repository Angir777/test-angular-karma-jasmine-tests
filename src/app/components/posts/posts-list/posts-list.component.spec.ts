import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsListComponent } from './posts-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PostService } from '../../../services/post/post.service';
import { of, throwError } from 'rxjs';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;

  let mockPostService = jasmine.createSpyObj('PostService', ['getPosts', 'deletePost']);

  beforeEach(async () => {
    // Konfigurujemy mocka, aby 'getPosts' zwracało Observable
    mockPostService.getPosts.and.returnValue(of([]));
    
    await TestBed.configureTestingModule({
      imports: [PostsListComponent],
      providers: [
        provideHttpClient(),  // Nowa metoda zapewnienia HttpClient
        provideRouter([]),    // Zapewnia Router (z pustą ścieżką, jeśli nie używamy routera w teście)
        { provide: PostService, useValue: mockPostService}
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('powinien utworzyć komponent app-posts-list', () => {
    expect(component).toBeTruthy();
  });

  it('powinienem otrzymać dane z getPosts', () => {
    // Arrange
    const response = [
      {
        userId: 1,
        id: 1,
        title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      }
    ];

    mockPostService.getPosts.and.returnValue(of(response)); // Imitujemy dane zwracane z API
    
    // Act
    component.getPosts();
    fixture.detectChanges();

    // Assert
    expect(mockPostService.getPosts).toHaveBeenCalled(); // Sprawdzamy, czy metoda getPosts została wywołana
    expect(component.posts()[0]).toEqual(response[0]); // Porównujemy dane w komponencie z danymi z response
    expect(component.isLoading()).toBeFalse(); // Sprawdzamy, czy loading jest ustawiony na false
  });

  it('powinien zwrócić error przy błędzie z getPosts', () => {
    // Arrange
    const error = new Error('Error deleting post');

    spyOn(console, 'log');  // Tworzymy szpiega na console.log przed wywołaniem getPosts

    mockPostService.getPosts.and.returnValue((throwError(() => error))); // Imitujemy błąd zwracany z API
    
    // Act
    component.getPosts(); // Wywołujemy getPosts

    // Assert
    expect(mockPostService.getPosts).toHaveBeenCalled(); // Sprawdzamy czy getPosts zostało wywołane
    expect(component.isLoading()).toBeFalse(); // Loader powinien być na false
    expect(console.log).toHaveBeenCalledWith(error); // Weryfikujemy czy błąd zwrócpny w 'err' to ten błąd z symulacji z API
  });

  it('powinienem usunąć post poprzez deletePost', () => {
    // Arrange
    const postId = 1;

    const post = {
      userId: 1,
      id: postId,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    };

    spyOn(console, 'log'); // Monitorujemy console.log

    mockPostService.deletePost.and.returnValue(of(post)); // Zwracamy usunięty post, a nie null!
    
    // Act
    component.deletePost(post);
    fixture.detectChanges();

    // Assert
    expect(mockPostService.deletePost).toHaveBeenCalledWith(postId); // Sprawdzamy, czy metoda getPosts została wywołana
    expect(component.posts().length).toBe(0); // Sprawdzamy, czy post został usunięty z listy
    expect(console.log).toHaveBeenCalledWith('Post with ID 1 has been deleted!'); // Jak moniturujemy console.log to mozemy sprawdzić czy został wywołany z takim tekstem
  });

  it('powinien zwrócić error przy błędzie z deletePost', () => {
    // Arrange
    const post = {
      userId: 1,
      id: 1,
      title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    };

    const error = new Error('Error deleting post');
  
    spyOn(console, 'log'); // Szpiegujemy console.log
  
    mockPostService.deletePost.and.returnValue(throwError(() => error)); // Symulujemy błąd API
  
    // Act
    component.deletePost(post);
  
    // Assert
    expect(mockPostService.deletePost).toHaveBeenCalledWith(post.id); // Sprawdzamy, czy deletePost został wywołany z właściwym ID
    expect(console.log).toHaveBeenCalledWith(error); // Sprawdzamy, czy błąd został zalogowany
  });
});
