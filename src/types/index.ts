export type Category = 
  | 'Semua'
  | 'Sate Taichan' 
  | 'Paket Hemat' 
  | 'Menu Tambahan' 
  | 'Minuman' 
  | 'Menu Lainnya';

export type SpicyLevel = 'Sedang' | 'Pedas' | 'Ekstra Pedas';

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, 'Semua'>;
  price: number;
  description: string;
  image: string;
  isBestSeller: boolean;
  isAvailable: boolean;
  spicyLevelAvailable?: boolean;
  portionDetail?: string;
}

export interface CartItem {
  id: string; // unique item instance id
  product: Product;
  quantity: number;
  spicyLevel?: SpicyLevel;
  notes?: string;
}

export interface OrderDetails {
  customerName: string;
  customerPhone?: string;
  orderType: 'dine-in' | 'takeaway';
  tableOrAddress: string;
  generalNotes: string;
}

export interface BusinessSettings {
  whatsappNumber: string;
  address: string;
  operationalHoursWeekday: string;
  operationalHoursWeekend: string;
  promoTitle: string;
  promoDescription: string;
  promoActive: boolean;
  promoDiscountText: string;
}

export interface OperatingStatus {
  isOpen: boolean;
  statusText: string;
  closingTime?: string;
  openingTime?: string;
}
