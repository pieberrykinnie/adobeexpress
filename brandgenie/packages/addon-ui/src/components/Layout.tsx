import { Flex, Box, VStack, Link } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';
import React from 'react';

const Sidebar = () => (
  <VStack
    as="nav"
    bg="gray.100"
    p={4}
    w="200px"
    spacing={4}
    align="stretch"
    minH="100vh"
  >
    <Link as={NavLink} to="/" _activeLink={{ fontWeight: 'bold', color: 'brand.500' }}>
      Brand Kit
    </Link>
    <Link as={NavLink} to="/settings" _activeLink={{ fontWeight: 'bold', color: 'brand.500' }}>
      Settings
    </Link>
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