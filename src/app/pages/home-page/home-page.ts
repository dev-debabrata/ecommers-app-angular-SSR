import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hero } from '../../components/hero/hero';

import { Mobiles } from '../../components/categories/electronics/mobiles/mobiles';
import { Discount } from '../../components/categories/discount/discount';
import { MoreItems } from '../../components/categories/more-items/more-items';
import { TodayDeals } from '../../components/categories/today-deals/today-deals';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, Hero, Mobiles, Discount, MoreItems, TodayDeals],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
