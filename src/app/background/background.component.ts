import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../shared/services/config.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  public useScene = this.configService.getConfig().useScene;

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
  }


}
