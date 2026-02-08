import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptedPrivacy = false;
  isLoading = false;
  signupSuccess = false;

  constructor(private router: Router) {}

  signup(): void {
    if (!this.acceptedPrivacy) return; 

    this.isLoading = true;
    this.signupSuccess = false;

  
    setTimeout(() => {
      this.isLoading = false;
      this.signupSuccess = true;


      setTimeout(() => this.router.navigate(['/login']), 2000);
    }, 800);
  }
}
