import { Flex, Box, VStack, Link } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';
import React from 'react';
import { useI18n } from '../i18n';

const LocaleSwitcher = () => {
  const { locale, setLocale } = useI18n();
  return (
    <Box mt={4}>
      <button onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}>
        {locale === 'en' ? 'Español' : 'English'}
      </button>
    </Box>
  );
};

const Sidebar = () => (
  <VStack
    as="nav"
    bg="gray.100"
    p={4}
    w={{ base: '100vw', md: '200px' }}
    spacing={4}
    align="stretch"
    minH="100vh"
    position={{ base: 'fixed', md: 'static' }}
    top={0}
    left={0}
    zIndex={10}
    boxShadow={{ base: 'md', md: 'none' }}
  >
    <Link as={NavLink} to="/" _activeLink={{ fontWeight: 'bold', color: 'brand.500' }}>
      Brand Kit
    </Link>
    <Link as={NavLink} to="/settings" _activeLink={{ fontWeight: 'bold', color: 'brand.500' }}>
      Settings
    </Link>
    <LocaleSwitcher />
  </VStack>
);

const Layout = () => (
  <Flex direction="row">
    <Sidebar />
    <Box flex="1" p={4} overflow="auto">
      <Outlet />
    </Box>
  </Flex>
);

export default Layout;