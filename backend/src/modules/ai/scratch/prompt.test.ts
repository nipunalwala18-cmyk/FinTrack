import { prisma } from '../../../config/prisma.js';
import { AiService } from '../service/ai.service.js';
import dotenv from 'dotenv';

dotenv.config();

const aiService = new AiService();

const TEST_CASES = {
  transactions: [
    { name: 'Add Expense', prompt: 'I spent ₹500 on groceries yesterday.' },
    { name: 'Add Income', prompt: 'I received ₹50000 salary into my Bank Account today.' },
    { name: 'Transfer Money', prompt: 'Transfer ₹1000 from Bank Account to Cash Account.' },
    { name: 'Missing Amount', prompt: 'Add an expense for food.' },
    { name: 'Missing Category', prompt: 'I spent ₹2500 today.' },
  ],
  goals: [
    { name: 'Create Goal', prompt: 'Create a savings goal called Emergency Fund with a target of ₹100000 by 2027-12-31.' },
    { name: 'Add Contribution', prompt: 'Add ₹2000 to my Emergency Fund from HDFC Account.' },
  ],
  budgets: [
    { name: 'Create Budget', prompt: 'Set a monthly budget of ₹10000 for Food.' },
  ],
  accounts: [
    { name: 'Create Account', prompt: 'Create a cash account named Pocket Cash with balance ₹1500.' },
  ],
  reports: [
    { name: 'Monthly Summary', prompt: 'Show me my monthly summary.' },
    { name: 'Category Breakdown', prompt: 'Give me a breakdown of my spending by category.' },
  ],
  reasoning: [
    { name: 'Savings Advice', prompt: 'How can I save more money this month?' },
    { name: 'Affordability', prompt: 'Can I afford a new laptop for ₹75000?' },
  ],
};

async function runTest(userId: string, category: string, test: any) {
  console.log(`\n==================================================`);
  console.log(`🧪 Running Test: [${category.toUpperCase()}] - ${test.name}`);
  console.log(`💬 User Prompt: "${test.prompt}"`);
  console.log(`==================================================`);

  try {
    const result = await aiService.chat(userId, null, test.prompt);
    console.log(`🤖 AI Assistant Response:\n`);
    console.log(result.message.content);
    if (result.message.toolExecuted) {
      console.log(`\n⚙️ Tool Executed: ${result.message.toolExecuted} (Success: ${result.message.toolSuccess})`);
    }
  } catch (error: any) {
    console.error(`❌ Test Failed:`, error.message || error);
  }
}

async function start() {
  console.log('🔄 Resolving test user...');
  let user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('👤 No user found. Creating a test user...');
    user = await prisma.user.create({
      data: {
        fullName: 'Test User',
        email: 'test.user@example.com',
        role: 'USER',
      },
    });
  }

  console.log(`👤 Using user: ${user.fullName} (${user.email})`);

  // Ensure test accounts exist for the transfer/contribution tests
  await prisma.account.upsert({
    where: { id: 'test-bank-acc' },
    create: {
      id: 'test-bank-acc',
      userId: user.id,
      name: 'Bank Account',
      type: 'BANK',
      balance: 100000,
    },
    update: {},
  });

  await prisma.account.upsert({
    where: { id: 'test-cash-acc' },
    create: {
      id: 'test-cash-acc',
      userId: user.id,
      name: 'Cash Account',
      type: 'CASH',
      balance: 5000,
    },
    update: {},
  });

  // Run test cases sequentially
  for (const [category, cases] of Object.entries(TEST_CASES)) {
    for (const test of cases) {
      await runTest(user.id, category, test);
    }
  }

  console.log('\n✅ Prompt testing suite execution completed.');
  process.exit(0);
}

start().catch((err) => {
  console.error('Fatal testing suite error:', err);
  process.exit(1);
});
