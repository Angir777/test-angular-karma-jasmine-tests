import { Routes } from '@angular/router';
import { PostsListComponent } from './components/posts/posts-list/posts-list.component';
import { UpdatePostComponent } from './components/posts/update-post/update-post.component';
import { CalculationsComponent } from './components/calculations/calculations.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full',
    },
    {
        path: 'posts',
        children: [
            {
                path: '',
                component: PostsListComponent,
                data: {
                    title: 'Posts list',
                },
            },
            {
                path: 'new',
                component: UpdatePostComponent,
                data: {
                    title: 'New post',
                },
            },
            {
                path: ':id/edit',
                component: UpdatePostComponent,
                data: {
                    title: 'Update post',
                },
            }
        ]
    },
    {
        path: 'calculations',
        component: CalculationsComponent,
    },
];
