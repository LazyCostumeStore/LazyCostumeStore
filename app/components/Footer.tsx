import type {SeasonalTheme} from '~/lib/seasonal';

type FooterProps = {
  menu?: {
    items: Array<{
      id: string;
      title: string;
      url: string;
    }>;
  };
  shop: {
    name: string;
    description: string;
  };
  seasonalTheme: SeasonalTheme;
};

export function Footer({menu, shop, seasonalTheme}: FooterProps) {
  return (
    <footer className={`mt-auto bg-gray-900 text-white ${seasonalTheme.styles.className}`}>
      <div className="container-fluid py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={seasonalTheme.assets.footerLogo} 
                alt={shop.name}
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h3 
                className="text-xl font-bold"
                style={{ 
                  fontFamily: seasonalTheme.styles.fontFamily,
                  color: seasonalTheme.colors.primary 
                }}
              >
                {shop.name}
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              {shop.description}
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" icon="facebook" />
              <SocialIcon href="#" icon="twitter" />
              <SocialIcon href="#" icon="instagram" />
              <SocialIcon href="#" icon="youtube" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: seasonalTheme.colors.primary }}>
              Quick Links
            </h4>
            <nav className="space-y-2">
              {(menu?.items || FALLBACK_FOOTER_MENU).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: seasonalTheme.colors.primary }}>
              Customer Service
            </h4>
            <nav className="space-y-2 text-sm">
              <a href="/pages/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </a>
              <a href="/pages/shipping" className="block text-gray-300 hover:text-white transition-colors">
                Shipping Info
              </a>
              <a href="/pages/returns" className="block text-gray-300 hover:text-white transition-colors">
                Returns & Exchanges
              </a>
              <a href="/pages/size-guide" className="block text-gray-300 hover:text-white transition-colors">
                Size Guide
              </a>
              <a href="/pages/faq" className="block text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: seasonalTheme.colors.primary }}>
              Stay Updated
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest costume trends and exclusive offers!
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                style={{ borderColor: `${seasonalTheme.colors.primary}33` }}
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded font-medium transition-colors"
                style={{ 
                  backgroundColor: seasonalTheme.colors.primary,
                  color: seasonalTheme.colors.background
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} {shop.name}. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="/policies/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/policies/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/policies/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({href, icon}: {href: string; icon: string}) {
  const iconPaths = {
    facebook: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
    twitter: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
  };

  return (
    <a
      href={href}
      className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d={iconPaths[icon as keyof typeof iconPaths]} />
      </svg>
    </a>
  );
}

const FALLBACK_FOOTER_MENU = [
  {
    id: '1',
    title: 'Home',
    url: '/',
  },
  {
    id: '2',
    title: 'Collections',
    url: '/collections',
  },
  {
    id: '3',
    title: 'About',
    url: '/pages/about',
  },
  {
    id: '4',
    title: 'Contact',
    url: '/pages/contact',
  },
];