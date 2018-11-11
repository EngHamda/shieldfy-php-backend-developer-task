import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamplesComponent } from './examples/examples.component';

import { CategoriesContainerComponent } from './categories/components/categories-container.component';

import { TasksComponent } from './tasks/components/tasks.component';

const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
          path: 'categories',
          component: CategoriesContainerComponent,
          data: { title: 'todo.examples.menu.categories' }
      },
      {
          path: 'tasks',
          component: TasksComponent,
          data: { title: 'todo.examples.menu.tasks' }
      },
      {
          path: 'tasks/:_id',
          component: TasksComponent,
          data: { title: 'todo.examples.menu.tasks' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
