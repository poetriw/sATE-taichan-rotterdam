import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessSettings, CartItem, OrderDetails, Product, SpicyLevel } from '../types';
import { INITIAL_BUSINESS_SETTINGS, INITIAL_PRODUCTS } from '../data/menuData';
import { calculateCartTotals, generateWhatsAppOrderMessage } from '../utils/orderLogic';

interface CartContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;

  // Settings
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: BusinessSettings) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, spicyLevel?: SpicyLevel, notes?: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;

  // UI state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;

  // Checkout
  sendWhatsAppOrder: (details: OrderDetails) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'str_products_v6_all_photos';
const SETTINGS_STORAGE_KEY = 'str_settings_v3';
const CART_STORAGE_KEY = 'str_cart_v3';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved products from localStorage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Settings State
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_BUSINESS_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved settings from localStorage:', e);
    }
    return INITIAL_BUSINESS_SETTINGS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved cart from localStorage:', e);
    }
    return [];
  });

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Sync products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('LocalStorage error saving products:', e);
    }
  }, [products]);

  // Sync settings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(businessSettings));
    } catch (e) {
      console.error('LocalStorage error saving settings:', e);
    }
  }, [businessSettings]);

  // Sync cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('LocalStorage error saving cart:', e);
    }
  }, [cart]);

  // Product CRUD
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `str-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    // Also update any matching product in cart
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updated.id ? { ...item, product: updated } : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  const updateBusinessSettings = (newSettings: BusinessSettings) => {
    setBusinessSettings(newSettings);
  };

  // Cart Operations
  const addToCart = (
    product: Product,
    spicyLevel?: SpicyLevel,
    notes?: string,
    quantity: number = 1
  ) => {
    if (!product.isAvailable) return;

    setCart((prev) => {
      // Check if identical item (same product ID, same spicy level, same notes) exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.spicyLevel || '') === (spicyLevel || '') &&
          (item.notes || '') === (notes || '')
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }

      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        product,
        quantity,
        spicyLevel,
        notes,
      };
      return [...prev, newItem];
    });

    // Provide visual response
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const { totalItems, totalPrice } = calculateCartTotals(cart);

  const sendWhatsAppOrder = (details: OrderDetails) => {
    if (cart.length === 0) return;
    const { url } = generateWhatsAppOrderMessage(cart, details, businessSettings.whatsappNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        businessSettings,
        updateBusinessSettings,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isAdminOpen,
        setIsAdminOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        sendWhatsAppOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
