import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AuthUser } from '@core/services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  currentUser: AuthUser | null = null;
  returnUrl = '/inicio';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Get return URL from route parameters or default to home
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/inicio';

    // Initialize login form
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        console.log('Login successful:', user);

        // Check if user is admin and redirect accordingly
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
