import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  // Các biến thành viên
  menuItems: any[] = []; // Danh sách các món ăn
  filteredItems: any[] = []; // Danh sách các món ăn sau khi lọc
  selectedValue: string = ''; // Giá trị lọc đã chọn
  selectedItem: any = null; // Món ăn được chọn trong Modal
  cartItems: any[] = []; // Danh sách các món trong giỏ hàng
  cartCount: number = 0; // Số lượng món trong giỏ hàng

  isCartModalOpen: boolean = false; // Trạng thái mở/đóng của Modal giỏ hàng
  isCheckoutModalOpen: boolean = false; // Trạng thái mở/đóng của Modal thanh toán
  isCartEmpty: boolean = false; // Trạng thái giỏ hàng rỗng
  isSuccessModalOpen: boolean = false; // Trạng thái mở/đóng của Modal thành công

  // Thông tin đơn hàng tùy chỉnh
  sugarLevel: string = 'normal'; // Mức độ đường
  iceLevel: string = 'normal'; // Mức độ đá
  modalQuantity: number = 1; // Số lượng món
  orderNotes: string = ''; // Ghi chú đơn hàng
  totalPrice: number = 0; // Tổng giá tiền
  showNotes: boolean = false; // Hiển thị ghi chú

  // Thông tin khách hàng
  serviceType: string = 'dineIn'; // Loại hình dịch vụ (ăn tại chỗ, giao hàng)
  customerName: string = ''; // Tên khách hàng
  customerPhone: string = ''; // Số điện thoại khách hàng
  deliveryAddress: string = ''; // Địa chỉ giao hàng
  paymentMethod: string = 'cash'; // Phương thức thanh toán
  queueNumber: number = 0; // Số thứ tự đơn hàng

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    // Lấy danh sách menu từ service khi khởi tạo
    this.menuService.getMenu().subscribe((data) => {
      this.menuItems = data;
      this.applyFilter();
    });

    // Lấy thông tin người dùng từ sessionStorage
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.customerName = user.fullname || '';
      this.customerPhone = user.username || '';
    }

    // Tải giỏ hàng từ sessionStorage
    this.loadCartFromSessionStorage();
  }

  // Tải giỏ hàng từ sessionStorage
  loadCartFromSessionStorage(): void {
    const username = sessionStorage.getItem('username');
    if (username) {
      const storedCart = sessionStorage.getItem(`cart_${username}`);
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
      } else {
        this.loadTemporaryCart();
      }
    } else {
      this.loadTemporaryCart();
    }
    this.updateCartCount();
    this.calculateTotalPrice();
  }

  loadTemporaryCart(): void {
    const tempCart = sessionStorage.getItem('temp_cart');
    if (tempCart) {
      this.cartItems = JSON.parse(tempCart);
    }
  }

  saveCartToSessionStorage(): void {
    const username = sessionStorage.getItem('username');
    if (username) {
      sessionStorage.setItem(
        `cart_${username}`,
        JSON.stringify(this.cartItems)
      );
      sessionStorage.removeItem('temp_cart');
    } else {
      sessionStorage.setItem('temp_cart', JSON.stringify(this.cartItems));
    }
  }

  // Áp dụng bộ lọc cho menu
  applyFilter(mainGroup: string = 'all', subGroup?: string): void {
    const filterValue = this.selectedValue || mainGroup;
    this.filteredItems = this.menuItems.filter((item) => {
      const matchesMainGroup =
        filterValue === 'all' || item.main_group === filterValue;
      const matchesSubGroup = subGroup ? item.sub_group === subGroup : true;
      return matchesMainGroup && matchesSubGroup;
    });
  }

  // Quản lý Modal
  openModal(item: any): void {
    this.selectedItem = item;
    this.sugarLevel = 'normal';
    this.iceLevel = 'normal';
    this.modalQuantity = 1;
  }

  setSugarLevel(level: string): void {
    this.sugarLevel = level;
  }

  setIceLevel(level: string): void {
    this.iceLevel = level;
  }

  // Tăng/Giảm số lượng trong Modal
  increaseModalQuantity() {
    if (this.modalQuantity < 99) {
      this.modalQuantity++;
    }
  }

  decreaseModalQuantity() {
    if (this.modalQuantity > 1) {
      this.modalQuantity--;
    }
  }

  // Quản lý giỏ hàng
  addToCart(): void {
    if (this.selectedItem) {
      const existingItem = this.cartItems.find(
        (item) =>
          item.name === this.selectedItem.name &&
          item.sugarLevel === this.sugarLevel &&
          item.iceLevel === this.iceLevel
      );

      if (existingItem) {
        existingItem.quantity += this.modalQuantity;
      } else {
        const itemToAdd = {
          ...this.selectedItem,
          sugarLevel: this.sugarLevel,
          iceLevel: this.iceLevel,
          quantity: this.modalQuantity,
        };
        this.cartItems.push(itemToAdd);
      }

      this.updateCartCount();
      this.calculateTotalPrice();
      this.saveCartToSessionStorage();
      this.modalQuantity = 1;
    }
  }

  increaseQuantity(item: any): void {
    item.quantity += 1;
    this.updateCartCount();
    this.calculateTotalPrice();
    this.saveCartToSessionStorage();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cartItems = this.cartItems.filter((cartItem) => cartItem !== item);
    }
    this.updateCartCount();
    this.calculateTotalPrice();
    this.saveCartToSessionStorage();
  }

  updateCartCount(): void {
    this.cartCount = this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  toggleCartModal(): void {
    this.isCartModalOpen = !this.isCartModalOpen;
  }

  checkout(): void {
    const username = sessionStorage.getItem('username');
    if (!username) {
      alert('You need to log in to proceed with checkout.');
      this.isCartModalOpen = false;
      return;
    }

    if (this.cartItems.length === 0) {
      this.isCartModalOpen = false;
      return;
    }

    this.isCheckoutModalOpen = true;
    this.toggleCartModal();
  }

  toggleCheckoutModal(): void {
    this.isCartEmpty = this.cartItems.length === 0;
    this.isCheckoutModalOpen = !this.isCheckoutModalOpen;
  }

  confirmOrder(): void {
    if (this.validateOrderDetails()) {
      this.queueNumber = Math.floor(Math.random() * 101);
      this.isCheckoutModalOpen = false;
      this.isSuccessModalOpen = true;

      // Tích lũy điểm cho người dùng
      this.accumulatePoints();

      // Xóa giỏ hàng sau khi thanh toán thành công
      this.cartItems = [];
      this.cartCount = 0;
      this.totalPrice = 0;
      this.clearCartFromSessionStorage();
    } else {
      alert('Please fill in all necessary information.');
    }
  }

  accumulatePoints(): void {
    const pointsToAdd = Math.floor(this.totalPrice / 1000);

    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);

      user.accumulatedPoints = (user.accumulatedPoints || 0) + pointsToAdd;

      if (user.accumulatedPoints >= 100) {
        user.membershipLevel = 'Gold';
      } else if (user.accumulatedPoints >= 50) {
        user.membershipLevel = 'Silver';
      } else {
        user.membershipLevel = 'Basic';
      }

      sessionStorage.setItem('userDetails', JSON.stringify(user));
    }
  }

  validateOrderDetails(): boolean {
    if (!this.customerName || !this.customerPhone) return false;
    if (this.serviceType === 'delivery' && !this.deliveryAddress) return false;
    return true;
  }

  clearCartFromSessionStorage(): void {
    const username = sessionStorage.getItem('username');
    if (username) {
      sessionStorage.removeItem(`cart_${username}`);
    } else {
      sessionStorage.removeItem('temp_cart');
    }
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
    this.resetOrderForm();
  }

  resetOrderForm(): void {
    this.customerName = '';
    this.customerPhone = '';
    this.deliveryAddress = '';
    this.paymentMethod = 'cash';
    this.serviceType = 'dineIn';
    this.queueNumber = 0;
  }

  onQuantityInputChange(): void {
    if (this.modalQuantity < 1) {
      this.modalQuantity = 1;
    }
  }
}
