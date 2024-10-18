import { Component } from '@angular/core';
import { Menu } from './menu';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  menuItem: Menu[] = [
    {
      name: 'cappuchino',
      price: 35000,
      image: 'cappuchino.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: true,
    },
    {
      name: 'americano',
      price: 35000,
      image: 'americano.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: true,
    },
    {
      name: 'espresso',
      price: 35000,
      image: 'espresso.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: true,
    },
    {
      name: 'macchiato',
      price: 35000,
      image: 'macchiato.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: true,
    },
    {
      name: 'mocha',
      price: 35000,
      image: 'mocha.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: false,
    },
    {
      name: 'coffee latte',
      price: 35000,
      image: 'coffee-latte.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: false,
    },
    {
      name: 'black coffee',
      price: 35000,
      image: 'black-coffee.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: false,
    },
    {
      name: 'milk coffee',
      price: 35000,
      image: 'milk-coffee.webp',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, ullam.',
      show: false,
    },
  ];

  showAll() {
    this.menuItem.forEach((item) => {
      item.show = true;
    });
  }
}
