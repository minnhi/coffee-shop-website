import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { UserService } from './users.service'; // Cập nhật đường dẫn nếu cần
import { navList } from './nav-list';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // Navigation list
  navItems: navList[] = [
    { name: 'home', active: false },
    { name: 'about', active: false },
    { name: 'product', active: false },
    { name: 'contact', active: false },
    { name: 'member', active: false },
  ];

  // User list
  users: any[] = [];
  loggedInUser: any;

  // Modal control variables
  isLoginModalOpen = false;
  isRegisterModalOpen = false;

  // Member modal control variable
  isMemberModalOpen: boolean = false; // Thay đổi tên biến từ isMemberOffcanvasOpen thành isMemberModalOpen

  // Login information
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // Login error message
  isLoggedIn: boolean = false; // Login status

  // Registration information
  registerFullname: string = ''; // Registration fullname
  registerPhone: string = ''; // Registration phone number
  registerPassword: string = ''; // Registration password
  registerErrorMessage: string | null = null; // Registration error message
  successMessage: string | null = null; // Registration success message

  // Other control variables
  ifOpen = false; // Can be used for other purposes if needed

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers(); // Load user list
    this.checkLoggedInUser(); // Check logged-in user
  }

  // Load user list from service
  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data; // Update user list
    });
  }

  // Check if the user is logged in from sessionStorage
  checkLoggedInUser() {
    const userDetails = sessionStorage.getItem('userDetails'); // Lấy thông tin chi tiết người dùng
    if (userDetails) {
      this.loggedInUser = JSON.parse(userDetails); // Giải mã thông tin người dùng
      this.isLoggedIn = true; // Cập nhật trạng thái đăng nhập
    }
  }

  // Method to open the member modal
  openMemberModal() {
    this.isMemberModalOpen = true; // Thay đổi từ openMemberOffcanvas sang openMemberModal
  }

  // Method to close the member modal
  closeMemberModal() {
    this.isMemberModalOpen = false; // Thay đổi từ closeMemberOffcanvas sang closeMemberModal
  }

  // Method to control the modal
  toggleOpen() {
    this.ifOpen = !this.ifOpen;
  }

  openLoginModal() {
    this.isLoginModalOpen = true;
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
    this.username = '';
    this.password = ''; // Clear input fields on close
    this.errorMessage = ''; // Reset error message when closing
    this.successMessage = ''; // Reset success message when closing
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true; // Open registration modal
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false; // Close registration modal
    this.registerFullname = ''; // Clear fullname
    this.registerPhone = ''; // Clear phone number
    this.registerPassword = ''; // Clear password
    this.registerErrorMessage = ''; // Clear error message
  }

  // Login method
  login() {
    const user = this.users.find((u) => u.username === this.username);

    if (!user) {
      this.errorMessage = 'Incorrect username!'; // Message if username is not found
      this.successMessage = ''; // Reset success message
    } else if (user.password !== this.password) {
      this.errorMessage = 'Incorrect password!'; // Message if password is incorrect
      this.successMessage = ''; // Reset success message
    } else {
      this.successMessage = 'Login successful!'; // Success message
      this.errorMessage = ''; // Reset error message

      // Save username and user details to sessionStorage
      sessionStorage.setItem('username', this.username);
      sessionStorage.setItem('userDetails', JSON.stringify(user)); // Lưu thông tin chi tiết của người dùng
      console.log(user);

      this.isLoggedIn = true; // Update login status
      this.loggedInUser = user; // Save logged-in user information

      this.closeLoginModal(); // Close modal after successful login
    }
  }

  // Registration method
  register() {
    const userExists = this.users.some(
      (u) => u.phonenumber === this.registerPhone // Check phone number
    );

    if (userExists) {
      this.registerErrorMessage = 'Phone number already exists!'; // Message if phone number already exists
      this.successMessage = ''; // Reset success message
    } else {
      // Create a new user object with the provided information
      const newUser = {
        username: this.registerPhone, // Use phone number as username
        password: this.registerPassword,
        membershipCard: this.registerPhone, // Phone number as membershipCard
        fullname: this.registerFullname || '-', // Full name
        accumulatedPoints: 0, // Accumulated points
        membershipLevel: 'Basic', // Default membership level
        pointsAccumulationProgress: 0, // Points accumulation progress
      };

      // Add the new user to the users array
      this.users.push(newUser);

      // Save user information to sessionStorage
      sessionStorage.setItem('username', newUser.username);
      sessionStorage.setItem('userDetails', JSON.stringify(newUser)); // Save detailed user information

      this.successMessage = 'Registration successful!'; // Success message
      this.registerErrorMessage = ''; // Reset error message
      this.closeRegisterModal(); // Close modal after successful registration

      // Open login modal after successful registration
      this.openLoginModal();

      // Mark user as logged in
      this.isLoggedIn = true;
      this.loggedInUser = newUser; // Update logged-in user information
    }
  }

  // Logout method
  logout() {
    // Xóa thông tin đăng nhập
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userDetails'); // Xóa thông tin chi tiết người dùng
    this.isLoggedIn = false; // Cập nhật trạng thái đăng nhập
    this.loggedInUser = null; // Xóa thông tin người dùng đã đăng nhập
  }

  // Navigation and scroll to section method
  setActive(item: navList) {
    this.navItems.forEach((navItem) => (navItem.active = navItem === item));
    this.router.navigate([], { fragment: item.name });
    this.viewportScroller.scrollToAnchor(item.name);

    if (item.name === 'member') {
      this.openMemberModal(); // Thay đổi từ openMemberOffcanvas thành openMemberModal
    }
  }
}
