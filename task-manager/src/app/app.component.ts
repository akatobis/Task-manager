import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { MyTask } from 'src/app/types';
import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  tasks: MyTask[] = [];

  ngOnInit(): void {
    this.tasks = localStorage.getItem('task') ? JSON.parse(localStorage.getItem('task')!) : [];
  }

  isEdit: boolean = false;

  getStrTodayDate(): string {
    return new Date().toISOString().slice(0, 16);
  }

  nullableTask(): MyTask {
    return {
      id: '',
      title: '',
      description: '',
      endDate: this.getStrTodayDate(),
    }
  }

  task: MyTask = this.nullableTask();

  validateAddTask(titleTask: any): boolean {
    if (!titleTask.value) {
      titleTask.style.borderColor = 'red';
      return false;
    }
    titleTask.style.borderColor = '#7b68ee';
    return true;
  }

  addTask(titleTask: any): void {
    if(!this.validateAddTask(titleTask)) {
      return;
    }

    this.task.id = uuidv4();
    this.tasks.push(this.task);

    this.task = this.nullableTask();

    localStorage.setItem('task', JSON.stringify(this.tasks));
  }

  uploadJSONFile(fileReader: FileReader): void {
    if (!fileReader.result) {
      return;
    }
    this.tasks = (JSON.parse(fileReader.result.toString()));
    localStorage.setItem('task', fileReader.result.toString());
  }

  getElemFromXml(xmlDoc: any, elem: string, num: number): string {
    return xmlDoc.getElementsByTagName(elem)[num].childNodes[0] ? xmlDoc.getElementsByTagName(elem)[num].childNodes[0].nodeValue : '';
  }

  uploadXMLFile(fileReader: any): void {
    const strXMLFile = fileReader.result.toString();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(strXMLFile, "application/xml");

    const errorNode = xmlDoc.querySelector("parsererror");
    if (errorNode) {
      this.innerStringAddFile = 'Ошибка обработки файла';
    }

    const tasks = xmlDoc.getElementsByTagName('task');
    this.tasks = [];
    for (let i = 0; i < tasks.length; i++) {
      const task: MyTask = {
        id: this.getElemFromXml(xmlDoc, 'id', i),
        title: this.getElemFromXml(xmlDoc, 'title', i),
        description: this.getElemFromXml(xmlDoc, 'description', i),
        endDate: this.getElemFromXml(xmlDoc, 'endDate', i),
      }
      this.tasks.push(task);
    }

    localStorage.setItem('task', JSON.stringify(this.tasks));
  }

  innerStringAddFile: string = 'Загрузить задачи из файла';

  uploadFile(event: any): void {
    const selectedFile = event.target.files[0];
    const typeSelectedFile = selectedFile.type;
    const extensionSelectedFile = typeSelectedFile.split('/').pop();

    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, 'UTF-8');

    fileReader.onload = () => {
      if (!fileReader.result) {
        this.innerStringAddFile = 'Ошибка обработки файла';
        return;
      }
      if (extensionSelectedFile === 'json') {
        this.uploadJSONFile(fileReader);
        return;
      }
      if (extensionSelectedFile === 'xml') {
        this.uploadXMLFile(fileReader);
        return;
      }
      this.innerStringAddFile = 'Не правильное расширение файла';
    }

    fileReader.onerror = () => {
      this.innerStringAddFile = 'Не удалось открыть файл';
    }

    this.innerStringAddFile = selectedFile.name;
  }

  finishEdit(): void {
    this.isEdit = false;
    this.task = this.nullableTask();
  }

  onComlete(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id != taskId);

    localStorage.setItem('task', JSON.stringify(this.tasks));
  }

  onEdit(taskId: string): void {
    this.isEdit = true;
    const task = this.tasks.find(task => task.id = taskId);
    if (task !== undefined) {
      this.task = task;
      this.task.endDate = task.endDate.slice(0, 16); // чтобы дата отображалось в input
    }
    window.scrollTo(0, 0);
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}
