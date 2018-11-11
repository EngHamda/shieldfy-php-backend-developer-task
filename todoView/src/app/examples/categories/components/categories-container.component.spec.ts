import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import {
  createComponent,
  RenderResult,
  fireEvent
} from '@angular-extensions/testing-library';

import { MockStore, TestingModule } from '@testing/utils';

import {
  ActionCategoriesFilter,
  ActionCategoriesRemoveDone,
  ActionCategoriesToggle
} from '../categories.actions';
import { CategoriesState } from '../categories.model';
import { CategoriesContainerComponent } from './categories-container.component';
import { State } from '../../examples.state';
import { NotificationService } from '@app/core/notifications/notification.service';

describe('CategoriesComponent', () => {
  let component: RenderResult;
  let store: MockStore<State>;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    component = await createComponent('<todo-Categories></todo-Categories>', {
      imports: [TestingModule],
      declarations: [CategoriesContainerComponent],
      providers: [NotificationService],
      detectChanges: false
    });

    store = TestBed.get(Store);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should be created with 0 categories', () => {
    store.setState(createState({ categories: [], filter: 'ALL' }));
    component.fixture.detectChanges();

    expect(component).toBeTruthy();
    expect((<any>component.queryAllByTestId)('category-item').length).toBe(0);
  });

  it('should display categories', () => {
    store.setState(
      createState({
        categories: [{ id: '1', name: 'test', done: false }],
        filter: 'ALL'
      })
    );
    component.fixture.detectChanges();

    expect((<any>component.queryAllByTestId)('category-item').length).toBe(1);
    expect(component.getByTestId('category-item').textContent.trim()).toBe('test');
  });

  it('should dispatch remove "DONE" categories action', () => {
    store.setState(
      createState({
        categories: [
          { id: '1', name: 'test 1', done: true },
          { id: '2', name: 'test 2', done: false }
        ],
        filter: 'DONE'
      })
    );
    component.fixture.detectChanges();
    dispatchSpy.calls.reset();

    component.click(component.queryByLabelText('remove done categories'));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(new ActionCategoriesRemoveDone());
  });

  it('should dispatch add category action', () => {
    store.setState(createState({ categories: [], filter: 'ALL' }));
    component.fixture.detectChanges();
    dispatchSpy.calls.reset();

    component.keyUp(
      component.getByPlaceholderText('todo.examples.categories.input'),
      {
        target: {
          value: 'poke Tomas'
        }
      }
    );

    component.click(component.getByLabelText('add category'));

    expect(
      (component.getByPlaceholderText(
        'todo.examples.categories.input'
      ) as HTMLInputElement).value
    ).toBe('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.calls.mostRecent().args[0].payload.name).toBe(
      'poke Tomas'
    );
  });

  it('should dispatch filter category action', () => {
    store.setState(createState({ categories: [], filter: 'ALL' }));
    component.fixture.detectChanges();
    dispatchSpy.calls.reset();

    component.click(component.getByLabelText('open filter menu'));
    fireEvent.click(
      component.fixture.debugElement.query(
        By.css('[aria-label="show active categories"]')
      ).nativeElement
    );

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionCategoriesFilter({ filter: 'ACTIVE' })
    );
  });

  it('should dispatch toggle category action', () => {
    store.setState(
      createState({
        categories: [{ id: '1', name: 'test 1', done: true }],
        filter: 'ALL'
      })
    );
    component.fixture.detectChanges();
    dispatchSpy.calls.reset();

    component.click(component.getByLabelText('toggle category'));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionCategoriesToggle({ id: '1' })
    );
  });

  it('should disable remove done categories button if no category is done', () => {
    store.setState(
      createState({
        categories: [{ id: '1', name: 'test 1', done: true }],
        filter: 'ALL'
      })
    );
    component.fixture.detectChanges();

    expect(
      (component.getByLabelText('remove done categories') as HTMLInputElement)
        .disabled
    ).toBeFalsy();
  });

  it('should disable add new category button if input length is less than 4', () => {
    store.setState(createState({ categories: [], filter: 'ALL' }));
    component.fixture.detectChanges();

    component.keyUp(
      component.getByPlaceholderText('todo.examples.categories.input'),
      {
        target: {
          value: 'add'
        }
      }
    );

    expect(
      (component.getByLabelText('add category') as HTMLInputElement).disabled
    ).toBeTruthy();
  });

  it('should clear new category input value on ESC key press', () => {
    store.setState(createState({ categories: [], filter: 'ALL' }));
    component.fixture.detectChanges();

    component.keyUp(
      component.getByPlaceholderText('todo.examples.categories.input'),
      {
        target: {
          value: 'hellooooo'
        }
      }
    );

    expect(
      (component.getByPlaceholderText(
        'todo.examples.categories.input'
      ) as HTMLInputElement).value
    ).toBeTruthy();

    component.keyUp(
      component.getByPlaceholderText('todo.examples.categories.input'),
      {
        key: 'Esc'
      }
    );

    expect(
      (component.getByPlaceholderText(
        'todo.examples.categories.input'
      ) as HTMLInputElement).value
    ).toBeFalsy();
  });
});

function createState(categoryState: CategoriesState) {
  return {
    examples: {
      categories: categoryState
    }
  } as State;
}
