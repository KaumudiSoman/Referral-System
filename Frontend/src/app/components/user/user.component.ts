import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any = [];

  constructor(
    private userService: UserService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
        console.log(this.users);
      },
      error: (err) => {this.toastrService.error(err.message)}
    })
  }
}
