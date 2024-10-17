import { Component, AfterViewInit } from '@angular/core';
import { navList } from './nav-list';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit {
  navItems: navList[] = [
    {
      name: 'home',
      active: false,
      icon: 'fa-home',
    },
    { name: 'about', active: false, icon: 'fa-address-card' },
    { name: 'coffee', active: false, icon: 'fa-th-list' },
    { name: 'member', active: false, icon: 'fa-user-friends' },
    { name: 'contact', active: false, icon: 'fa-address-book' },
  ];
  setActive(item: navList) {
    this.navItems.forEach((navItem) => {
      navItem.active = navItem === item ? true : false;
    });
    this.scrollToSection(item.name);
  }
  scrollToSection(targetId: string) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error(`Element with id ${targetId} not found.`);
    }
  }
  ifoffCanvasOpen: boolean = false;
  ngAfterViewInit() {
    const offcanvasElement = document.getElementById('offcanvasNavbar');

    offcanvasElement?.addEventListener('shown.bs.offcanvas', () => {
      this.ifoffCanvasOpen = true;
    });

    offcanvasElement?.addEventListener('hidden.bs.offcanvas', () => {
      this.ifoffCanvasOpen = false;
      console.log('Offcanvas is closed');
    });
  }
}
