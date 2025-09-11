import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, Outlet, useLoaderData, type MetaFunction} from '@remix-run/react';
import {getCurrentSeason, getSeasonalTheme} from '~/lib/seasonal';

export function shouldRevalidate() {
  return true;
}

export const meta: MetaFunction = () => {
  return [{title: 'Account'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {session} = context;
  const currentSeason = getCurrentSeason();
  const seasonalTheme = getSeasonalTheme(currentSeason);

  const customerAccessToken = await session.get('customerAccessToken');
  const isLoggedIn = Boolean(customerAccessToken?.accessToken);

  if (!isLoggedIn) {
    // If the user is not logged in, redirect them to the login page
    return redirect('/account/login');
  }

  return json({
    isLoggedIn,
    currentSeason,
    seasonalTheme,
  });
}

export default function Account() {
  const {seasonalTheme} = useLoaderData<typeof loader>();

  return (
    <div className="account">
      <div className="container-fluid py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ 
                fontFamily: seasonalTheme.styles.fontFamily,
                color: seasonalTheme.colors.primary 
              }}
            >
              My Account
            </h1>
          </header>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Account Navigation */}
            <nav className="md:col-span-1">
              <AccountMenu seasonalTheme={seasonalTheme} />
            </nav>

            {/* Account Content */}
            <main className="md:col-span-3">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountMenu({seasonalTheme}: {seasonalTheme: any}) {
  const menuItems = [
    {label: 'Profile', to: '/account/profile'},
    {label: 'Order History', to: '/account/orders'},
    {label: 'Addresses', to: '/account/addresses'},
    {label: 'Logout', to: '/account/logout'},
  ];

  return (
    <div className="account-menu space-y-2">
      {menuItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="block px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
          style={({isActive}: {isActive: boolean}) => ({
            backgroundColor: isActive ? seasonalTheme.colors.primary : 'transparent',
            color: isActive ? seasonalTheme.colors.background : 'inherit',
          })}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}