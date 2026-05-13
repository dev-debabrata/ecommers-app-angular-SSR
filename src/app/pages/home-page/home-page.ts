import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hero } from '../../components/hero/hero';

import { Mobiles } from '../../components/categories/electronics/mobiles/mobiles';
import { Discount } from '../../components/categories/discount/discount';
import { MoreItems } from '../../components/categories/more-items/more-items';
import { TodayDeals } from '../../components/categories/today-deals/today-deals';
import { SmartWatches } from '../../components/categories/electronics/smart-watches/smart-watches';
import { Laptops } from '../../components/categories/electronics/laptops/laptops';
import { Footwear } from '../../components/categories/footwear/footwear';
import { Headphones } from '../../components/categories/electronics/headphones/headphones';
import { Trending } from '../../components/categories/trending/trending';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    TruncatePipe,
    Hero,
    Mobiles,
    Discount,
    MoreItems,
    TodayDeals,
    SmartWatches,
    Laptops,
    Footwear,
    Headphones,
    Trending,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
