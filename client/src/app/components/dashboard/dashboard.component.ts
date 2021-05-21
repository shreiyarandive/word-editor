import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  createNewDocument() {
    localStorage.setItem('new-document', 'true');
    this.router.navigate([`user/${localStorage.getItem('id')}/documents/${uuidv4()}`]);
  }

  openDocument() {

  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

}
