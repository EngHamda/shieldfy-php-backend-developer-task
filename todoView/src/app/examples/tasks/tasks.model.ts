import { EntityState } from '@ngrx/entity';

export interface Task {
  _id: string;
  title: string;
  description: string;
  category_id: string;
}

export interface TaskState extends EntityState<Task> {}
