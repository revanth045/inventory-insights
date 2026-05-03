export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  maxCapacity: number;
  reorderPoint: number;
  unitCost: number;
  status: "healthy" | "low" | "critical";
  supplier: string;
  dailyUsage: number;
  lastRestocked: string;
};

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", sku: "SKU-1001", name: "Wireless Headphones", category: "Electronics", quantity: 245, maxCapacity: 500, reorderPoint: 50, unitCost: 89.99, status: "healthy", supplier: "TechSource Global", dailyUsage: 8, lastRestocked: "2026-04-15" },
  { id: "2", sku: "SKU-1002", name: "Office Chair", category: "Furniture", quantity: 12, maxCapacity: 100, reorderPoint: 20, unitCost: 145.00, status: "low", supplier: "FurniPro Ltd", dailyUsage: 2, lastRestocked: "2026-03-20" },
  { id: "3", sku: "SKU-1003", name: "USB-C Cables", category: "Electronics", quantity: 1200, maxCapacity: 2000, reorderPoint: 100, unitCost: 12.50, status: "healthy", supplier: "TechSource Global", dailyUsage: 45, lastRestocked: "2026-04-28" },
  { id: "4", sku: "SKU-1004", name: "Standing Desk", category: "Furniture", quantity: 3, maxCapacity: 50, reorderPoint: 10, unitCost: 350.00, status: "critical", supplier: "FurniPro Ltd", dailyUsage: 1, lastRestocked: "2026-02-10" },
  { id: "5", sku: "SKU-1005", name: "Mechanical Keyboard", category: "Electronics", quantity: 89, maxCapacity: 300, reorderPoint: 30, unitCost: 120.00, status: "healthy", supplier: "TechSource Global", dailyUsage: 5, lastRestocked: "2026-04-01" },
  { id: "6", sku: "SKU-1006", name: "Monitor Stand", category: "Accessories", quantity: 0, maxCapacity: 150, reorderPoint: 15, unitCost: 45.00, status: "critical", supplier: "AccessoryHub Inc", dailyUsage: 3, lastRestocked: "2026-01-30" },
  { id: "7", sku: "SKU-1007", name: "Webcam HD", category: "Electronics", quantity: 156, maxCapacity: 400, reorderPoint: 40, unitCost: 75.00, status: "healthy", supplier: "ElectroDepot", dailyUsage: 7, lastRestocked: "2026-04-10" },
  { id: "8", sku: "SKU-1008", name: "Ergonomic Mouse", category: "Accessories", quantity: 34, maxCapacity: 200, reorderPoint: 50, unitCost: 65.00, status: "low", supplier: "AccessoryHub Inc", dailyUsage: 6, lastRestocked: "2026-03-05" },
  { id: "9", sku: "SKU-1009", name: "Laptop Stand", category: "Accessories", quantity: 78, maxCapacity: 200, reorderPoint: 25, unitCost: 38.00, status: "healthy", supplier: "AccessoryHub Inc", dailyUsage: 4, lastRestocked: "2026-04-20" },
  { id: "10", sku: "SKU-1010", name: "4K Monitor", category: "Electronics", quantity: 42, maxCapacity: 120, reorderPoint: 15, unitCost: 320.00, status: "healthy", supplier: "ElectroDepot", dailyUsage: 2, lastRestocked: "2026-04-12" },
  { id: "11", sku: "SKU-1011", name: "Desk Lamp", category: "Accessories", quantity: 95, maxCapacity: 300, reorderPoint: 30, unitCost: 28.00, status: "healthy", supplier: "AccessoryHub Inc", dailyUsage: 3, lastRestocked: "2026-04-18" },
  { id: "12", sku: "SKU-1012", name: "Conference Chair", category: "Furniture", quantity: 8, maxCapacity: 60, reorderPoint: 12, unitCost: 185.00, status: "low", supplier: "FurniPro Ltd", dailyUsage: 1, lastRestocked: "2026-02-28" },
];

export const MOCK_SUPPLIERS = [
  { id: "1", name: "TechSource Global", contact: "contact@techsource.com", phone: "+1 (800) 555-0101", leadTime: "5 days", rating: 4.8, activeOrders: 3, category: "Electronics", country: "USA", onTimeDelivery: 95 },
  { id: "2", name: "FurniPro Ltd", contact: "sales@furnipro.com", phone: "+44 20 7946 0958", leadTime: "14 days", rating: 4.2, activeOrders: 1, category: "Furniture", country: "UK", onTimeDelivery: 78 },
  { id: "3", name: "AccessoryHub Inc", contact: "orders@accessoryhub.com", phone: "+1 (800) 555-0303", leadTime: "3 days", rating: 4.9, activeOrders: 4, category: "Accessories", country: "USA", onTimeDelivery: 98 },
  { id: "4", name: "ElectroDepot", contact: "supply@electrodepot.com", phone: "+49 30 1234 5678", leadTime: "7 days", rating: 4.5, activeOrders: 2, category: "Electronics", country: "Germany", onTimeDelivery: 91 },
];

export const MOCK_ORDERS = [
  { id: "ORD-501", supplier: "TechSource Global", status: "delivered", date: "2026-04-15", expected: "2026-04-20", value: 4500.00, items: 150 },
  { id: "ORD-502", supplier: "FurniPro Ltd", status: "processing", date: "2026-04-25", expected: "2026-05-08", value: 8500.00, items: 50 },
  { id: "ORD-503", supplier: "AccessoryHub Inc", status: "pending", date: "2026-04-28", expected: "2026-05-01", value: 1200.00, items: 300 },
  { id: "ORD-504", supplier: "ElectroDepot", status: "cancelled", date: "2026-04-10", expected: "2026-04-17", value: 3400.00, items: 80 },
  { id: "ORD-505", supplier: "TechSource Global", status: "pending", date: "2026-04-29", expected: "2026-05-03", value: 5600.00, items: 200 },
  { id: "ORD-506", supplier: "AccessoryHub Inc", status: "processing", date: "2026-04-27", expected: "2026-04-30", value: 850.00, items: 120 },
  { id: "ORD-507", supplier: "FurniPro Ltd", status: "delivered", date: "2026-03-20", expected: "2026-04-04", value: 12000.00, items: 80 },
  { id: "ORD-508", supplier: "TechSource Global", status: "processing", date: "2026-04-26", expected: "2026-05-01", value: 2300.00, items: 75 },
  { id: "ORD-509", supplier: "ElectroDepot", status: "delivered", date: "2026-04-05", expected: "2026-04-12", value: 6400.00, items: 40 },
  { id: "ORD-510", supplier: "AccessoryHub Inc", status: "pending", date: "2026-04-30", expected: "2026-05-05", value: 950.00, items: 85 },
];

export type Notification = {
  id: number;
  title: string;
  message: string;
  type: "warning" | "success" | "critical" | "info";
  time: string;
  read: boolean;
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "Low Stock Alert", message: "Office Chair is running low (12 units left, reorder at 20)", type: "warning", time: "10 min ago", read: false },
  { id: 2, title: "Order Delivered", message: "ORD-501 has been delivered to Warehouse A (150 items)", type: "success", time: "1 hour ago", read: false },
  { id: 3, title: "Critical Stock", message: "Standing Desk is critically low — only 3 units left", type: "critical", time: "2 hours ago", read: false },
  { id: 4, title: "New Supplier", message: "ElectroDepot has been approved as a new supplier", type: "info", time: "1 day ago", read: true },
  { id: 5, title: "Low Stock Alert", message: "Ergonomic Mouse is below reorder point (34 / 50)", type: "warning", time: "3 hours ago", read: false },
];
