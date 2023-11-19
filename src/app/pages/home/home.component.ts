import { UserService } from 'src/app/services/user/user.service';
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
  authService = inject(UserService);
  userProfile: any;
  allUsers!: any[];
  isAdmin: boolean = false;

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getUserById(userId).subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.isAdmin = profile.data.isAdmin;

          if (this.isAdmin) {
            this.authService.getAllUsers().subscribe({
              next: (response: any) => {
                this.allUsers = response.data;
              },
              error: (err) => console.error('Error fetching all users:', err),
            });
          }
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
        },
      });
    }
  }
}
