import { Task } from '../tasks/tasks.model';
export interface Category {
  _id: string;
  name: string;
  tasks: Task[];
}

export type CategoriesFilter = 'ALL' | 'DONE' | 'ACTIVE';

export interface CategoriesState {
  categories: Category[];
  filter: CategoriesFilter;
}
