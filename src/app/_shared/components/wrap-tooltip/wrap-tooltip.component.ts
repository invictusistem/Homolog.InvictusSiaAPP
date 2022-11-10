import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrap-tooltip',
  templateUrl: './wrap-tooltip.component.html',
  styleUrls: ['./wrap-tooltip.component.scss']
})
export class WrapTooltipComponent implements OnInit {

  @Input() mensagem: string = ''
  
  constructor() { }

  ngOnInit(): void {
  }

}
