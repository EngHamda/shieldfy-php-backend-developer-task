//#todo: remove
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { AppState } from '@app/core';

import { CategoriesState } from './categories/categories.model';
import { TaskState } from './tasks/tasks.model';
// import { Task, TaskState } from './tasks/tasks.model';

export const FEATURE_NAME = 'examples';

export interface ExamplesState {
  categories: CategoriesState;
  tasks: TaskState;
}

export interface State extends AppState {
  examples: ExamplesState;
}
