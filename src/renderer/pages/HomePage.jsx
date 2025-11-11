import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Input,
  IconButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import useToast from '../hooks/useToast';

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsList = await window.electronAPI.getProjects();
      setProjects(projectsList);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Erro ao carregar projetos. Tente novamente.');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.warning('Por favor, digite um nome para o projeto');
      return;
    }

    try {
      await window.electronAPI.createProject({
        name: newProjectName,
        color: getRandomColor(),
        icon: getRandomIcon(),
        createdAt: new Date().toISOString()
      });

      toast.success(`Projeto "${newProjectName}" criado com sucesso!`);
      setNewProjectName('');
      onClose();
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erro ao criar projeto. Tente novamente.');
    }
  };

  const handleStartSession = async (project) => {
    try {
      await window.electronAPI.startTimer({ projectId: project.id });
      toast.pomodoroStarted(project.name);
      navigate('/timer');
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Erro ao iniciar sessão. Tente novamente.');
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} p={8}>
      <VStack spacing={8} maxW="1200px" mx="auto">
        {/* Header */}
        <VStack spacing={2}>
          <Heading size="2xl" bgGradient="linear(to-r, red.400, orange.400)" bgClip="text">
            🍅 Pomodoro Extreme
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Escolha um projeto para começar sua sessão de foco
          </Text>
        </VStack>

        {/* Projects Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
          {projects.map((project) => (
            <Box
              key={project.id}
              bg={cardBg}
              p={6}
              borderRadius="xl"
              shadow="md"
              borderLeft="4px"
              borderColor={project.color}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                shadow: 'xl',
                transform: 'translateY(-4px)'
              }}
              onClick={() => handleStartSession(project)}
            >
              <VStack align="start" spacing={3}>
                <Text fontSize="4xl">{project.icon}</Text>
                <Heading size="md">{project.name}</Heading>
                <HStack spacing={4} fontSize="sm" color="gray.500">
                  <Text>0 pomodoros</Text>
                  <Text>•</Text>
                  <Text>0h focado</Text>
                </HStack>
              </VStack>
            </Box>
          ))}

          {/* Botão Novo Projeto */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            shadow="md"
            border="2px dashed"
            borderColor="gray.400"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              borderColor: 'green.400',
              shadow: 'xl'
            }}
            onClick={onOpen}
            display="flex"
            alignItems="center"
            justifyContent="center"
            minH="180px"
          >
            <VStack spacing={2} color="gray.500">
              <AddIcon boxSize={8} />
              <Text fontWeight="semibold">Novo Projeto</Text>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Footer Actions */}
        <HStack spacing={4} pt={4}>
          <Button
            leftIcon={<SettingsIcon />}
            variant="ghost"
            onClick={() => navigate('/settings')}
          >
            Configurações
          </Button>
          <Button
            leftIcon={<Text>📊</Text>}
            variant="ghost"
            onClick={() => navigate('/stats')}
          >
            Estatísticas
          </Button>
          <Button
            leftIcon={<Text>🏆</Text>}
            variant="ghost"
            onClick={() => navigate('/achievements')}
          >
            Conquistas
          </Button>
        </HStack>
      </VStack>

      {/* Modal Criar Projeto */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Novo Projeto</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Nome do projeto (ex: Estudos, Trabalho, etc.)"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                size="lg"
                autoFocus
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleCreateProject}
              isDisabled={!newProjectName.trim()}
            >
              Criar Projeto
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// Helper functions
function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomIcon() {
  const icons = ['🚀', '💻', '📚', '🎨', '🎯', '💡', '🔥', '⚡', '🌟', '🎮'];
  return icons[Math.floor(Math.random() * icons.length)];
}

export default HomePage;
