import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '@app/shared';
import { environment } from '@env/environment';

// import { FEATURE_NAME, reducers } from './examples.state';
// import { FEATURE_NAME } from './examples.state';
import { ExamplesRoutingModule } from './examples-routing.module';
import { ExamplesComponent } from './examples/examples.component';

import { CategoriesContainerComponent } from './categories/components/categories-container.component';
import { TasksComponent } from './tasks/components/tasks.component';

@NgModule({
  imports: [
    SharedModule,
    ExamplesRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  declarations: [
    ExamplesComponent,
    CategoriesContainerComponent,
    TasksComponent
  ],
  providers: []
})

// export const FEATURE_NAME = 'examples';

export class ExamplesModule {
  constructor() {}
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/examples/`,
    '.json'
  );
}
