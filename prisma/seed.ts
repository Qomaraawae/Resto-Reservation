import { PrismaClient } from '../src/generated/prisma/client.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Tables
  const tables = await prisma.table.createMany({
    data: [
      { number: 'T1', capacity: 2, status: 'available', section: 'Window' },
      { number: 'T2', capacity: 4, status: 'available', section: 'Window' },
      { number: 'T3', capacity: 4, status: 'available', section: 'Center' },
      { number: 'T4', capacity: 6, status: 'available', section: 'Center' },
      { number: 'T5', capacity: 8, status: 'available', section: 'Private' },
      { number: 'T6', capacity: 2, status: 'available', section: 'Outdoor' },
      { number: 'T7', capacity: 4, status: 'available', section: 'Outdoor' },
      { number: 'T8', capacity: 10, status: 'available', section: 'Private' },
    ],
  })
  console.log(`✅ Created ${tables.count} tables`)

  // Seed Menus
  const menus = await prisma.menu.createMany({
    data: [
      {
        name: 'Nasi Goreng Special',
        description: 'Nasi goreng dengan telur dan ayam',
        price: 35000,
        category: 'Main Course',
      },
      {
        name: 'Mie Goreng Seafood',
        description: 'Mie goreng dengan seafood segar',
        price: 38000,
        category: 'Main Course',
      },
      {
        name: 'Sate Ayam Madura',
        description: 'Sate ayam dengan bumbu kacang',
        price: 30000,
        category: 'Appetizer',
      },
      {
        name: 'Gado-Gado',
        description: 'Sayuran dengan bumbu kacang',
        price: 25000,
        category: 'Appetizer',
      },
      {
        name: 'Sop Buntut',
        description: 'Sup buntut sapi dengan sayuran',
        price: 45000,
        category: 'Soup',
      },
      {
        name: 'Ayam Bakar',
        description: 'Ayam bakar dengan sambal',
        price: 40000,
        category: 'Main Course',
      },
      { name: 'Es Teh Manis', description: 'Teh manis dingin', price: 8000, category: 'Beverage' },
      {
        name: 'Kopi Hitam',
        description: 'Kopi hitam original',
        price: 12000,
        category: 'Beverage',
      },
      { name: 'Jus Jeruk', description: 'Jus jeruk segar', price: 15000, category: 'Beverage' },
      {
        name: 'Es Campur',
        description: 'Es campur dengan berbagai topping',
        price: 18000,
        category: 'Dessert',
      },
    ],
  })
  console.log(`✅ Created ${menus.count} menu items`)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
