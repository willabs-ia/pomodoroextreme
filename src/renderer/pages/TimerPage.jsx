import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Badge,
  Progress,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import FlipClock from '../components/FlipClock/FlipClock';
import useTimer from '../hooks/useTimer';

function TimerPage() {
  const {
    isRunning,
    isPaused,
    timeRemaining,
    type,
    pomodorosCompleted,
    currentProject,
    percentage,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  } = useTimer();

  // Cor do tema baseado no tipo de timer
  const timerColor = type === 'focus'
    ? 'pomodoro.focus'
    : type === 'shortBreak' || type === 'longBreak'
    ? 'pomodoro.break'
    : 'gray.500';

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const getTimerLabel = () => {
    if (!type) return '⏱️ AGUARDANDO';
    if (type === 'focus') return '🎯 FOCO';
    if (type === 'shortBreak') return '☕ PAUSA CURTA';
    if (type === 'longBreak') return '🌟 PAUSA LONGA';
    return '⏱️ TIMER';
  };

  const handleStartClick = () => {
    if (currentProject) {
      startTimer(currentProject.id);
    } else {
      // TODO: Navegar para seleção de projeto
      console.log('Selecione um projeto primeiro');
    }
  };

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <VStack spacing={6} w="full" maxW="500px">
        {/* Badge do tipo de timer */}
        <Badge
          fontSize="lg"
          px={4}
          py={2}
          borderRadius="full"
          colorScheme={type === 'focus' ? 'red' : 'green'}
        >
          {getTimerLabel()}
        </Badge>

        {/* FlipClock - Display principal */}
        <Box
          bg={cardBg}
          p={8}
          borderRadius="2xl"
          shadow="2xl"
          w="full"
        >
          <FlipClock
            timeRemaining={timeRemaining || 0}
            type={type || 'focus'}
          />
        </Box>

        {/* Barra de progresso */}
        <Progress
          value={percentage || 0}
          w="full"
          h={3}
          borderRadius="full"
          colorScheme={type === 'focus' ? 'red' : 'green'}
          hasStripe
          isAnimated={isRunning}
        />

        {/* Controles */}
        <HStack spacing={4}>
          {!isRunning ? (
            <Button
              size="lg"
              colorScheme="green"
              onClick={handleStartClick}
              leftIcon={<Text>▶️</Text>}
              px={8}
            >
              Iniciar
            </Button>
          ) : isPaused ? (
            <Button
              size="lg"
              colorScheme="blue"
              onClick={resumeTimer}
              leftIcon={<Text>▶️</Text>}
              px={8}
            >
              Retomar
            </Button>
          ) : (
            <Button
              size="lg"
              colorScheme="yellow"
              onClick={pauseTimer}
              leftIcon={<Text>⏸️</Text>}
              px={8}
            >
              Pausar
            </Button>
          )}

          {isRunning && (
            <Button
              size="lg"
              colorScheme="red"
              variant="outline"
              onClick={stopTimer}
              leftIcon={<Text>⏹️</Text>}
            >
              Parar
            </Button>
          )}
        </HStack>

        {/* Informações da sessão */}
        <HStack
          spacing={8}
          bg={cardBg}
          p={4}
          borderRadius="xl"
          w="full"
          justify="space-around"
        >
          <VStack spacing={1}>
            <Text fontSize="sm" color="gray.500">
              Pomodoros Hoje
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={timerColor}>
              {pomodorosCompleted || 0}
            </Text>
          </VStack>

          <VStack spacing={1}>
            <Text fontSize="sm" color="gray.500">
              Projeto
            </Text>
            <Text fontSize="lg" fontWeight="semibold">
              {currentProject?.name || 'Nenhum'}
            </Text>
          </VStack>
        </HStack>

        {/* Informação do projeto atual */}
        {currentProject && (
          <Box
            bg={cardBg}
            p={3}
            borderRadius="lg"
            w="full"
            borderLeft="4px"
            borderColor={timerColor}
          >
            <HStack>
              <Text fontSize="2xl">{currentProject.icon}</Text>
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="bold">
                  {currentProject.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Sessão ativa
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default TimerPage;
