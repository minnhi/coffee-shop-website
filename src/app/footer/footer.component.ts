import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  subscribeForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    // Khởi tạo form với FormBuilder
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Hàm xử lý khi người dùng nhấn nút "Subscribe"
  onSubmit(): void {
    this.submitted = true;

    if (this.subscribeForm.valid) {
      const email = this.subscribeForm.value.email;
      console.log('Email đã được gửi:', email);
      alert('Cảm ơn bạn đã đăng ký nhận tin tức!');
      this.subscribeForm.reset();
      this.submitted = false;
    } else {
      alert('Vui lòng nhập một địa chỉ email hợp lệ.');
    }
  }
}
