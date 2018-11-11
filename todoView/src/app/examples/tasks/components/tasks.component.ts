import { v4 as uuid } from 'uuid';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { State } from '../../examples.state';
import { Task } from '../tasks.model';
import { Category } from '../../categories/categories.model';
import { ActionTasksUpsertOne, ActionTasksDeleteOne } from '../tasks.actions';
import { selectSelectedTask, selectAllTasks } from '../tasks.selectors';

import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@app/core/notifications/notification.service';

import { HttpClient } from '@angular/common/http';

import { ApiService } from '../../../api.service';

/***/
//#todo move to api common interfaces
export interface TasksWithDataApiResponseState {
  status: string;
  message: string;
  data: any;
}

export interface TasksDestroyApiResponseState {
  status: string;
  message: string;
}

@Component({
  selector: 'todo-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  private tasks: Task[];
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;//for select function
  private categories: any;
  isEditing:boolean = false;
  isTaskSelected:boolean = false;
  taskFormGroup = this.fb.group(TasksComponent.createTask());
  selectedTask: Task;
  selectedTaskKey: number;
  static createTask(): Task {
    return {
      _id: '',
      title: '',
      description: '',
      category_id: ''
    };
  }
  
  // newTask:string = '';
  // isListCategoryTasks:boolean = false;
  // categoryTasks:Task[] = [];
  
    // export class TasksComponent implements OnInit, OnDestroy {
  // private unsubscribe$: Subject<void> = new Subject<void>();
  //
  
  constructor(
    public fb: FormBuilder,//for form
    private router: Router,//for select function
    
    private apiService: ApiService,
    private httpModule: HttpClient,
    
    public translateService: TranslateService,
    private notificationService: NotificationService
    // public store: Store<State>
    // public snackBar: MatSnackBar, for catePage
    // , for curdPage
  
  ) {
    this.apiService.printToConsole();
  }
  
  ngOnInit() {
    let tasksIndexObs = this.httpModule.get(this.apiService.getTasksIndexUrl());
    tasksIndexObs.subscribe(
      (tasksIndexResponse:TasksWithDataApiResponseState) => {
        this.tasks = tasksIndexResponse.data.tasks;
        this.categories = tasksIndexResponse.data.categories;
      },
      error => {console.log(error)},
    );
    
    // this.books$ = this.store.pipe(select(selectAllBooks));
    // this.store
    //   .pipe(
    //     select(selectSelectedBook),
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(book => (this.selectedBook = book));
  }
  
  addNewTask(taskForm: NgForm) {
    taskForm.resetForm();
    this.taskFormGroup.reset();
    this.taskFormGroup.setValue(TasksComponent.createTask());
    this.isEditing = true;
  }
  
  cancelEditing() {
    this.isEditing = false;
  }
  
  save() {
    if (this.taskFormGroup.valid) {
      const task = this.taskFormGroup.value;
      let tasksAddObs = this.httpModule.post(this.apiService.getTasksAddUrl(),task);
      tasksAddObs.subscribe(
        (tasksAddResponse:TasksWithDataApiResponseState) => {
          this.tasks.push(tasksAddResponse.data);
          //to set new category a first item in category list in view only
          //   var c = this.tasks.length + 1;
          //   this.tasks.splice(0, 0, tasksAddResponse.data);

          const addedMessage = this.translateService.instant(
            'todo.examples.tasks.added.notification',
            { title: task.title }
          );
          this.notificationService.info(addedMessage);
          this.isEditing = false;
          this.router.navigate(['examples/tasks', task._id]);
        },
        error => {console.log(error)}
      );
    }
  }
  
  onSelectTask(taskId: string, taskKey: number) {
    this.isEditing = false;
    this.isTaskSelected = true;
    this.selectedTask = this.tasks[taskKey];
    this.selectedTaskKey = taskKey;
    this.router.navigate(['examples/tasks', taskId]);
  }
  
  deselect() {
    this.isEditing = false;
    this.isTaskSelected = false;
    this.router.navigate(['examples/tasks','']);
  }
  
  onRemoveTask(taskId:string, taskKey:number){
      this.httpModule.delete(this.apiService.getTasksRemoveUrl(taskId)).subscribe(
        (tasksRemoveResponse:TasksDestroyApiResponseState) => {
          this.isEditing = false;
          this.isTaskSelected = false;
          this.tasks.splice(taskKey, 1);
          const removedMessage = tasksRemoveResponse.message;
          this.notificationService.info(removedMessage);
          this.router.navigate(['examples/tasks','']);
        },
        error => {console.log(error)},
      );
  }
  
  // ngOnDestroy() {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  // }
  
  // edit() {
  //   this.isEditing = true;
  //   this.bookFormGroup.setValue(this.selectedBook);
  // }
}
