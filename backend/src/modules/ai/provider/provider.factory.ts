import { AiProvider } from './ai-provider.interface.js';
import { OpenRouterProvider } from './openrouter.provider.js';

export class ProviderFactory {
  private static instance: AiProvider | null = null;

  public static getProvider(): AiProvider {
    if (!this.instance) {
      const providerType = process.env.AI_PROVIDER || 'openrouter';
      switch (providerType.toLowerCase()) {
        case 'openrouter':
        default:
          this.instance = new OpenRouterProvider();
          break;
      }
    }
    return this.instance;
  }
}
