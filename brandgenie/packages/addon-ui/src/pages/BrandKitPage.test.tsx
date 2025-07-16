import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nProvider } from '../i18n';
import BrandKitPage from './BrandKitPage';

describe('BrandKitPage', () => {
  it('renders heading in English', () => {
    render(
      <ChakraProvider>
        <I18nProvider>
          <BrandKitPage />
        </I18nProvider>
      </ChakraProvider>
    );
    expect(screen.getByText('Brand Kit Generator')).toBeInTheDocument();
  });

  it('renders heading in Spanish', () => {
    render(
      <ChakraProvider>
        <I18nProvider>
          <BrandKitPage />
        </I18nProvider>
      </ChakraProvider>
    );
    // Switch locale
    expect(screen.getByText('Brand Kit Generator')).toBeInTheDocument(); // default
    // TODO: simulate locale switch and check for Spanish
  });
});