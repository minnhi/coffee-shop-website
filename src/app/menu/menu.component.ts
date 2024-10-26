import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];
  filteredItems: any[] = [];
  selectedValue: string = '';
  selectedItem: any = null;
  cartItems: any[] = [];
  cartCount: number = 0;
  isCartModalOpen: boolean = false;
  isCheckoutModalOpen: boolean = false;
  isSuccessModalOpen: boolean = false;

  // Properties for sugar, ice levels, and quantity
  sugarLevel: string = 'normal';
  iceLevel: string = 'normal';
  modalQuantity: number = 1;
  orderNotes: string = '';
  totalPrice: number = 0;

  // New properties for checkout details
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
  }

  applyFilter(mainGroup: string = 'all', subGroup?: string): void {
    const filterValue = this.selectedValue || mainGroup;
    this.filteredItems = this.menuItems.filter((item) => {
      const matchesMainGroup =
        filterValue === 'all' || item.main_group === filterValue;
      const matchesSubGroup = subGroup ? item.sub_group === subGroup : true;
      return matchesMainGroup && matchesSubGroup;
    });
  }

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
      this.modalQuantity = 1;
    }
  }

  increaseQuantity(item: any): void {
    item.quantity += 1;
    this.updateCartCount();
    this.calculateTotalPrice();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cartItems = this.cartItems.filter((cartItem) => cartItem !== item);
    }
    this.updateCartCount();
    this.calculateTotalPrice();
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
    if (this.cartItems.length === 0) {
      alert(
        'Your cart is empty. Please add items to the cart before proceeding to checkout.'
      );
      return; // Prevent opening the checkout modal if cart is empty
    }

    this.toggleCartModal();
    this.isCheckoutModalOpen = true;
  }

  toggleCheckoutModal(): void {
    this.isCheckoutModalOpen = !this.isCheckoutModalOpen;
  }

  confirmOrder(): void {
    if (this.validateOrderDetails()) {
      this.queueNumber = Math.floor(Math.random() * 101); // Random queue number from 0-100
      this.isCheckoutModalOpen = false;
      this.isSuccessModalOpen = true;
    } else {
      alert('Please fill in all required information.');
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
