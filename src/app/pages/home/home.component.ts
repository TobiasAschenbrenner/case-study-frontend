import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent implements OnInit {
  authService = inject(AuthService);
  userProfile: any;

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getUserById(userId).subscribe({
        next: (profile) => {
          console.log(profile);
          this.userProfile = profile;
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
        },
      });
    }
  }
}
