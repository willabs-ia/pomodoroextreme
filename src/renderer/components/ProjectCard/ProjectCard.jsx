import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';

/**
 * ProjectCard - Card reutilizável para exibir projetos
 */
function ProjectCard({
  project,
  stats,
  onClick,
  onEdit,
  onDelete,
  onSettings,
  showMenu = true
}) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const handleCardClick = (e) => {
    // Não trigger onClick se clicou no menu
    if (e.target.closest('.project-menu')) return;
    if (onClick) onClick(project);
  };

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
      borderLeft="4px"
      borderColor={project.color || 'gray.400'}
      cursor="pointer"
      transition="all 0.2s"
      position="relative"
      _hover={{
        shadow: 'xl',
        transform: 'translateY(-4px)',
        bg: hoverBg
      }}
      onClick={handleCardClick}
    >
      {/* Menu de ações */}
      {showMenu && (
        <Box
          position="absolute"
          top={2}
          right={2}
          className="project-menu"
        >
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<SettingsIcon />}
              variant="ghost"
              size="sm"
              aria-label="Project options"
            />
            <MenuList>
              {onEdit && (
                <MenuItem icon={<EditIcon />} onClick={() => onEdit(project)}>
                  Editar Projeto
                </MenuItem>
              )}
              {onSettings && (
                <MenuItem icon={<SettingsIcon />} onClick={() => onSettings(project)}>
                  Configurações
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem
                  icon={<DeleteIcon />}
                  onClick={() => onDelete(project)}
                  color="red.500"
                >
                  Excluir Projeto
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Box>
      )}

      <VStack align="start" spacing={3}>
        {/* Ícone e Nome */}
        <HStack spacing={3}>
          <Text fontSize="4xl">{project.icon || '📁'}</Text>
          <VStack align="start" spacing={0}>
            <Heading size="md">{project.name}</Heading>
            {project.description && (
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {project.description}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* Estatísticas */}
        {stats && (
          <HStack spacing={4} fontSize="sm" color="gray.500" w="full">
            <VStack spacing={0} align="start">
              <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                {stats.totalPomodoros || 0}
              </Text>
              <Text fontSize="xs">pomodoros</Text>
            </VStack>

            <Text>•</Text>

            <VStack spacing={0} align="start">
              <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                {formatTime(stats.totalFocusTime || 0)}
              </Text>
              <Text fontSize="xs">focado</Text>
            </VStack>

            {stats.streak > 0 && (
              <>
                <Text>•</Text>
                <VStack spacing={0} align="start">
                  <Text fontWeight="semibold" color="orange.500">
                    🔥 {stats.streak}
                  </Text>
                  <Text fontSize="xs">dias</Text>
                </VStack>
              </>
            )}
          </HStack>
        )}

        {/* Tags (se houver) */}
        {project.tags && project.tags.length > 0 && (
          <HStack spacing={2} flexWrap="wrap">
            {project.tags.map((tag, i) => (
              <Text
                key={i}
                fontSize="xs"
                px={2}
                py={1}
                bg="gray.100"
                _dark={{ bg: 'gray.700' }}
                borderRadius="md"
              >
                {tag}
              </Text>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}

// Helper para formatar tempo
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export default ProjectCard;
