import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CompletedTasksComponent } from '../completed-tasks/completed-tasks.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['getTasks', 'addTask', 'deleteTask', 'updateTask']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, FormsModule, TaskItemComponent, CompletedTasksComponent],
      providers: [
        { provide: TaskService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

    taskServiceSpy.getTasks.and.returnValue(of([]));

    fixture.detectChanges();
  });


  it('deve adicionar uma nova tarefa', () => {
    const tarefaMock = {
      id: 1,
      name: 'Nova tarefa',
      isCompleted: false,
      completionDate: null
    };

    taskServiceSpy.addTask.and.returnValue(of(tarefaMock));

    component.tarefas = [];

    component.tarefa = 'Nova tarefa';

    component.addTask();

    fixture.detectChanges();

    expect(component.tarefas.length).toBe(1);
    expect(component.tarefas[0].name).toBe('Nova tarefa');
    expect(component.mostrarErro).toBeFalse();
    expect(taskServiceSpy.addTask).toHaveBeenCalledWith({
      name: 'Nova tarefa',
      isCompleted: false,
      completionDate: null
    });
  });
});
