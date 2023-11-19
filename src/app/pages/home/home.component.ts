import { UserService } from 'src/app/services/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface BaseUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
}

interface User {
  data: BaseUser;
}

interface AllUser {
  data: {
    [key: number]: BaseUser;
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent implements OnInit, OnDestroy {
  userProfile!: User;
  allUsers!: AllUser;
  allUsersArray: BaseUser[] = [];
  isAdmin: boolean = false;
  private subscriptions = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.subscriptions.add(
        this.userService.getUserById(userId).subscribe({
          next: (user: User) => {
            this.userProfile = user;
            this.isAdmin = user.data.isAdmin;

            if (this.isAdmin) {
              this.subscriptions.add(
                this.userService.getAllUsers().subscribe({
                  next: (users: AllUser) => {
                    this.allUsersArray = Object.values(users.data);
                  },
                  error: (err) =>
                    console.error('Error fetching all users:', err),
                })
              );
            }
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
          },
        })
      );
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
