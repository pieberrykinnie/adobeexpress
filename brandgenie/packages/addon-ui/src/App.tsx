import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/Layout';
import BrandKitPage from './pages/BrandKitPage';
import SettingsPage from './pages/SettingsPage';
import { BrandGuardProvider } from './contexts/BrandGuardContext';
import { useBrandGuard } from './hooks/useBrandGuard';
import { I18nProvider } from './i18n';

function App() {
  // activate linter once rules available
  useBrandGuard();
  return (
    <ChakraProvider theme={theme} resetCSS>
      <I18nProvider>
        <BrandGuardProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}> 
                <Route index element={<BrandKitPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </HashRouter>
        </BrandGuardProvider>
      </I18nProvider>
    </ChakraProvider>
  );
}

export default App;