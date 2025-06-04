import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Tarefa } from '../../../models/tarefa.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CompletedTasksComponent } from "../completed-tasks/completed-tasks.component";


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, FormsModule, CompletedTasksComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tarefas: Tarefa[] = [];
  tarefa: string = '';
  mostrarErro: boolean = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((dado) => {
      this.tarefas = dado;
    });
  }

  addTask() {
    if (!this.tarefa.trim()) {
      this.mostrarErro = true;
      return;
    }

    const nova: Omit<Tarefa, 'id'> = {
      name: this.tarefa.trim(),
      isCompleted: false,
      completionDate: null
    };

    this.taskService.addTask(nova).subscribe((tarefaCriada) => {
      this.tarefas.push(tarefaCriada);
      this.tarefa = '';
      this.mostrarErro = false;
    });
  }

  deleteTask(tarefa: Tarefa) {
    this.taskService.deleteTask(tarefa).subscribe(() => {
      this.tarefas = this.tarefas.filter((t) => t.id !== tarefa.id);
    });
  }

  handleEdit(tarefa: Tarefa) {
    this.taskService.updateTask(tarefa).subscribe(() => {
      const index = this.tarefas.findIndex(t => t.id === tarefa.id);
      if (index > -1) {
        this.tarefas[index] = tarefa;
      }
    });
  }

  toggleConcluido(tarefa: Tarefa) {
    tarefa.isCompleted = !tarefa.isCompleted;
    tarefa.completionDate = tarefa.isCompleted ? new Date().toISOString() : null;

    this.taskService.updateTask(tarefa).subscribe();
  }

    get tarefasPendentes() {
      return this.tarefas.filter(t => !t.isCompleted);
    }

    get tarefasConcluidas() {
      return this.tarefas.filter(t => t.isCompleted);
    }

}
