import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tarefa } from '../../../models/tarefa.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input() tarefa!: Tarefa;
  @Input() mostrarBotoes: boolean = true;

  @Output() onDeleteTask = new EventEmitter<Tarefa>();
  @Output() edit = new EventEmitter<Tarefa>();
  @Output() onToggleConcluido = new EventEmitter<Tarefa>();

  isEditing = false;
  nomeEditado = '';
  isConfirmingDelete = false;


  showConfirmDelete() {
    this.isConfirmingDelete = true;
  }

  cancelDelete() {
    this.isConfirmingDelete = false;
  }

  onDelete(tarefa: Tarefa) {
    this.onDeleteTask.emit(tarefa);
  }

  onEdit() {
    this.isEditing = true;
    this.nomeEditado = this.tarefa.name;
  }

  onSave() {
    if (this.nomeEditado.trim()) {
      this.tarefa.name = this.nomeEditado.trim();
      this.edit.emit(this.tarefa);
      this.isEditing = false;
    }
  }

  onToggle(tarefa: Tarefa) {
    this.onToggleConcluido.emit(tarefa);
  }

  get dataFormatada(): string {
    if (!this.tarefa.completionDate) {
      return '';
    }

    const data = new Date(this.tarefa.completionDate);

    const dataStr = data.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const horaStr = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${dataStr} às ${horaStr}`;
  }


}
