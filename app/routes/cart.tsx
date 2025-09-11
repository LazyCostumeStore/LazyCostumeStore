import {type ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {CartForm} from '@shopify/hydrogen';
import {useActionData, type MetaFunction} from '@remix-run/react';
import {CartMain} from '~/components/CartMain';

export const meta: MetaFunction = () => {
  return [{title: `LazyCostumeStore | Cart`}];
};

export async function action({request, context}: ActionFunctionArgs) {
  const {session, cart} = context;

  const [formData, storefrontHeaders] = await Promise.all([
    request.formData(),
    context.storefront.getPublicTokenHeaders(),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);
  headers.append('Set-Cookie', await session.commit());

  const {cart: cartResult, errors, userErrors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      userErrors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="cart-page">
      <div className="container-fluid py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <CartMain layout="page" cart={actionData?.cart} />
      </div>
    </div>
  );
}

type CartQueryDataReturn = {
  cart: any;
  errors?: any;
  userErrors?: any;
};