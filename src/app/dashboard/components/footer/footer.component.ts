import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer><h2>Auction Auction</h2></footer>
  `,
  styles: [`
    footer{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `
  ]
})
export class FooterComponent {

}
