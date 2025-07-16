import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/Layout';
import BrandKitPage from './pages/BrandKitPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BrandKitPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;