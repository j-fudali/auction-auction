import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { of, range, timer } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/core/http/user.service";

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./activate.component.html",
  styleUrls: ["./activate.component.scss"],
})
export class ActivateComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  timout = 5;
  isSuccessful: boolean;
  ngOnInit() {
    this.isSuccessful = false;
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const token = params.get("token")! as string;
          return this.userService.activateUser(token);
        })
      )
      .subscribe(() => {
        this.isSuccessful = true;
      });
    timer(1000, 1000)
      .pipe(
        map(() => (this.timout = this.timout - 1)),
        take(this.timout + 1)
      )
      .subscribe((i) => {
        if (i === 0) {
          this.router.navigate(["/home/login"]);
        }
      });
  }
}
