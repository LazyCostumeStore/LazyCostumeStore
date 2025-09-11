# Seasonal Assets

This directory contains seasonal-specific assets for the LazyCostumeStore storefront.

## Directory Structure

- `halloween/` - Halloween-themed assets (October-November)
- `christmas/` - Christmas-themed assets (December)
- `valentine/` - Valentine's Day-themed assets (February)
- `easter/` - Easter-themed assets (March-April)
- `default/` - Default theme assets (year-round)

## Asset Types

Each seasonal directory should contain:

- `logo-[season].svg` - Header logo
- `footer-logo-[season].svg` - Footer logo  
- `background-[season].jpg` - Background image
- `hero-[season].jpg` - Hero section image

## Usage

Assets are automatically loaded based on the current season as detected by the seasonal theme system in `app/lib/seasonal.ts`.

To add new seasonal assets:

1. Create the appropriately named files in the seasonal directory
2. Update the asset paths in `app/lib/seasonal.ts` if needed
3. Ensure images are optimized for web (WebP preferred)
4. Include appropriate alt text in the theme configuration