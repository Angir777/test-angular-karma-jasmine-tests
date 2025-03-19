import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Post } from '../../models/post/post';

describe('PostService', () => {
  let service: PostService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostService, 
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PostService); // Pobieramy instancję PostService, którą będziemy testować.
    httpController = TestBed.inject(HttpTestingController); // Pobieramy HttpTestingController, który pozwala kontrolować i sprawdzać żądania HTTP.
  });

  it('powinien utworzyć serwis post', () => {
    expect(service).toBeTruthy();
  });

  it('powinien poprawnie wywołać metodę getPosts', () => {
    // Oczekiwana odpowiedź z API
    const response = [
      {
        userId: 1,
        id: 1,
        title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      }
    ];

    service.getPosts().subscribe((res) => {
      expect(res).toEqual(response); // Sprawdzamy, czy odpowiedź zwrócona przez getPosts() zgadza się z oczekiwaną odpowiedzią z symulacji API
    });

    // Sprawdzamy, czy wysłano jedno żądanie HTTP GET na odpowiedni URL
    const req = httpController.expectOne({
      method: 'GET',
      url: `https://jsonplaceholder.typicode.com/posts`,
    });

    req.flush(response); // Symuluje odpowiedź API, dzięki czemu test nie wysyła prawdziwego żądania
  });

  it('powinien poprawnie wywołać metodę getPost', () => {
    // ID postu
    const postId = 1;

    // Oczekiwana odpowiedź z API
    const response = {
      userId: 1,
      id: postId,
      title: "Testowy tytuł",
      body: "Testowa treść posta"
    };

    service.getPost(postId).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
    });

    req.flush(response);
  });

  it('powinien poprawnie wywołać metodę createPost', () => {
    // Oczekiwana odpowiedź z API + wysyłane dane
    const newPost = {
      userId: 1,
      id: null,
      title: "Nowy post",
      body: "Treść nowego posta"
    };
    const response: Post = { ...newPost, id: 1 };

    service.createPost(newPost).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `https://jsonplaceholder.typicode.com/posts`,
    });

    req.flush(response);
  });

  it('powinien poprawnie wywołać metodę updatePost', () => {
    // Oczekiwana odpowiedź z API + wysyłane dane
    const updatedPost = {
      userId: 1,
      id: 1,
      title: "Zaktualizowany tytuł",
      body: "Zaktualizowana treść posta"
    };

    service.updatePost(updatedPost).subscribe((res) => {
      expect(res).toEqual(updatedPost);
    });

    const req = httpController.expectOne({
      method: 'PUT',
      url: `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
    });

    req.flush(updatedPost);
  });

  it('powinien poprawnie wywołać metodę deletePost', () => {
    // ID postu
    const postId = 1;

    service.deletePost(postId).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpController.expectOne({
      method: 'DELETE',
      url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
    });

    req.flush(null);
  });
});
