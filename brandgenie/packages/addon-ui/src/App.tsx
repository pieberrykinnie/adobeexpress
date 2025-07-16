import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/Layout';
import BrandKitPage from './pages/BrandKitPage';
import SettingsPage from './pages/SettingsPage';
import { BrandGuardProvider } from './contexts/BrandGuardContext';
import { useBrandGuard } from './hooks/useBrandGuard';

function App() {
  // activate linter once rules available
  useBrandGuard();
  return (
    <ChakraProvider theme={theme} resetCSS>
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
    </ChakraProvider>
  );
}

export default App;