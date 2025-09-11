import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'aside' | 'page';
};

export function CartMain({cart, layout}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);

  return (
    <div className={`cart-main ${layout === 'page' ? 'w-full' : ''}`}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({
  cart,
  layout,
}: {
  cart: CartMainProps['cart'];
  layout: CartMainProps['layout'];
}) {
  if (!cart || !cart.lines?.nodes?.length) return null;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {cart?.cost?.subtotalAmount?.amount && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartLines({
  layout,
  lines: linesObj,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!linesObj) return null;

  const {nodes: lines} = linesObj;

  return (
    <div aria-labelledby="cart-lines">
      <ul className="space-y-4">
        {lines.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartApiQueryFragment['lines']['nodes'][0];
}) {
  if (!line?.id) return null;

  const {id, quantity, merchandise} = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  return (
    <li key={id} className="cart-line flex items-center space-x-4 p-4 border rounded-lg">
      {merchandise.image && (
        <img
          alt={merchandise.image.altText || 'Product image'}
          src={merchandise.image.url}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="font-medium">{merchandise.product.title}</h3>
        {merchandise.title !== merchandise.product.title && (
          <p className="text-sm text-gray-600">{merchandise.title}</p>
        )}
        <CartLinePrice line={line} as="span" />
      </div>
      <CartLineQuantity line={line} />
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="cart-checkout-actions">
      <a
        href={checkoutUrl}
        target="_self"
        className="btn btn-primary w-full"
      >
        Continue to Checkout &rarr;
      </a>
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout: CartMainProps['layout'];
}) {
  return (
    <div className={`cart-empty ${hidden ? 'hidden' : ''}`}>
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <a href="/collections" className="btn btn-primary">
          Continue Shopping
        </a>
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="cart-discounts">
      <dl className="grid">
        {codes.map((code) => (
          <div key={code} className="flex justify-between">
            <dt className="font-medium">Discount</dt>
            <dd className="font-medium">-{code}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartApiQueryFragment['lines']['nodes'][0];
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className="cart-line-price" {...passthroughProps}>
      <Money data={moneyV2} />
    </div>
  );
}

function CartLineQuantity({line}: {line: CartApiQueryFragment['lines']['nodes'][0]}) {
  if (!line || typeof line?.quantity === 'undefined') return null;

  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity flex items-center space-x-2">
      <small className="text-sm text-gray-600">Qty: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          type="submit"
          value={prevQuantity}
          className="btn btn-ghost w-8 h-8 p-0 disabled:opacity-50"
        >
          <span>&#8722;</span>
        </button>
      </CartLineUpdateButton>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          type="submit"
          value={nextQuantity}
          className="btn btn-ghost w-8 h-8 p-0"
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} />
    </div>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: Array<{id: string; quantity: number}>;
}) {
  return (
    <form action="/cart" method="post">
      <input name="cartAction" type="hidden" value="UPDATE" />
      <input name="lines" type="hidden" value={JSON.stringify(lines)} />
      {children}
    </form>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <form action="/cart" method="post">
      <input name="cartAction" type="hidden" value="REMOVE" />
      <input name="linesIds" type="hidden" value={JSON.stringify(lineIds)} />
      <button
        aria-label="Remove from cart"
        type="submit"
        className="text-red-600 hover:text-red-800 ml-2"
      >
        Remove
      </button>
    </form>
  );
}

function CartSummary({
  children,
  cost,
  layout,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  return (
    <div className="cart-summary">
      <dl className="grid">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? <Money data={cost?.subtotalAmount} /> : '-'}
          </dd>
        </div>
      </dl>
      {children}
    </div>
  );
}

function Money({data}: {data: {currencyCode: string; amount: string}}) {
  return (
    <span className="money">
      {data ? `${data.currencyCode} ${data.amount}` : '-'}
    </span>
  );
}