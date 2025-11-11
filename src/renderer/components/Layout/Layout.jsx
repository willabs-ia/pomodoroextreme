import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, SettingsIcon } from '@chakra-ui/icons';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('white', 'gray.900');
  const sidebarBg = useColorModeValue('gray.50', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('red.50', 'red.900');
  const activeColor = useColorModeValue('red.600', 'red.300');

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Início', title: 'Home' },
    { path: '/stats', icon: '📊', label: 'Estatísticas', title: 'Stats' },
    { path: '/achievements', icon: '🏆', label: 'Conquistas', title: 'Achievements' },
    { path: '/settings', icon: '⚙️', label: 'Configurações', title: 'Settings' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Box
        w="80px"
        bg={sidebarBg}
        borderRight="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        py={4}
      >
        {/* Logo */}
        <VStack spacing={6}>
          <Box
            fontSize="2xl"
            cursor="pointer"
            onClick={() => navigate('/')}
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.1)' }}
          >
            🍅
          </Box>

          {/* Menu Items */}
          <VStack spacing={2} w="full" px={2}>
            {menuItems.map((item) => (
              <Tooltip key={item.path} label={item.label} placement="right" hasArrow>
                <Box
                  w="full"
                  p={3}
                  borderRadius="lg"
                  cursor="pointer"
                  transition="all 0.2s"
                  bg={isActive(item.path) ? activeBg : 'transparent'}
                  color={isActive(item.path) ? activeColor : 'inherit'}
                  _hover={{
                    bg: isActive(item.path) ? activeBg : hoverBg,
                    transform: 'translateX(2px)'
                  }}
                  onClick={() => navigate(item.path)}
                  textAlign="center"
                >
                  <Text fontSize="2xl">{item.icon}</Text>
                </Box>
              </Tooltip>
            ))}
          </VStack>
        </VStack>

        {/* Bottom Actions */}
        <VStack spacing={3} px={2}>
          {/* Color Mode Toggle */}
          <Tooltip label={colorMode === 'dark' ? 'Modo Claro' : 'Modo Escuro'} placement="right" hasArrow>
            <IconButton
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
              size="md"
            />
          </Tooltip>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} overflow="auto" bg={bgColor}>
        <Outlet />
      </Box>
    </Flex>
  );
}

export default Layout;
