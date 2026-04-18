/**
 * Database Seed Route & Initialize Demo Data
 * Creates realistic demo data for SaaS showcase
 * USES EXISTING SCHEMA ONLY - NO SCHEMA CHANGES
 */

const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Initialize seed data with realistic SaaS demo content
 * GET /seed/initialize
 */
router.get('/initialize', async (req, res) => {
  try {
    // Clear existing data (optional - comment out to keep existing data)
    // await prisma.reply.deleteMany({});
    // await prisma.images.deleteMany({});
    // await prisma.ticket.deleteMany({});
    // await prisma.problems.deleteMany({});
    // await prisma.user.deleteMany({});

    const hashedPassword = await bcrypt.hash('Demo@12345', 10);
    const adminPassword = await bcrypt.hash('Admin@12345', 10);
    const agentPassword = await bcrypt.hash('Agent@12345', 10);

    // 1. Create Admin User
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin Dashboard',
        email: 'admin@dernsupport.com',
        password: adminPassword,
        role: 'admin',
      },
    });

    // 2. Create Support Agents
    const agent1 = await prisma.user.create({
      data: {
        name: 'Sarah Support',
        email: 'sarah@dernsupport.com',
        password: agentPassword,
        role: 'agent',
      },
    });

    const agent2 = await prisma.user.create({
      data: {
        name: 'Mike Helper',
        email: 'mike@dernsupport.com',
        password: agentPassword,
        role: 'agent',
      },
    });

    // 3. Create Demo Customers
    const customers = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Emma Wilson',
          email: 'emma@example.com',
          password: hashedPassword,
          role: 'customer',
        },
      }),
      prisma.user.create({
        data: {
          name: 'John Developer',
          email: 'john@startup.io',
          password: hashedPassword,
          role: 'customer',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Lisa Chen',
          email: 'lisa@techcorp.com',
          password: hashedPassword,
          role: 'customer',
        },
      }),
      prisma.user.create({
        data: {
          name: 'David Martinez',
          email: 'david@business.net',
          password: hashedPassword,
          role: 'customer',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Sophie Laurent',
          email: 'sophie@creative.studio',
          password: hashedPassword,
          role: 'customer',
        },
      }),
    ]);

    // 4. Create Demo Tickets
    const tickets = await Promise.all([
      prisma.ticket.create({
        data: {
          name: 'Emma Wilson',
          email: 'emma@example.com',
          subject: 'Integration API not working',
          description:
            'I\'m trying to integrate your API but getting 401 errors. I\'ve verified my API key multiple times. Can you help?',
          type: 'technical',
          isSolved: true,
          userId: customers[0].id,
        },
      }),
      prisma.ticket.create({
        data: {
          name: 'John Developer',
          email: 'john@startup.io',
          subject: 'Billing issue - Duplicate charge',
          description:
            'I noticed I was charged twice for this month\'s subscription. Please refund the duplicate charge.',
          type: 'billing',
          isSolved: true,
          userId: customers[1].id,
        },
      }),
      prisma.ticket.create({
        data: {
          name: 'Lisa Chen',
          email: 'lisa@techcorp.com',
          subject: 'Feature request: Dark mode',
          description:
            'Would love to see a dark mode option in the dashboard. It would be easier on the eyes for night shifts.',
          type: 'feature',
          isSolved: false,
          userId: customers[2].id,
        },
      }),
      prisma.ticket.create({
        data: {
          name: 'David Martinez',
          email: 'david@business.net',
          subject: 'How to export data?',
          description:
            'I need to export all my support tickets and customer data. Is there an export function available?',
          type: 'general',
          isSolved: true,
          userId: customers[3].id,
        },
      }),
      prisma.ticket.create({
        data: {
          name: 'Sophie Laurent',
          email: 'sophie@creative.studio',
          subject: 'Dashboard loading slow',
          description:
            'The dashboard takes 5+ seconds to load. Is this normal? My connection is 100Mbps.',
          type: 'bug',
          isSolved: false,
          userId: customers[4].id,
        },
      }),
    ]);

    // 5. Create Replies to Tickets
    await Promise.all([
      // Replies to ticket 1
      prisma.reply.create({
        data: {
          body: 'Hi Emma! Can you please share your API key (masked) and the exact error message you\'re seeing? This will help me diagnose the issue quickly.',
          ticketId: tickets[0].id,
          userId: agent1.id,
        },
      }),
      prisma.reply.create({
        data: {
          body: 'The issue was in your API key format. I\'ve updated it and sent you the correct credentials. Everything should work now!',
          ticketId: tickets[0].id,
          userId: agent1.id,
        },
      }),
      prisma.reply.create({
        data: {
          body: 'Thanks so much! The new key works perfectly. Issue resolved!',
          ticketId: tickets[0].id,
          userId: customers[0].id,
        },
      }),

      // Replies to ticket 2
      prisma.reply.create({
        data: {
          body: 'John, I apologize for the duplicate charge. I\'ve processed a full refund which should appear in your account within 2-3 business days.',
          ticketId: tickets[1].id,
          userId: agent2.id,
        },
      }),
      prisma.reply.create({
        data: {
          body: 'Perfect! Thank you for the quick resolution. I appreciate the excellent support!',
          ticketId: tickets[1].id,
          userId: customers[1].id,
        },
      }),

      // Replies to ticket 3
      prisma.reply.create({
        data: {
          body: 'Great suggestion, Lisa! Dark mode is actually on our roadmap for Q2. We\'ll notify you when it\'s released. Thanks for the feedback!',
          ticketId: tickets[3].id,
          userId: agent1.id,
        },
      }),

      // Replies to ticket 4
      prisma.reply.create({
        data: {
          body: 'David, yes! Go to Settings > Export Data to download all your tickets in CSV or JSON format. Let me know if you need help with this!',
          ticketId: tickets[3].id,
          userId: agent2.id,
        },
      }),
      prisma.reply.create({
        data: {
          body: 'Found it! That\'s exactly what I needed. Thanks for your help!',
          ticketId: tickets[3].id,
          userId: customers[3].id,
        },
      }),
    ]);

    // 6. Create Demo Problems (Common Issues)
    const problems = await Promise.all([
      prisma.problems.create({
        data: {
          subject: 'How to reset my password?',
          type: 'account',
          description:
            'Complete guide to resetting your password if you forgot it or want to change it for security.',
          isSolved: true,
          solution:
            '1. Click "Forgot Password" on login page\n2. Enter your email\n3. Check your email for reset link\n4. Click link and create new password\n5. Login with new password',
          userId: adminUser.id,
        },
      }),
      prisma.problems.create({
        data: {
          subject: 'API rate limits explained',
          type: 'technical',
          description:
            'Understanding rate limits and how they affect your API requests.',
          isSolved: true,
          solution:
            'Free tier: 1000 req/hour\nPro tier: 10000 req/hour\nEnterprise: Custom limits\n\nRate limits are per API key, not per account.',
          userId: adminUser.id,
        },
      }),
      prisma.problems.create({
        data: {
          subject: 'Mobile app not syncing',
          type: 'bug',
          description: 'Mobile app failing to sync data with cloud',
          isSolved: true,
          solution:
            '1. Update app to latest version\n2. Clear app cache (Settings > Storage)\n3. Sign out and sign back in\n4. Check internet connection\n\nIf issue persists, reinstall the app.',
          userId: adminUser.id,
        },
      }),
      prisma.problems.create({
        data: {
          subject: 'Integrations not working',
          type: 'technical',
          description: 'Third-party integrations failing to connect',
          isSolved: false,
          solution: null,
          userId: adminUser.id,
        },
      }),
    ]);

    // Return seed data summary
    res.status(200).json({
      success: true,
      message: 'Database initialized with demo data',
      data: {
        admin: { email: adminUser.email, password: 'Demo@12345' },
        agent: { email: agent1.email, password: 'Agent@12345' },
        customer: { email: customers[0].email, password: 'Demo@12345' },
        stats: {
          users: 8,
          agents: 2,
          customers: 5,
          tickets: 5,
          problems: 4,
          totalReplies: 8,
        },
        testAccounts: {
          admin: { email: 'admin@dernsupport.demo', password: 'Admin@12345' },
          agent: { email: 'sarah@dernsupport.demo', password: 'Agent@12345' },
          customer: { email: 'emma@example.com', password: 'Demo@12345' },
        },
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize database',
      error: error.message,
    });
  }
});

/**
 * Reset database (for demo purposes)
 * POST /seed/reset
 */
router.post('/reset', async (req, res) => {
  try {
    // Warning: This will delete all data
    await prisma.reply.deleteMany({});
    await prisma.images.deleteMany({});
    await prisma.ticket.deleteMany({});
    await prisma.problems.deleteMany({});
    await prisma.user.deleteMany({});

    res.json({
      success: true,
      message: 'Database reset successfully. Run /seed/initialize to add demo data.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get seed data stats
 * GET /seed/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      users: await prisma.user.count(),
      tickets: await prisma.ticket.count(),
      problems: await prisma.problems.count(),
      replies: await prisma.reply.count(),
      images: await prisma.images.count(),
      solvedTickets: await prisma.ticket.count({ where: { isSolved: true } }),
      solvedProblems: await prisma.problems.count({
        where: { isSolved: true },
      }),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
