import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedTasksComponent } from './completed-tasks.component';
import { Tarefa } from '../../../models/tarefa.models';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CompletedTasksComponent', () => {
  let component: CompletedTasksComponent;
  let fixture: ComponentFixture<CompletedTasksComponent>;

  const tarefasMock: Tarefa[] = [
    { id: 1, name: 'Tarefa 1', isCompleted: true, completionDate: new Date('2025-06-04T02:36:20.088Z') },
    { id: 3, name: 'Tarefa 3', isCompleted: true, completionDate: new Date('2025-06-04T02:48:39.050Z') },
  ];

  function formatDateForTest(date: Date): string {
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();
  const horas = date.getHours().toString().padStart(2, '0');
  const minutos = date.getMinutes().toString().padStart(2, '0');
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CompletedTasksComponent,
        HttpClientTestingModule  
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedTasksComponent);
    component = fixture.componentInstance;
    component.tarefasConcluidas = [...tarefasMock]; 
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

 it('deve exibir as tarefas recebidas', () => {
  const tarefasRenderizadas = fixture.debugElement.queryAll(By.css('app-task-item'));
  expect(tarefasRenderizadas.length).toBe(2);

  tarefasRenderizadas.forEach((tarefaDebugEl, index) => {
    const nome = tarefaDebugEl.nativeElement.querySelector('span')?.textContent.trim();
    const data = tarefaDebugEl.nativeElement.querySelector('time')?.textContent.trim();

    expect(nome).toContain(tarefasMock[index].name);
    expect(data).toContain(
      formatDateForTest(tarefasMock[index].completionDate as Date)
    );
  });
});


  it('deve exibir mensagem se não houver tarefas concluídas', () => {
    component.tarefasConcluidas = [];
    fixture.detectChanges();

    const tarefasRenderizadas = fixture.debugElement.queryAll(By.css('li'));
    expect(tarefasRenderizadas.length).toBe(0);

    const mensagem = fixture.debugElement.query(By.css('.task-not-completed'));
    expect(mensagem).toBeTruthy();
    expect(mensagem.nativeElement.textContent).toContain('Nenhuma tarefa concluída');
  });
});
