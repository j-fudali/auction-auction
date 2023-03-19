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
  @use '../../../../styles' as styles;
    footer{
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 10vh;
      background-color: styles.$primary-600;
      color: #fff;
    }
  `
  ]
})
export class FooterComponent {

}
