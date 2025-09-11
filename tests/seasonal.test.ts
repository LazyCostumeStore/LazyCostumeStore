import {render, screen} from '@testing-library/react';
import {getCurrentSeason, getSeasonalTheme, SEASONAL_THEMES} from '~/lib/seasonal';

describe('Seasonal Theme System', () => {
  test('should return default season for normal dates', () => {
    // Mock a date outside seasonal periods
    const mockDate = new Date('2024-06-15'); // June 15, not in any seasonal period
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    const currentSeason = getCurrentSeason();
    expect(currentSeason).toBe('default');
    
    jest.restoreAllMocks();
  });

  test('should return halloween for October dates', () => {
    const mockDate = new Date('2024-10-15'); // October 15, in Halloween period
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    const currentSeason = getCurrentSeason();
    expect(currentSeason).toBe('halloween');
    
    jest.restoreAllMocks();
  });

  test('should return christmas for December dates', () => {
    const mockDate = new Date('2024-12-15'); // December 15, in Christmas period
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    const currentSeason = getCurrentSeason();
    expect(currentSeason).toBe('christmas');
    
    jest.restoreAllMocks();
  });

  test('should return correct theme data for each season', () => {
    SEASONAL_THEMES.forEach(theme => {
      const retrievedTheme = getSeasonalTheme(theme.id);
      expect(retrievedTheme).toEqual(theme);
      expect(retrievedTheme.colors).toBeDefined();
      expect(retrievedTheme.assets).toBeDefined();
      expect(retrievedTheme.styles).toBeDefined();
    });
  });

  test('should have all required theme properties', () => {
    SEASONAL_THEMES.forEach(theme => {
      expect(theme).toHaveProperty('id');
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('period');
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('assets');
      expect(theme).toHaveProperty('styles');
      
      // Check colors
      expect(theme.colors).toHaveProperty('primary');
      expect(theme.colors).toHaveProperty('secondary');
      expect(theme.colors).toHaveProperty('accent');
      expect(theme.colors).toHaveProperty('background');
      
      // Check assets
      expect(theme.assets).toHaveProperty('headerLogo');
      expect(theme.assets).toHaveProperty('footerLogo');
      expect(theme.assets).toHaveProperty('backgroundImage');
      expect(theme.assets).toHaveProperty('heroImage');
      
      // Check styles
      expect(theme.styles).toHaveProperty('className');
    });
  });
});