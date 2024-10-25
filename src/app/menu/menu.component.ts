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
  cartItems: any[] = []; // Các sản phẩm trong giỏ hàng
  cartCount: number = 0; // Số lượng sản phẩm trong giỏ hàng
  isCartModalOpen: boolean = false; // Trạng thái hiển thị giỏ hàng

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    // Lấy dữ liệu từ file JSON thông qua MenuService
    this.menuService.getMenu().subscribe((data) => {
      this.menuItems = data;
      this.applyFilter(); // Thiết lập filteredItems ban đầu
    });
  }

  applyFilter(mainGroup: string = 'all', subGroup?: string): void {
    const filterValue = this.selectedValue || mainGroup;

    // Lọc dữ liệu dựa trên mainGroup và subGroup nếu có
    this.filteredItems = this.menuItems.filter((item) => {
      const matchesMainGroup =
        filterValue === 'all' || item.main_group === filterValue;
      const matchesSubGroup = subGroup ? item.sub_group === subGroup : true;
      return matchesMainGroup && matchesSubGroup;
    });
  }

  openModal(item: any): void {
    this.selectedItem = item;
  }

  addToCart(): void {
    if (this.selectedItem) {
      this.cartItems.push({ ...this.selectedItem });
      this.cartCount = this.cartItems.length;
    }
  }

  toggleCartModal(): void {
    this.isCartModalOpen = !this.isCartModalOpen;
  }
}
