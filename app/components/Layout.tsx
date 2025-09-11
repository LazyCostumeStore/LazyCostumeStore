import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {getCurrentSeason, getSeasonalTheme} from '~/lib/seasonal';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
  publicStoreDomain: string;
  shop: {
    name: string;
    description: string;
    primaryDomain?: {
      url: string;
    };
  };
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  shop,
}: LayoutProps) {
  const currentSeason = getCurrentSeason();
  const seasonalTheme = getSeasonalTheme(currentSeason);

  return (
    <div className={`min-h-screen flex flex-col ${seasonalTheme.styles.className}`}>
      <CartAside cart={cart} />
      <MobileMenuAside menu={header.menu} shop={shop} />
      
      <Header 
        header={header} 
        cart={cart} 
        isLoggedIn={isLoggedIn} 
        publicStoreDomain={publicStoreDomain}
        shop={shop}
        seasonalTheme={seasonalTheme}
      />
      
      <main 
        role="main" 
        id="mainContent" 
        className="flex-1"
        style={{
          backgroundImage: `url(${seasonalTheme.assets.backgroundImage})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm min-h-full">
          {children}
        </div>
      </main>
      
      <Suspense>
        <Await resolve={footer}>
          {(footer) => (
            <Footer 
              menu={footer?.menu} 
              shop={shop}
              seasonalTheme={seasonalTheme}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function MobileMenuAside({
  menu,
  shop,
}: {
  menu: HeaderQuery['menu'];
  shop: LayoutProps['shop'];
}) {
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Aside id="mobile-menu-aside" heading="MENU">
        <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
          {/* Primary navigation */}
          {(menu?.items || []).map((item) => (
            <span key={item.id} className="block">
              <a
                className="text-xl font-medium"
                href={item.url}
                target={item.url.includes('myshopify.com') ? '_self' : undefined}
                rel={item.url.includes('myshopify.com') ? undefined : 'noopener noreferrer'}
              >
                {item.title}
              </a>
            </span>
          ))}
        </nav>
      </Aside>
    )
  );
}

type FooterQuery = {
  menu?: {
    items: Array<{
      id: string;
      title: string;
      url: string;
    }>;
  };
};