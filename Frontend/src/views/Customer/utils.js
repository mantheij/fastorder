import Cookies from 'js-cookie';

// Utility to load cart from cookies
export const loadCartFromCookies = (tableId) => {
    const loadedCart = Cookies.get(`cart_${tableId}`);
    return loadedCart ? JSON.parse(loadedCart) : [];
};

// Utility to save cart to cookies
export const saveCartToCookies = (tableId, cart) => {
    Cookies.set(`cart_${tableId}`, JSON.stringify(cart), { expires: 7 });
};

// Utility to remove cart from cookies
export const removeCartFromCookies = (tableId) => {
    Cookies.remove(`cart_${tableId}`);
};