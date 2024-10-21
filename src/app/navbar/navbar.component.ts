import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { navList } from './nav-list';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  navItems: navList[] = [
    { name: 'home', active: false },
    { name: 'about', active: false },
    { name: 'product', active: false },
    { name: 'contact', active: false },
    { name: 'member', active: false },
  ];

  ifOpen = false;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  toggleOpen() {
    this.ifOpen = !this.ifOpen;
  }

  setActive(item: navList) {
    this.navItems.forEach((navItem) => (navItem.active = navItem === item));
    this.router.navigate([], { fragment: item.name });
    this.viewportScroller.scrollToAnchor(item.name);
  }
}
