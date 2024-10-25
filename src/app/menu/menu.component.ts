import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service'; // Assume MenuService is your service for fetching menu data

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  menuItems: any[] = []; // Dữ liệu menu ban đầu
  filteredItems: any[] = []; // Dữ liệu sau khi lọc
  selectedValue: string = ''; // Giá trị được chọn từ dropdown
  selectedItem: any = null; // Item được chọn để hiển thị trong modal

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenu().subscribe((data) => {
      this.menuItems = data;
      this.filteredItems = data; // Hiển thị tất cả dữ liệu ban đầu
    });
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.selectedValue = value;

    if (value === '') {
      this.filteredItems = this.menuItems;
    } else {
      this.filteredItems = this.menuItems.filter((item) =>
        item.id.startsWith(value)
      );
    }
  }

  filterByGroup(mainGroup: string, subGroup?: string): void {
    if (mainGroup === 'all') {
      this.filteredItems = this.menuItems;
    } else if (subGroup) {
      this.filteredItems = this.menuItems.filter(
        (item) => item.main_group === mainGroup && item.sub_group === subGroup
      );
    } else {
      this.filteredItems = this.menuItems.filter(
        (item) => item.main_group === mainGroup
      );
    }
  }

  openModal(item: any): void {
    this.selectedItem = item;
  }
}
