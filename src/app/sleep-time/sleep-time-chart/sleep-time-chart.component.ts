import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { first } from 'rxjs/operators';

import { SleepTimeService } from '../shared/sleep-time.service';
import { SleepTimeChartRow } from '../shared/sleep-time-chart-row.model';
import { SleepTime } from '../shared/sleep-time.model';

declare var google: any;

@Component({
  selector: 'sl-sleep-time-chart',
  templateUrl: './sleep-time-chart.component.html',
  styleUrls: ['./sleep-time-chart.component.css']
})
export class SleepTimeChartComponent implements OnInit {
  sleepRows: SleepTimeChartRow;

  constructor(private sleepService: SleepTimeService, public angularFireAuth: AngularFireAuth) { }

  ngOnInit() {
    this.drawChart();
  }

  drawChart(): void {
    // this.sleepService.addTestSleep();
    this.angularFireAuth.authState.pipe(first()).subscribe(user => {
      this.sleepService.getSleepLog(user.uid)
        .pipe(untilDestroyed(this))
        .subscribe((sleepLog: SleepTime[]) => {
          const sleepChartRows = this.sleepService.getSleepChartRows(sleepLog);
          if (sleepChartRows.length === 0) {
            return;
          }

          google.charts.load('current', { packages: ['timeline'] });
          google.charts.setOnLoadCallback(drawChart);

          function drawChart() {
            const container = document.getElementById('sleep-time-chart');
            const chart = new google.visualization.Timeline(container);
            const dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'string', id: 'Date' });
            dataTable.addColumn({ type: 'string', id: 'State' });
            dataTable.addColumn({ type: 'date', id: 'Start' });
            dataTable.addColumn({ type: 'date', id: 'End' });
            dataTable.addRows(sleepChartRows);

            const options = {
              avoidOverlappingGridLines: false,
              colors: [
                '#69F0AE', // Awake
                '#7b1fa2', // Asleep
                '#f44336', // Crying
              ],
              timeline: {
                showBarLabels: false,
                rowLabelStyle: { color: '#fff' },
              },
              backgroundColor: '#303030',
            };

            google.visualization.events.addListener(chart, 'ready', function () {
              const labels = container.getElementsByTagName('text');
              Array.prototype.forEach.call(labels, function(label) {
                if (label.getAttribute('text-anchor') === 'middle') {
                  label.setAttribute('fill', '#ffffff');
                }
              });
            });

            chart.draw(dataTable, options);
          }
        });
    });
  }
}