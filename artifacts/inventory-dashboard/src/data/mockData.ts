export const MOCK_PRODUCTS = [
  { id: "1", sku: "SKU-1001", name: "Wireless Headphones", category: "Electronics", quantity: 245, reorderPoint: 50, unitCost: 89.99, status: "healthy" },
  { id: "2", sku: "SKU-1002", name: "Office Chair", category: "Furniture", quantity: 12, reorderPoint: 20, unitCost: 145.00, status: "low" },
  { id: "3", sku: "SKU-1003", name: "USB-C Cables", category: "Electronics", quantity: 1200, reorderPoint: 100, unitCost: 12.50, status: "healthy" },
  { id: "4", sku: "SKU-1004", name: "Standing Desk", category: "Furniture", quantity: 3, reorderPoint: 10, unitCost: 350.00, status: "critical" },
  { id: "5", sku: "SKU-1005", name: "Mechanical Keyboard", category: "Electronics", quantity: 89, reorderPoint: 30, unitCost: 120.00, status: "healthy" },
  { id: "6", sku: "SKU-1006", name: "Monitor Stand", category: "Accessories", quantity: 0, reorderPoint: 15, unitCost: 45.00, status: "critical" },
  { id: "7", sku: "SKU-1007", name: "Webcam HD", category: "Electronics", quantity: 156, reorderPoint: 40, unitCost: 75.00, status: "healthy" },
  { id: "8", sku: "SKU-1008", name: "Ergonomic Mouse", category: "Accessories", quantity: 34, reorderPoint: 50, unitCost: 65.00, status: "low" }
];

export const MOCK_SUPPLIERS = [
  { id: "1", name: "TechSource Global", contact: "contact@techsource.com", leadTime: "5 days", rating: 4.8, activeOrders: 3, category: "Electronics" },
  { id: "2", name: "FurniPro Ltd", contact: "sales@furnipro.com", leadTime: "14 days", rating: 4.2, activeOrders: 1, category: "Furniture" },
  { id: "3", name: "AccessoryHub Inc", contact: "orders@accessoryhub.com", leadTime: "3 days", rating: 4.9, activeOrders: 4, category: "Accessories" },
  { id: "4", name: "ElectroDepot", contact: "supply@electrodepot.com", leadTime: "7 days", rating: 4.5, activeOrders: 0, category: "Electronics" }
];

export const MOCK_ORDERS = [
  { id: "ORD-501", supplier: "TechSource Global", status: "delivered", date: "2023-10-15", expected: "2023-10-20", value: 4500.00, items: 150 },
  { id: "ORD-502", supplier: "FurniPro Ltd", status: "processing", date: "2023-10-25", expected: "2023-11-08", value: 8500.00, items: 50 },
  { id: "ORD-503", supplier: "AccessoryHub Inc", status: "pending", date: "2023-10-28", expected: "2023-11-01", value: 1200.00, items: 300 },
  { id: "ORD-504", supplier: "ElectroDepot", status: "cancelled", date: "2023-10-10", expected: "2023-10-17", value: 3400.00, items: 80 },
  { id: "ORD-505", supplier: "TechSource Global", status: "pending", date: "2023-10-29", expected: "2023-11-03", value: 5600.00, items: 200 },
  { id: "ORD-506", supplier: "AccessoryHub Inc", status: "processing", date: "2023-10-27", expected: "2023-10-30", value: 850.00, items: 120 },
  { id: "ORD-507", supplier: "FurniPro Ltd", status: "delivered", date: "2023-09-20", expected: "2023-10-04", value: 12000.00, items: 80 },
  { id: "ORD-508", supplier: "TechSource Global", status: "processing", date: "2023-10-26", expected: "2023-10-31", value: 2300.00, items: 75 }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Low Stock Alert", message: "Office Chair is running low (12 units left)", type: "warning", time: "10 min ago" },
  { id: 2, title: "Order Delivered", message: "ORD-501 has been delivered to Warehouse A", type: "success", time: "1 hour ago" },
  { id: 3, title: "Critical Stock", message: "Standing Desk is critically low (3 units left)", type: "critical", time: "2 hours ago" },
  { id: 4, title: "New Supplier", message: "ElectroDepot has been approved as a new supplier", type: "info", time: "1 day ago" }
];
