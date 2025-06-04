import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { Tarefa } from '../../../models/tarefa.models';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const tarefaIncompletaMock: Tarefa = {
    id: 1,
    name: 'Tarefa de Teste',
    isCompleted: false,
    completionDate: null
  };

  const tarefaCompletaMock: Tarefa = {
    id: 2,
    name: 'Tarefa Completa',
    isCompleted: true,
    completionDate: new Date('2024-05-25T15:30:00')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent] // Standalone
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.tarefa = { ...tarefaIncompletaMock };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve emitir onDeleteTask quando onDelete é chamado', () => {
    spyOn(component.onDeleteTask, 'emit');

    component.onDelete(tarefaIncompletaMock);

    expect(component.onDeleteTask.emit).toHaveBeenCalledWith(tarefaIncompletaMock);
  });

  it('deve entrar em modo de edição ao chamar onEdit', () => {
    component.onEdit();

    expect(component.isEditing).toBeTrue();
    expect(component.nomeEditado).toBe(tarefaIncompletaMock.name);
  });

  it('deve salvar a edição e emitir edit', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();
    component.nomeEditado = 'Tarefa Editada';
    component.onSave();

    expect(component.tarefa.name).toBe('Tarefa Editada');
    expect(component.edit.emit).toHaveBeenCalledWith(component.tarefa);
    expect(component.isEditing).toBeFalse();
  });

  it('não deve salvar se nomeEditado for vazio ou espaços', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();
    component.nomeEditado = '   ';
    component.onSave();

    expect(component.edit.emit).not.toHaveBeenCalled();
    expect(component.isEditing).toBeTrue();
  });

  it('deve emitir onToggleConcluido ao chamar onToggle', () => {
    spyOn(component.onToggleConcluido, 'emit');

    component.onToggle(tarefaIncompletaMock);

    expect(component.onToggleConcluido.emit).toHaveBeenCalledWith(tarefaIncompletaMock);
  });

  it('deve exibir data formatada corretamente se completionDate estiver preenchido', () => {
    const data = new Date('2024-05-25T15:30:00');
    component.tarefa = {
      ...tarefaCompletaMock
    };

    const resultado = component.dataFormatada;

    expect(resultado).toContain('25');
    expect(resultado).toContain('maio');
    expect(resultado).toContain('15:30');
  });

  it('deve retornar string vazia se completionDate não estiver definido', () => {
    component.tarefa.completionDate = null;
    const resultado = component.dataFormatada;

    expect(resultado).toBe('');
  });

  it('deve ativar e cancelar confirmação de delete', () => {
    component.showConfirmDelete();
    expect(component.isConfirmingDelete).toBeTrue();

    component.cancelDelete();
    expect(component.isConfirmingDelete).toBeFalse();
  });
});
