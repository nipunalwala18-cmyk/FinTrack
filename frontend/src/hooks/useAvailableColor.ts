import { useAccounts } from './useAccounts';

export const ACCOUNT_COLORS = [
  '#2563EB', // Blue
  '#16A34A', // Green
  '#9333EA', // Purple
  '#EA580C', // Orange
  '#0891B2', // Cyan
  '#DC2626', // Red
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#4F46E5', // Indigo
  '#0F766E', // Teal
];

export const useAvailableColor = () => {
  const { data: accounts = [] } = useAccounts();

  const getAvailableColor = (): string => {
    if (accounts.length === 0) {
      return ACCOUNT_COLORS[0];
    }

    const usedColors = new Set(
      accounts.map((acc) => acc.color?.toUpperCase()).filter(Boolean)
    );

    // Find the first unused color
    for (const color of ACCOUNT_COLORS) {
      if (!usedColors.has(color.toUpperCase())) {
        return color;
      }
    }

    // Recycle if all are used
    const index = accounts.length % ACCOUNT_COLORS.length;
    return ACCOUNT_COLORS[index];
  };

  return {
    color: getAvailableColor(),
  };
};
