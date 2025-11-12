// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const DEMO_PRODUCTS = [
  // Electronics
  { name: 'Wireless Bluetooth Headphones', price: 79.99, tags: ['electronics', 'audio', 'tech'], description: 'Premium noise-canceling wireless headphones with 30-hour battery life', imageUrl: 'https://picsum.photos/seed/headphones/400/300' },
  { name: 'Smart Watch Pro', price: 299.99, tags: ['electronics', 'wearable', 'tech'], description: 'Advanced fitness tracking smartwatch with heart rate monitor', imageUrl: 'https://picsum.photos/seed/smartwatch/400/300' },
  { name: 'Laptop Stand Aluminum', price: 45.99, tags: ['electronics', 'accessories', 'office'], description: 'Ergonomic laptop stand with adjustable height and angle', imageUrl: 'https://picsum.photos/seed/laptopstand/400/300' },
  { name: '4K Webcam', price: 129.99, tags: ['electronics', 'camera', 'office'], description: 'Professional 4K webcam with auto-focus and noise reduction', imageUrl: 'https://picsum.photos/seed/webcam/400/300' },
  { name: 'Mechanical Gaming Keyboard', price: 149.99, tags: ['electronics', 'gaming', 'tech'], description: 'RGB mechanical keyboard with Cherry MX switches', imageUrl: 'https://picsum.photos/seed/keyboard/400/300' },
  { name: 'Wireless Mouse', price: 39.99, tags: ['electronics', 'accessories', 'office'], description: 'Ergonomic wireless mouse with precision tracking', imageUrl: 'https://picsum.photos/seed/mouse/400/300' },
  { name: 'USB-C Hub 7-in-1', price: 54.99, tags: ['electronics', 'accessories', 'tech'], description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', imageUrl: 'https://picsum.photos/seed/usbhub/400/300' },
  { name: 'Portable SSD 1TB', price: 119.99, tags: ['electronics', 'storage', 'tech'], description: 'High-speed portable SSD with USB-C connectivity', imageUrl: 'https://picsum.photos/seed/ssd/400/300' },

  // Home & Living
  { name: 'Smart LED Light Bulbs (4-Pack)', price: 49.99, tags: ['home', 'smart', 'lighting'], description: 'WiFi-enabled color-changing LED bulbs with voice control', imageUrl: 'https://picsum.photos/seed/lightbulbs/400/300' },
  { name: 'Air Purifier HEPA', price: 199.99, tags: ['home', 'appliances', 'health'], description: 'True HEPA air purifier for large rooms up to 500 sq ft', imageUrl: 'https://picsum.photos/seed/airpurifier/400/300' },
  { name: 'Coffee Maker Programmable', price: 89.99, tags: ['home', 'kitchen', 'appliances'], description: '12-cup programmable coffee maker with thermal carafe', imageUrl: 'https://picsum.photos/seed/coffeemaker/400/300' },
  { name: 'Electric Kettle Stainless Steel', price: 34.99, tags: ['home', 'kitchen', 'appliances'], description: 'Fast-boiling electric kettle with temperature control', imageUrl: 'https://picsum.photos/seed/kettle/400/300' },
  { name: 'Vacuum Cleaner Robot', price: 279.99, tags: ['home', 'appliances', 'smart'], description: 'Smart robot vacuum with app control and auto-charging', imageUrl: 'https://picsum.photos/seed/robotvacuum/400/300' },
  { name: 'Bamboo Cutting Board Set', price: 29.99, tags: ['home', 'kitchen', 'cooking'], description: 'Eco-friendly bamboo cutting boards in 3 sizes', imageUrl: 'https://picsum.photos/seed/cuttingboard/400/300' },
  { name: 'Non-Stick Cookware Set', price: 149.99, tags: ['home', 'kitchen', 'cooking'], description: '10-piece non-stick cookware set with glass lids', imageUrl: 'https://picsum.photos/seed/cookware/400/300' },
  { name: 'Memory Foam Pillow', price: 39.99, tags: ['home', 'bedroom', 'comfort'], description: 'Adjustable memory foam pillow with cooling gel', imageUrl: 'https://picsum.photos/seed/pillow/400/300' },

  // Fitness & Sports
  { name: 'Yoga Mat Premium', price: 34.99, tags: ['fitness', 'sports', 'health'], description: 'Extra-thick non-slip yoga mat with carrying strap', imageUrl: 'https://picsum.photos/seed/yogamat/400/300' },
  { name: 'Adjustable Dumbbells Set', price: 249.99, tags: ['fitness', 'sports', 'health'], description: 'Space-saving adjustable dumbbells 5-52.5 lbs', imageUrl: 'https://picsum.photos/seed/dumbbells/400/300' },
  { name: 'Resistance Bands Set', price: 24.99, tags: ['fitness', 'sports', 'health'], description: '5-piece resistance bands with handles and door anchor', imageUrl: 'https://picsum.photos/seed/resistancebands/400/300' },
  { name: 'Foam Roller', price: 19.99, tags: ['fitness', 'sports', 'health'], description: 'High-density foam roller for muscle recovery', imageUrl: 'https://picsum.photos/seed/foamroller/400/300' },

  // Fashion & Accessories
  { name: 'Leather Backpack', price: 89.99, tags: ['fashion', 'accessories', 'bags'], description: 'Genuine leather backpack with laptop compartment', imageUrl: 'https://picsum.photos/seed/backpack/400/300' },
  { name: 'Sunglasses Polarized', price: 49.99, tags: ['fashion', 'accessories', 'eyewear'], description: 'UV400 polarized sunglasses with metal frame', imageUrl: 'https://picsum.photos/seed/sunglasses/400/300' },
  { name: 'Travel Duffel Bag', price: 69.99, tags: ['fashion', 'accessories', 'travel'], description: 'Water-resistant duffel bag with shoe compartment', imageUrl: 'https://picsum.photos/seed/duffelbag/400/300' },
  { name: 'Minimalist Wallet', price: 29.99, tags: ['fashion', 'accessories', 'wallet'], description: 'RFID-blocking slim wallet with money clip', imageUrl: 'https://picsum.photos/seed/wallet/400/300' },

  // Books & Education
  { name: 'Wireless Drawing Tablet', price: 199.99, tags: ['education', 'tech', 'creative'], description: 'Professional drawing tablet with 8192 pressure levels', imageUrl: 'https://picsum.photos/seed/drawingtablet/400/300' },
  { name: 'E-Reader Waterproof', price: 139.99, tags: ['education', 'reading', 'tech'], description: '7-inch waterproof e-reader with adjustable warm light', imageUrl: 'https://picsum.photos/seed/ereader/400/300' },
  { name: 'Desk Organizer Set', price: 24.99, tags: ['office', 'organization', 'accessories'], description: 'Bamboo desk organizer with phone holder', imageUrl: 'https://picsum.photos/seed/deskorganizer/400/300' },
  { name: 'LED Desk Lamp', price: 44.99, tags: ['office', 'lighting', 'tech'], description: 'Adjustable LED desk lamp with USB charging port', imageUrl: 'https://picsum.photos/seed/desklamp/400/300' },

  // Gaming
  { name: 'Gaming Mouse Pad XXL', price: 29.99, tags: ['gaming', 'accessories', 'tech'], description: 'Extra-large gaming mouse pad with stitched edges', imageUrl: 'https://picsum.photos/seed/mousepad/400/300' },
  { name: 'Gaming Headset RGB', price: 89.99, tags: ['gaming', 'audio', 'tech'], description: '7.1 surround sound gaming headset with noise-canceling mic', imageUrl: 'https://picsum.photos/seed/gamingheadset/400/300' },
];

async function main() {
  console.log('🌱 Starting seed...');

  // 1) Create demo users
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@marketfy.test' },
    update: {},
    create: {
      email: 'demo@marketfy.test',
      passwordHash,
      displayName: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      bio: 'Tech enthusiast and avid online shopper',
      interests: ['electronics', 'gaming', 'tech'],
    },
  });

  const johnUser = await prisma.user.upsert({
    where: { email: 'john@marketfy.test' },
    update: {},
    create: {
      email: 'john@marketfy.test',
      passwordHash,
      displayName: 'John Smith',
      firstName: 'John',
      lastName: 'Smith',
      bio: 'Fitness coach and home improvement enthusiast',
      interests: ['fitness', 'home', 'sports'],
    },
  });

  console.log(`✅ Created ${2} users`);

  // 2) Seed products
  const existingCount = await prisma.product.count();
  if (existingCount === 0) {
    await prisma.product.createMany({
      data: DEMO_PRODUCTS as Prisma.ProductCreateManyInput[],
    });
    console.log(`✅ Created ${DEMO_PRODUCTS.length} products`);
  } else {
    console.log(`⏭️  Skipped products (${existingCount} already exist)`);
  }

  // 3) Create sample orders
  const products = await prisma.product.findMany({ take: 4 });
  if (products.length >= 4) {
    // Order for demo user
    const demoOrderItems = [
      { product: { id: products[0].id, name: products[0].name, price: Number(products[0].price) }, qty: 2 },
      { product: { id: products[1].id, name: products[1].name, price: Number(products[1].price) }, qty: 1 },
    ];
    const demoTotal = demoOrderItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    await prisma.order.create({
      data: {
        orderId: randomUUID(),
        userId: demoUser.id,
        items: demoOrderItems as any,
        total: Number(demoTotal.toFixed(2)),
      },
    });

    // Order for john user
    const johnOrderItems = [
      { product: { id: products[2].id, name: products[2].name, price: Number(products[2].price) }, qty: 1 },
      { product: { id: products[3].id, name: products[3].name, price: Number(products[3].price) }, qty: 3 },
    ];
    const johnTotal = johnOrderItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    await prisma.order.create({
      data: {
        orderId: randomUUID(),
        userId: johnUser.id,
        items: johnOrderItems as any,
        total: Number(johnTotal.toFixed(2)),
      },
    });

    console.log(`✅ Created ${2} sample orders`);
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo credentials:');
  console.log('   Email: demo@marketfy.test');
  console.log('   Password: password123');
  console.log('\n   Email: john@marketfy.test');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
