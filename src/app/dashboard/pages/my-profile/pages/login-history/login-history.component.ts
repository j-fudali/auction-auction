import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { UserService } from 'src/app/core/http/user.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { LoginAttempt } from 'src/app/shared/interfaces/login-attempt';
import { map, tap } from 'rxjs/operators';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
  <div class="container" *ngIf="{isLtSm: (isLtSm$ | async)} as bp" [style.padding]="bp.isLtSm ? '10px 50px' : '10px 150px'">
    <div *ngIf="(dataSource$ | async) == null" class="spinner-wrapper">
      <mat-spinner color="accent"></mat-spinner>
    </div>
    <a routerLink="../" mat-icon-button><mat-icon>arrow_back</mat-icon></a>
    <table class="mat-elevation-z8" mat-table  [dataSource]="dataSource$" matSort (matSortChange)="onSortChange($event)">
      <ng-container matColumnDef="ipAddress">
        <th mat-header-cell *matHeaderCellDef>Ip address</th>
        <td mat-cell *matCellDef="let element"> {{element.ip_address}} </td>
      </ng-container>
      <ng-container matColumnDef="userAgent">
        <th mat-header-cell *matHeaderCellDef>User agent</th>
        <td mat-cell *matCellDef="let element"> {{element.user_agent}} </td>
      </ng-container>
      <ng-container matColumnDef="createdAt">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Login date</th>
        <td mat-cell *matCellDef="let element"> {{element.created_at + 'Z' | date}} </td>
      </ng-container>
      <ng-container matColumnDef="isSuccessful">
        <th mat-header-cell *matHeaderCellDef>Successful?</th>
        <td mat-cell *matCellDef="let element"> {{element.is_successful === 1 ? 'Yes' : 'No'}} </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="bp.isLtSm ? onSmallColumns : displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: (bp.isLtSm ? onSmallColumns : displayedColumns);"></tr>
    </table>
    <mat-paginator class="mat-elevation-z8" #paginator hidePageSize showFirstLastButtons (page)="onPageChange($event)" [length]="itemsCount" [pageSize]="10"></mat-paginator>
  </div>
  `,
  styles: [
    `.container{
      height: 100vh;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 5px
    }`,
    `table{
      width: 100%;
    }`,
    ]
})
export class LoginHistoryComponent implements OnInit{
  @ViewChild('paginator') paginator: MatPaginator;
  private userService = inject(UserService)
  private breakpoints = inject(BreakpointObserver)
  isLtSm$ = this.breakpoints.observe([Breakpoints.XSmall]).pipe(map( v => v.matches))
  dataSource$: Observable<LoginAttempt[]>;
  displayedColumns = ['ipAddress', 'userAgent', 'createdAt', 'isSuccessful'];
  onSmallColumns = ['ipAddress', 'createdAt', 'isSuccessful']
  itemsCount: number;
  sort: string | undefined;
  ngOnInit(): void {
    this.dataSource$ = this.userService.loginAttempts()
    .pipe(
      tap( res => {
        this.itemsCount = res.items_count
      }),
      map( res => res.result)
    )
  }
  onPageChange(page: PageEvent){
    this.dataSource$ = this.loadLoginAttempts(page.pageIndex + 1, this.sort)
  }
  onSortChange(sort: Sort){
    this.paginator.firstPage()
    switch(sort.direction){
      case 'asc':
        this.sort = 'neweset'
        this.dataSource$ = this.loadLoginAttempts(1, this.sort)
        break;
      case 'desc':
        this.sort = 'oldest'
        this.dataSource$ = this.loadLoginAttempts(undefined, this.sort)
        break;
      case '':
        this.sort = undefined
        this.dataSource$ = this.loadLoginAttempts(undefined, this.sort)
        break;
      default:
        this.sort = undefined
    }
  }
  loadLoginAttempts(page?: number, orderBy?: string){
    return this.userService.loginAttempts(page, orderBy)
    .pipe(
      tap( res => {
        this.itemsCount = res.items_count
      }),
      map( res => res.result)
    )
  }
}
