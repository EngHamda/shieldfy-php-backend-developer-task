import { Injectable } from '@angular/core';

import { environment as env } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private url: string = env.apiUrl;
  
  private categoriesIndexUrl: string;
  private categoriesAddUrl: string;
  private categoriesRemoveUrl: string;
  
  private tasksIndexUrl: string;
  private tasksAddUrl: string;
  private tasksRemoveUrl: string;
  
  constructor() { }
  
  printToConsole(){
    console.log(this.url);
  }
  
  getUrl(){
    return this.url;
  }

  getCategoriesIndexUrl(){
    this.categoriesIndexUrl = this.url + 'categories';
    return this.categoriesIndexUrl;
  }
  
  getCategoriesAddUrl(){
    this.categoriesAddUrl = this.url + 'categories';
    return this.categoriesAddUrl;
  }
  
  getCategoriesRemoveUrl(categoryId:string){
    this.categoriesRemoveUrl = this.url + 'categories/'+ categoryId;
    return this.categoriesRemoveUrl;
  }
  
  getTasksIndexUrl(){
    this.tasksIndexUrl = this.url + 'tasks';
    return this.tasksIndexUrl;
  }
  
  getTasksAddUrl(){
    this.tasksAddUrl = this.url + 'tasks';
    return this.tasksAddUrl;
  }
  
  getTasksRemoveUrl(taskId:string){
    this.tasksRemoveUrl = this.url + 'tasks/'+ taskId;
    return this.tasksRemoveUrl;
  }
}
