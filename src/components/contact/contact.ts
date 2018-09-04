import { Component, Input } from '@angular/core';

@Component({
  selector: 'contact',
  templateUrl: 'contact.html'
})
export class ContactComponent {

  @Input()
  name:string;
  @Input()
  location:string;
  @Input()
  tel:string;
  @Input()
  alt_tel?:string
  @Input()
  mail:string;
  @Input()
  consultation:string;
  @Input()
  consultation_url?:string;

  constructor() {
  }

}
