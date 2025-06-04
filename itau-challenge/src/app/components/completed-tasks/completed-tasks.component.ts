import { Component, Input } from '@angular/core';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Tarefa } from '../../../models/tarefa.models';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [TaskItemComponent, CommonModule],
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.css'
})
export class CompletedTasksComponent {
   @Input() tarefasConcluidas: Tarefa[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tarefas => {
      this.tarefasConcluidas = tarefas.filter(t => t.isCompleted);
    });
  }
}
