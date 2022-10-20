import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MyTask } from 'src/app/types'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() task: MyTask = {
    id: '',
    title: '',
    description: '',
    endDate: '',
  };

  @Output() onEditTask = new EventEmitter();
  @Output() onCompleteTask = new EventEmitter();

  edit($event: any): void {
    $event.stopPropagation();
    this.onEditTask.emit(this.task.id);
  }

  complete($event: any): void {
    $event.stopPropagation();
    this.onCompleteTask.emit(this.task.id);
  }

  today = new Date();

  subtractDays(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  isApproachingDeadline(): boolean {
    const endDateTypeDate = new Date(this.task.endDate);
    const endDateAfterThreeDay = this.subtractDays(endDateTypeDate, 3);
    return endDateAfterThreeDay <= this.today;
  }

  isExceedingDeadline(): boolean {
    const endDateTypeDate = new Date(this.task.endDate);
    return endDateTypeDate < this.today;
  }

  isShowDescription: boolean = false;

  showDescription($event: any): void {
    $event.stopPropagation();
    this.isShowDescription = !this.isShowDescription;
  }

  @HostListener("document:click")
  hideDescription(): void {
    if (this.isShowDescription) {
      this.isShowDescription = false;
    }
  }
}
