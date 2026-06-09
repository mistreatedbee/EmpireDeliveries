export const linking = {
  prefixes: ['empire://', 'https://empiredeliveries.co.za'],
  config: {
    screens: {
      '(auth)': {
        screens: {
          'reset-password': 'reset-password',
          login: 'login',
        },
      },
      '(customer)': {
        screens: {
          '(home)': {
            screens: {
              restaurant: 'restaurant/:id',
            },
          },
          '(orders)': {
            screens: {
              tracking: 'order/:id',
            },
          },
        },
      },
      '(modals)': {
        screens: {
          'payment-success': 'payment/success',
          checkout: 'payment/cancelled',
        },
      },
    },
  },
};
