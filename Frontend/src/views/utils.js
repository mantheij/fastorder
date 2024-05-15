import Cookies from 'js-cookie';

// Utility to load cart from cookies
export const loadCartFromCookies = () => {
    const loadedCart = Cookies.get('cart');
    return loadedCart ? JSON.parse(loadedCart) : [];
};

// Utility to save cart to cookies
export const saveCartToCookies = (cart) => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
};

// Utility to remove cart from cookies
export const removeCartFromCookies = () => {
    Cookies.remove('cart');
};