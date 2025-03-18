import { Component, signal } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-calculations',
  imports: [NavBarComponent],
  templateUrl: './calculations.component.html',
  styleUrl: './calculations.component.scss'
})
export class CalculationsComponent {
  const = signal(0);

  add(a: number, b: number) {
    return a + b;
  }

  changeConst() {
    this.const.update(value => value + 1);
  }
}
