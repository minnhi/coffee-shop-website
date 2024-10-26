import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  // Member variables
  menuItems: any[] = [];
  filteredItems: any[] = [];
  selectedValue: string = '';
  selectedItem: any = null;
  cartItems: any[] = [];
  cartCount: number = 0;

  isCartModalOpen: boolean = false;
  isCheckoutModalOpen: boolean = false;
  isCartEmpty: boolean = false;
  isSuccessModalOpen: boolean = false;

  // Custom order information
  sugarLevel: string = 'normal';
  iceLevel: string = 'normal';
  modalQuantity: number = 1;
  orderNotes: string = '';
  totalPrice: number = 0;
  showNotes: boolean = false;

  // Customer payment details
  serviceType: string = 'dineIn';
  customerName: string = '';
  customerPhone: string = '';
  deliveryAddress: string = '';
  paymentMethod: string = 'cash';
  queueNumber: number = 0;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenu().subscribe((data) => {
      this.menuItems = data;
      this.applyFilter();
    });

    // this.loadCartFromSessionStorage();
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.customerName = user.fullname || ''; // Gán fullname nếu có
      this.customerPhone = user.phonenumber || ''; // Gán số điện thoại nếu có
      // Có thể gán deliveryAddress nếu cần, tuy nhiên, thông tin này có thể không có trong userDetails
    }
  }

  loadCartFromSessionStorage(): void {
    const username = sessionStorage.getItem('username');
    if (username) {
      const storedCart = sessionStorage.getItem(`cart_${username}`);
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        this.updateCartCount();
        this.calculateTotalPrice();
      }
    }
  }

  // Logic for filtering menu items
  applyFilter(mainGroup: string = 'all', subGroup?: string): void {
    const filterValue = this.selectedValue || mainGroup;
    this.filteredItems = this.menuItems.filter((item) => {
      const matchesMainGroup =
        filterValue === 'all' || item.main_group === filterValue;
      const matchesSubGroup = subGroup ? item.sub_group === subGroup : true;
      return matchesMainGroup && matchesSubGroup;
    });
  }

  // Modal management
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

  increaseModalQuantity(): void {
    this.modalQuantity += 1;
  }

  decreaseModalQuantity(): void {
    if (this.modalQuantity > 1) {
      this.modalQuantity -= 1;
    }
  }

  // Cart management
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
      this.saveCartToSessionStorage(); // Save cart to sessionStorage
      this.modalQuantity = 1;
    }
  }

  increaseQuantity(item: any): void {
    item.quantity += 1;
    this.updateCartCount();
    this.calculateTotalPrice();
    this.saveCartToSessionStorage(); // Update sessionStorage
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cartItems = this.cartItems.filter((cartItem) => cartItem !== item);
    }
    this.updateCartCount();
    this.calculateTotalPrice();
    this.saveCartToSessionStorage(); // Update sessionStorage
  }

  updateCartCount(): void {
    this.cartCount = this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    ); // Cập nhật số lượng giỏ hàng
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ); // Tính toán tổng giá trị giỏ hàng
  }

  saveCartToSessionStorage(): void {
    const username = sessionStorage.getItem('username');
    if (username) {
      sessionStorage.setItem(
        `cart_${username}`,
        JSON.stringify(this.cartItems)
      );
    }
  }

  toggleCartModal(): void {
    this.isCartModalOpen = !this.isCartModalOpen; // Đảo ngược trạng thái modal giỏ hàng
  }

  checkout(): void {
    const username = sessionStorage.getItem('username'); // Lấy thông tin người dùng từ sessionStorage
    if (!username) {
      alert('You need to log in to proceed with checkout.'); // Thông báo nếu người dùng chưa đăng nhập
      return; // Ngừng thực hiện hàm nếu chưa đăng nhập
    }

    if (this.cartItems.length === 0) {
      alert('Your cart is currently empty!'); // Thông báo nếu giỏ hàng trống
      return; // Ngừng thực hiện hàm nếu giỏ hàng trống
    }

    // Mở modal thanh toán ở đây
    this.isCheckoutModalOpen = true; // Đặt trạng thái modal thanh toán là true để mở modal
    this.toggleCartModal(); // Đóng modal giỏ hàng
  }

  toggleCheckoutModal(): void {
    this.isCartEmpty = this.cartItems.length === 0;
    this.isCheckoutModalOpen = !this.isCheckoutModalOpen;
  }

  confirmOrder(): void {
    if (this.validateOrderDetails()) {
      this.queueNumber = Math.floor(Math.random() * 101); // Random queue number from 0-100
      this.isCheckoutModalOpen = false;
      this.isSuccessModalOpen = true;
    } else {
      alert('Please fill in all necessary information.');
    }
  }

  validateOrderDetails(): boolean {
    if (!this.customerName || !this.customerPhone) return false;
    if (this.serviceType === 'delivery' && !this.deliveryAddress) return false;
    return true;
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
