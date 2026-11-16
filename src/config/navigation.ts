export interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
  children?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Shop",
    href: "/shop",
    hasDropdown: true,
    children: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "On Sale", href: "/sale" },
      { label: "Casual", href: "/shop?category=casual" },
      { label: "Formal", href: "/shop?category=formal" },
      { label: "Party", href: "/shop?category=party" },
      { label: "Gym", href: "/shop?category=gym" },
    ],
  },
  { label: "On Sale", href: "/sale" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Brands", href: "/brands" },
];

export const FOOTER_LINKS = {
  COMPANY: [
    { label: "About", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Works", href: "/works" },
    { label: "Career", href: "/career" },
  ],
  HELP: [
    { label: "Customer Support", href: "/contact" },
    { label: "Delivery Details", href: "/delivery" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  FAQ: [
    { label: "Account", href: "/faq#account" },
    { label: "Manage Deliveries", href: "/faq#deliveries" },
    { label: "Orders", href: "/faq#orders" },
    { label: "Payments", href: "/faq#payments" },
  ],
  RESOURCES: [
    { label: "Free eBooks", href: "/resources/ebooks" },
    { label: "Development Tutorial", href: "/resources/tutorials" },
    { label: "How to — Blog", href: "/blog" },
    { label: "Youtube Playlist", href: "/resources/youtube" },
  ],
};
