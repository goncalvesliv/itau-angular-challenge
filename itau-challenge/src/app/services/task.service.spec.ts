import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TaskService } from './task.service';
import { Tarefa } from '../../models/tarefa.models';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar as tarefas (getTasks)', () => {
    const mockTasks: Tarefa[] = [
      { id: 1, name: 'Tarefa 1', isCompleted: false, completionDate: null },
      { id: 2, name: 'Tarefa 2', isCompleted: true, completionDate: new Date() }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);
  });

  it('deve adicionar uma tarefa (addTask)', () => {
    const newTask: Omit<Tarefa, 'id'> = {
      name: 'Nova Tarefa',
      isCompleted: false,
      completionDate: null
    };

    const createdTask: Tarefa = { id: 123, ...newTask };

    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual(createdTask);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush(createdTask);
  });

  it('deve deletar uma tarefa (deleteTask)', () => {
    const taskToDelete: Tarefa = {
      id: 10,
      name: 'Tarefa para deletar',
      isCompleted: false,
      completionDate: null
    };

    service.deleteTask(taskToDelete).subscribe(response => {
      expect(response).toEqual(taskToDelete);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${taskToDelete.id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(taskToDelete);
  });

  it('deve atualizar uma tarefa (updateTask)', () => {
    const updatedTask: Tarefa = {
      id: 5,
      name: 'Tarefa Atualizada',
      isCompleted: true,
      completionDate: new Date()
    };

    service.updateTask(updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${updatedTask.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);

    req.flush(updatedTask);
  });
});
