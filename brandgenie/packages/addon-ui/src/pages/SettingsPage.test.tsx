import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nProvider } from '../i18n';
import SettingsPage from './SettingsPage';

describe('SettingsPage', () => {
  it('renders settings heading', () => {
    render(
      <ChakraProvider>
        <I18nProvider>
          <SettingsPage />
        </I18nProvider>
      </ChakraProvider>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});