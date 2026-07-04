import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

async function bootstrap() {
  try {
    // Verify database connection
    console.log('🔄 Connecting to PostgreSQL database...');
    await prisma.$connect();
    console.log('✅ Database connection established successfully.');

    // Start Express Server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    // Graceful Shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🔄 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('🛑 Express server closed.');
        await prisma.$disconnect();
        console.log('🛑 Database connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to bootstrap the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
