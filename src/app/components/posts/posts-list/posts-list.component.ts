import { Component, inject, signal } from '@angular/core';
import { PostService } from '../../../services/post/post.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Post } from '../../../models/post/post';

@Component({
  selector: 'app-posts-list',
  imports: [RouterModule],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent {
  posts = signal<Post[]>([]);
  isLoading = signal(false);

  readonly postService = inject(PostService);

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.isLoading.set(true);
    this.postService
      .getPosts()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res != null) {
            this.posts.set(res);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  deletePost(post: Post): void {
    if (post.id == null) {
      console.error('Cannot delete a post without a valid ID.');
      return;
    }

    this.postService
      .deletePost(post.id)
      .subscribe({
        next: (res) => {
          if (res != null) {
            console.log(`Post with ID ${post.id} has been deleted!`);

            // Updating the list of posts after deletion
            this.posts.set(this.posts().filter(p => p.id !== post.id));
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }
}
