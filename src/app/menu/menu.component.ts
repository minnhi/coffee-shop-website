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

    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);
      this.customerName = user.fullname || '';
      this.customerPhone = user.username || '';
    }

    this.loadCartFromSessionStorage();
  }

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

      // Accumulate points for the user
      this.accumulatePoints();

      // Clear the cart after successful checkout
      this.cartItems = [];
      this.cartCount = 0;
      this.totalPrice = 0;
      this.clearCartFromSessionStorage();
    } else {
      alert('Please fill in all necessary information.');
    }
  }

  accumulatePoints(): void {
    // Calculate points based on total price (1 point per 1000)
    const pointsToAdd = Math.floor(this.totalPrice / 1000);

    // Get current user details from sessionStorage
    const userDetails = sessionStorage.getItem('userDetails');
    if (userDetails) {
      const user = JSON.parse(userDetails);

      // Update accumulated points
      user.accumulatedPoints = (user.accumulatedPoints || 0) + pointsToAdd;

      // Update membership level based on accumulated points
      if (user.accumulatedPoints >= 100) {
        user.membershipLevel = 'Gold';
      } else if (user.accumulatedPoints >= 50) {
        user.membershipLevel = 'Silver';
      } else {
        user.membershipLevel = 'Basic';
      }

      // Save updated user details back to sessionStorage
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
