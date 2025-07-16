import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#ebe8ff',
      100: '#c5c0f1',
      200: '#9f96e3',
      300: '#7a6dd7',
      400: '#5645cb',
      500: '#3c2bb1',
      600: '#2e218b',
      700: '#201664',
      800: '#120c3e',
      900: '#060218',
    },
  },
});

export default theme;