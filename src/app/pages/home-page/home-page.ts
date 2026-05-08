import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hero } from '../../components/hero/hero';
import { MoreItems } from '../../components/home-products/more-items/more-items';

import { Discount } from '../../components/home-products/discount/discount';
import { TodayDeals } from '../../components/home-products/today-deals/today-deals';
import { Mobiles } from '../../components/categories/electronics/mobiles/mobiles';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, Hero, MoreItems, Discount, TodayDeals, Mobiles],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
