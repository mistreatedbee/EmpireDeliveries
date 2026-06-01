export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  logo: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  distance: string;
  isOpen: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  promo?: string;
  tags: string[];
  address: string;
  city: string;
  description: string;
  operatingHours: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular: boolean;
  isAvailable: boolean;
  calories?: number;
  prepTime?: string;
  addons?: Addon[];
};

export type Addon = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
  addons: Addon[];
  instructions: string;
};

export type Order = {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'picked_up' | 'on_way' | 'delivered' | 'cancelled';
  date: string;
  deliveryAddress: string;
  driver?: Driver;
};

export type Driver = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  vehicle: string;
  plate: string;
  phone: string;
  eta: string;
};

export const CATEGORIES: Category[] = [
  { id: 'burgers', name: 'Burgers', icon: '🍔', color: '#FF6B35' },
  { id: 'chicken', name: 'Chicken', icon: '🍗', color: '#FFB800' },
  { id: 'pizza', name: 'Pizza', icon: '🍕', color: '#E53E3E' },
  { id: 'fast-food', name: 'Fast Food', icon: '🍟', color: '#F6AD55' },
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#48BB78' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊', color: '#4299E1' },
  { id: 'drinks', name: 'Drinks', icon: '🥤', color: '#9F7AEA' },
  { id: 'desserts', name: 'Desserts', icon: '🍰', color: '#F687B3' },
  { id: 'local', name: 'Local Cuisine', icon: '🍲', color: '#68D391' },
  { id: 'courier', name: 'Courier', icon: '📦', color: '#D4AF37' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: "KFC Sandton City",
    cuisine: "Chicken & Fast Food",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.2,
    reviewCount: 1847,
    deliveryTime: "20-30",
    deliveryFee: 15,
    minOrder: 80,
    distance: "1.2 km",
    isOpen: true,
    isFeatured: true,
    isPopular: true,
    promo: "2 for 1 Tuesdays",
    tags: ["chicken", "fast-food", "burgers"],
    address: "Sandton City Mall, Sandton Dr",
    city: "Johannesburg",
    description: "South Africa's favourite fried chicken. Finger Lickin' Good.",
    operatingHours: "08:00 – 23:00",
  },
  {
    id: 'r2',
    name: "Nando's Rosebank",
    cuisine: "Portuguese / Peri-Peri",
    image: "https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/2491273/pexels-photo-2491273.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.5,
    reviewCount: 2312,
    deliveryTime: "25-40",
    deliveryFee: 20,
    minOrder: 100,
    distance: "2.1 km",
    isOpen: true,
    isFeatured: true,
    isPopular: true,
    promo: "Free Peri Chips on R200+",
    tags: ["chicken", "local", "portuguese"],
    address: "The Zone @ Rosebank, Oxford Rd",
    city: "Johannesburg",
    description: "Flame-grilled peri-peri chicken with bold flavours. A South African institution.",
    operatingHours: "11:00 – 22:00",
  },
  {
    id: 'r3',
    name: "Debonairs Pizza Menlyn",
    cuisine: "Pizza",
    image: "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/1049620/pexels-photo-1049620.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.1,
    reviewCount: 987,
    deliveryTime: "30-45",
    deliveryFee: 25,
    minOrder: 120,
    distance: "3.4 km",
    isOpen: true,
    isFeatured: false,
    isPopular: true,
    promo: "Triple Decker Special",
    tags: ["pizza", "fast-food"],
    address: "Menlyn Park Shopping Centre, Pretoria",
    city: "Pretoria",
    description: "The home of Triple Decker and Maxi pizzas. SA's favourite pizza chain.",
    operatingHours: "11:00 – 23:00",
  },
  {
    id: 'r4',
    name: "Steers Midrand",
    cuisine: "Burgers & Fast Food",
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.0,
    reviewCount: 654,
    deliveryTime: "20-35",
    deliveryFee: 18,
    minOrder: 90,
    distance: "0.8 km",
    isOpen: true,
    isFeatured: true,
    isPopular: false,
    tags: ["burgers", "fast-food"],
    address: "Grand Central Mall, Midrand",
    city: "Midrand",
    description: "Real fire-grilled burgers made with 100% pure beef. Flame-grilled since 1966.",
    operatingHours: "09:00 – 22:30",
  },
  {
    id: 'r5',
    name: "Spur Steak Ranches V&A",
    cuisine: "Steaks & Grills",
    image: "https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/2491273/pexels-photo-2491273.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.4,
    reviewCount: 3201,
    deliveryTime: "35-50",
    deliveryFee: 35,
    minOrder: 150,
    distance: "4.7 km",
    isOpen: true,
    isFeatured: false,
    isPopular: true,
    tags: ["steaks", "grills", "burgers"],
    address: "V&A Waterfront, Cape Town",
    city: "Cape Town",
    description: "South Africa's favourite family restaurant since 1967. Legendary steaks and ribs.",
    operatingHours: "12:00 – 22:00",
  },
  {
    id: 'r6',
    name: "Roman's Pizza Durban North",
    cuisine: "Pizza",
    image: "https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/1049620/pexels-photo-1049620.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.3,
    reviewCount: 1120,
    deliveryTime: "25-40",
    deliveryFee: 20,
    minOrder: 100,
    distance: "2.9 km",
    isOpen: false,
    isFeatured: false,
    isPopular: false,
    promo: "Buy 2 Get 1 Free",
    tags: ["pizza"],
    address: "Durban North Shopping Centre",
    city: "Durban",
    description: "Freshly made Roman-style pizzas since 1993. A beloved SA pizza brand.",
    operatingHours: "11:00 – 22:00",
  },
  {
    id: 'r7',
    name: "McDonald's N1 City",
    cuisine: "Burgers & Fast Food",
    image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4.1,
    reviewCount: 2088,
    deliveryTime: "20-30",
    deliveryFee: 15,
    minOrder: 80,
    distance: "1.9 km",
    isOpen: true,
    isFeatured: true,
    isPopular: true,
    promo: "McFlurry R25",
    tags: ["burgers", "fast-food", "breakfast"],
    address: "N1 City Mall, Cape Town",
    city: "Cape Town",
    description: "I'm lovin' it. The world's most iconic burger brand.",
    operatingHours: "06:00 – 24:00",
  },
  {
    id: 'r8',
    name: "Wimpy Middelburg Mall",
    cuisine: "Burgers & Breakfasts",
    image: "https://images.pexels.com/photos/1586942/pexels-photo-1586942.jpeg?auto=compress&cs=tinysrgb&w=800",
    logo: "https://images.pexels.com/photos/2491273/pexels-photo-2491273.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 3.9,
    reviewCount: 440,
    deliveryTime: "25-40",
    deliveryFee: 20,
    minOrder: 85,
    distance: "5.2 km",
    isOpen: true,
    isFeatured: false,
    isPopular: false,
    tags: ["burgers", "breakfast", "fast-food"],
    address: "Middelburg Mall, Mpumalanga",
    city: "Mbombela",
    description: "South Africa's original burger restaurant. Famous for breakfasts since 1967.",
    operatingHours: "07:00 – 21:00",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1', restaurantId: 'r1', name: 'Zinger Tower Burger', description: 'Crispy spicy fillet, bacon, cheese, and zesty sauce stacked high in a brioche bun.', price: 89.90, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'Burgers', isPopular: true, isAvailable: true, calories: 680, prepTime: '10 min', addons: [{ id: 'a1', name: 'Extra Cheese', price: 12 }, { id: 'a2', name: 'Extra Patty', price: 25 }, { id: 'a3', name: 'Bacon', price: 18 }]
  },
  {
    id: 'm2', restaurantId: 'r1', name: '8-Piece Streetwise Bucket', description: 'Eight pieces of KFC\'s iconic Original Recipe chicken. Perfect for sharing.', price: 149.90, image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'Chicken', isPopular: true, isAvailable: true, calories: 1240, prepTime: '15 min'
  },
  {
    id: 'm3', restaurantId: 'r1', name: 'Colonel\'s Crunch Burger', description: 'Two crispy chicken fillets with coleslaw and our signature Colonel\'s sauce.', price: 74.90, image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'Burgers', isPopular: false, isAvailable: true, calories: 550, prepTime: '8 min'
  },
  {
    id: 'm4', restaurantId: 'r2', name: '1/4 Peri-Peri Chicken', description: 'Flame-grilled quarter chicken in your choice of Lemon & Herb, Medium, or Extra Hot.', price: 89.90, image: 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'Chicken', isPopular: true, isAvailable: true, calories: 320, prepTime: '15 min', addons: [{ id: 'a4', name: 'Peri Chips', price: 35 }, { id: 'a5', name: 'Coleslaw', price: 25 }]
  },
  {
    id: 'm5', restaurantId: 'r2', name: 'Nando\'s Burger', description: 'Double chicken fillet burger with avocado, pickled red cabbage, and extra-hot sauce.', price: 104.90, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'Burgers', isPopular: true, isAvailable: true, calories: 720, prepTime: '12 min'
  },
  {
    id: 'm6', restaurantId: 'r3', name: 'Triple Decker BBQ Beef', description: 'Three layers of fresh dough, BBQ beef mince, and melted mozzarella.', price: 119.90, image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'Pizzas', isPopular: true, isAvailable: true, calories: 890, prepTime: '20 min'
  },
  {
    id: 'm7', restaurantId: 'r4', name: 'The Big Crunch', description: 'Double flame-grilled pure beef patty with cheddar, pickles, onion, and Steers sauce.', price: 84.90, image: 'https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg?auto=compress&cs=tinysrgb&w=500', category: 'Burgers', isPopular: true, isAvailable: true, calories: 640, prepTime: '10 min', addons: [{ id: 'a6', name: 'Regular Chips', price: 30 }, { id: 'a7', name: 'Onion Rings', price: 35 }]
  },
];

export const GROCERY_STORES = [
  { id: 'g1', name: 'Checkers Sixty60', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800', deliveryTime: '60 min', deliveryFee: 35, rating: 4.6 },
  { id: 'g2', name: 'Pick n Pay asap!', image: 'https://images.pexels.com/photos/953864/pexels-photo-953864.jpeg?auto=compress&cs=tinysrgb&w=800', deliveryTime: '45 min', deliveryFee: 30, rating: 4.4 },
  { id: 'g3', name: 'Woolworths Dash', image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=800', deliveryTime: '60 min', deliveryFee: 40, rating: 4.7 },
  { id: 'g4', name: 'Spar Express', image: 'https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=800', deliveryTime: '30 min', deliveryFee: 25, rating: 4.2 },
];

export const PHARMACIES = [
  { id: 'p1', name: 'Dischem Now', image: 'https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg?auto=compress&cs=tinysrgb&w=800', deliveryTime: '60 min', deliveryFee: 40, rating: 4.5 },
  { id: 'p2', name: 'Clicks Delivery', image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=800', deliveryTime: '90 min', deliveryFee: 35, rating: 4.3 },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    restaurantName: 'KFC Sandton City',
    restaurantImage: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
    items: [{ name: 'Zinger Tower Burger', qty: 1, price: 89.90 }, { name: '8-Piece Bucket', qty: 1, price: 149.90 }],
    total: 269.80,
    status: 'on_way',
    date: '2024-06-01T14:32:00Z',
    deliveryAddress: '14 Rivonia Rd, Sandton, 2196',
    driver: {
      id: 'd1',
      name: 'Sipho Dlamini',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.8,
      vehicle: 'Toyota Corolla',
      plate: 'GP 123 456',
      phone: '+27 82 345 6789',
      eta: '8 min',
    }
  },
  {
    id: 'ORD-8756',
    restaurantName: "Nando's Rosebank",
    restaurantImage: 'https://images.pexels.com/photos/1059943/pexels-photo-1059943.jpeg?auto=compress&cs=tinysrgb&w=400',
    items: [{ name: '1/4 Peri-Peri Chicken', qty: 2, price: 179.80 }, { name: 'Peri Chips', qty: 2, price: 70 }],
    total: 299.80,
    status: 'delivered',
    date: '2024-05-29T19:15:00Z',
    deliveryAddress: '7 Oxford Rd, Rosebank, 2196',
  },
  {
    id: 'ORD-8640',
    restaurantName: 'Debonairs Pizza Menlyn',
    restaurantImage: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=400',
    items: [{ name: 'Triple Decker BBQ Beef', qty: 1, price: 119.90 }],
    total: 144.90,
    status: 'cancelled',
    date: '2024-05-27T20:05:00Z',
    deliveryAddress: 'Menlyn Maine Blvd, Pretoria, 0181',
  },
];

export const PROMO_BANNERS = [
  { id: 'b1', title: '50% OFF Your First Order', subtitle: 'Use code EMPIRE50', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', bgColor: '#0A0A0A', textColor: '#D4AF37' },
  { id: 'b2', title: 'Free Delivery Weekend', subtitle: 'All day Saturday & Sunday', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800', bgColor: '#D4AF37', textColor: '#0A0A0A' },
  { id: 'b3', title: 'Earn 2x Points', subtitle: 'On all grocery orders this week', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800', bgColor: '#00C853', textColor: '#FFFFFF' },
];

export const SA_CITIES = ['Johannesburg', 'Pretoria', 'Sandton', 'Midrand', 'Cape Town', 'Durban', 'Mbombela', 'Polokwane', 'Bloemfontein', 'Port Elizabeth'];

export const formatPrice = (price: number): string => `R${price.toFixed(2)}`;

export const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
  placed: 'Order Placed',
  confirmed: 'Restaurant Confirmed',
  preparing: 'Being Prepared',
  picked_up: 'Picked Up',
  on_way: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
