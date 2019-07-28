import { Component, OnInit } from "@angular/core";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"]
})
export class HeroesComponent implements OnInit {
  constructor(private heroService: HeroService) {}

  heroes: Hero[];

  ngOnInit() {
    this.getHeroes();
  }

  add(name: string) {
    this.heroService.createHero(name).subscribe(hero => {
      this.heroes.push(hero);
    });
  }

  delete(id: number) {
    this.heroService.deleteHero(id).subscribe(() => {
      this.heroes = this.heroes.filter(h => h.id !== id);
    });
  }

  getHeroes() {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
    });
  }
}
