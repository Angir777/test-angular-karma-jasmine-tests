import { Component, inject, signal } from '@angular/core';
import { PostService } from '../../../services/post/post.service';
import { ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Post } from '../../../models/post/post';

@Component({
  selector: 'app-update-post',
  imports: [ReactiveFormsModule],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.scss'
})
export class UpdatePostComponent {
  title = '';

  post = signal<Post | null>(null);
  isLoading = signal(false);

  currentUserId = signal(5);

  form!: FormGroup;
  isSaving = signal(false);

  readonly postService = inject(PostService);
  readonly route = inject(ActivatedRoute);
  readonly formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm();

    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.title = 'Edit post';
        this.getPost(+params['id']);
      } else {
        this.title = 'Add post';
      }
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [null],
      title: [null],
      body: [null],
      userId: [null],
    });
  }

  updateForm(post: Post) {
    this.form.patchValue(post);
  }

  getPost(id: number) {
    this.isLoading.set(true);
    this.postService
      .getPost(id)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res != null) {
            this.post.set(res);
            
            this.updateForm(res);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  submit() {
    const dataToSave: Post = {
      id: this.post()?.id ?? null,
      title: this.form.get(['title'])!.value,
      body: this.form.get(['body'])!.value,
      userId: this.post()?.userId ?? this.currentUserId()
    };

    if (this.post() == null) {
      this.create(dataToSave);
    } else {
      this.update(dataToSave);
    }
  }

  private create(post: Post): void {
    this.isSaving.set(true);
    this.postService
      .createPost(post)
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          alert(JSON.stringify(res, null, 2));
          this.form.reset();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  private update(post: Post): void {
    this.isSaving.set(true);
    this.postService
      .updatePost(post)
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          console.log("Updated successfully!", res);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }
}
