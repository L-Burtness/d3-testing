import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  selectedChart: string = "bar";

  showBarChart() {
    this.selectedChart = "bar";
  }

  showLineChart() {
    this.selectedChart = "line";
  }

}
