export interface MenuItem {
  name: string;
  hasArrow?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MENU: MenuSection[] = [
  {
    title: 'Trending',
    items: [{ name: 'Best Sellers' }, { name: 'New Releases' }, { name: 'Movers and Shakers' }],
  },
  {
    title: 'Digital Content And Devices',
    items: [
      { name: 'Echo & Alexa', hasArrow: true },
      { name: 'Fire TV', hasArrow: true },
      { name: 'Kindle E-Readers & eBooks', hasArrow: true },
      { name: 'Audible Audiobooks', hasArrow: true },
      { name: 'Amazon Prime Video', hasArrow: true },
      { name: 'Amazon Prime Music', hasArrow: true },
    ],
  },
  {
    title: 'Shop By Category',
    items: [
      { name: 'Mobiles, Computers', hasArrow: true },
      { name: 'TV, Appliances, Electronics', hasArrow: true },
      { name: "Men's Fashion", hasArrow: true },
      { name: "Women's Fashion", hasArrow: true },
    ],
  },
];
