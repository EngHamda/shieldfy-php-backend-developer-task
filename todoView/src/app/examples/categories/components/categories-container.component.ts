import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';

import {
  ActionCategoriesAdd,
  ActionCategoriesToggle,
  ActionCategoriesRemoveDone,
  ActionCategoriesFilter,
  ActionCategoriesPersist
} from '../categories.actions';
import {
  selectCategories,
  selectCategoriesState//,
  //selectRemoveDoneCategoriesDisabled
} from '../categories.selectors';
import { Category, CategoriesFilter } from '../categories.model';
import { Task } from '../../tasks/tasks.model';
import { State } from '../../examples.state';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@app/core/notifications/notification.service';

import { HttpClient } from '@angular/common/http';

import { ApiService } from '../../../api.service';

/***/
//#todo move to api common interfaces
export interface CategoriesWithDataApiResponseState {
  status: string;
  message: string;
  data: any;
}

export interface CategoriesDestroyApiResponseState {
  status: string;
  message: string;
}

///// export interface CategoriesState {
//   categories: Category[];
//   filter: CategoriesFilter;
// }
/***/


@Component({
  selector: 'todo-categories',
  templateUrl: './categories-container.component.html',
  styleUrls: ['./categories-container.component.scss']
})
export class CategoriesContainerComponent implements OnInit {
  private categories: any;
  newCategory:string = '';
  isListCategoryTasks:boolean = false;
  categoryTasks:Task[] = [];
  /*******
   * isAddCategoryDisabled
   * onAddCategory
   * onNewCategoryChange
   * onNewCategoryClear
   *
   * ******/
    // export class CategoriesContainerComponent implements OnInit, OnDestroy {
  // private unsubscribe$: Subject<void> = new Subject<void>();
  //
  // routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  // todos: Observable<Todo[]>;
  // removeDoneDisabled: Observable<boolean>;
  //
  

  constructor(
    private apiService: ApiService,
    private httpModule: HttpClient,

    public translateService: TranslateService,
    private notificationService: NotificationService
    // public store: Store<State>
    // public snackBar: MatSnackBar,
    
  ) {
    this.apiService.printToConsole();
  }

  ngOnInit() {
    //let categoriesIndexObs = this.httpModule.get('https://jsonplaceholder.typicode.com/posts');
    let categoriesIndexObs = this.httpModule.get(this.apiService.getCategoriesIndexUrl());
    // categoriesIndexObs === categoriesIndex$
    categoriesIndexObs.subscribe(
      (categoriesIndexResponse:CategoriesWithDataApiResponseState) => {
        this.categories = categoriesIndexResponse.data;
      },
      error => {console.log(error)},
    );
    
/****************************************/
  //   this.store
  //     .pipe(
  //       select(selectTodosState),
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe(todos => {
  //       this.store.dispatch(new ActionTodosPersist({ todos }));
  //     });
  //
  //   this.todos = this.store.pipe(select(selectTodos));
  //   this.removeDoneDisabled = this.store.pipe(
  //     select(selectRemoveDoneTodosDisabled)
  //   );
    //  sudo service mongod start
  
  }
  
  onNewCategoryChange(newCategory: string) {
    this.newCategory = newCategory;
  }
  
  get isAddCategoryDisabled() {
    //for set add button unclickable
    return this.newCategory.length < 1;
  }
  
  onNewCategoryClear() {
    this.newCategory = '';
  }
  
  onAddCategory() {
    let categoriesAddObs = this.httpModule.post(this.apiService.getCategoriesAddUrl(),
      {'name':this.newCategory});
    categoriesAddObs.subscribe(
      (categoriesAddResponse:CategoriesWithDataApiResponseState) => {
        this.categories.push(categoriesAddResponse.data);
        //to set new category a first item in category list in view only
        //   var c = this.categories.length + 1;
        //   this.categories.splice(0, 0, categoriesAddResponse.data);
        
        const addedMessage = this.translateService.instant(
          'todo.examples.categories.added.notification',
          { name: this.newCategory }
        );
        this.notificationService.info(addedMessage);
        this.onNewCategoryClear();
      },
      error => {console.log(error)},
    );
  }
  
  onShowCategoryTasks(categoryKey:number) {
    this.isListCategoryTasks = true;
    this.categoryTasks = this.categories[categoryKey].tasks;
  }
  
  onRemoveCategory(categoryId:string,categoryKey:number) {
    this.httpModule.delete(this.apiService.getCategoriesRemoveUrl(categoryId)).subscribe(
      (categoriesRemoveResponse:CategoriesDestroyApiResponseState) => {
        this.isListCategoryTasks = false;
        this.categories.splice(categoryKey, 1);
        const removedMessage = categoriesRemoveResponse.message;
        this.notificationService.info(removedMessage);
      },
      error => {console.log(error)},
    );
  }
  
  //
  // onToggleCategory(todo: Todo) {
  //   this.store.dispatch(new ActionTodosToggle({ id: todo.id }));
  //   const newStatus = this.translateService.instant(
  //     `anms.examples.todos.filter.${todo.done ? 'active' : 'done'}`
  //   );
  //   const undo = this.translateService.instant('anms.examples.todos.undo');
  //   const toggledMessage = this.translateService.instant(
  //     'anms.examples.todos.toggle.notification',
  //     { name: todo.name }
  //   );
  //
  //   this.snackBar
  //     .open(`${toggledMessage} ${newStatus}`, undo, {
  //       duration: 2500,
  //       panelClass: 'categories-notification-overlay'
  //     })
  //     .onAction()
  //     .subscribe(() => this.onToggleTodo({ ...todo, done: !todo.done }));
  // }
  //
  
  //
  // onFilterCategories(filter: TodosFilter) {
  //   this.store.dispatch(new ActionTodosFilter({ filter }));
  //   const filterToMessage = this.translateService.instant(
  //     'anms.examples.todos.filter.notification'
  //   );
  //   const filterMessage = this.translateService.instant(
  //     `anms.examples.todos.filter.${filter.toLowerCase()}`
  //   );
  //   this.notificationService.info(`${filterToMessage} ${filterMessage}`);
  // }
}
