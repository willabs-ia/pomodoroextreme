import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Progress, Button, HStack } from '@chakra-ui/react';
import FlipClock from '../components/FlipClock/FlipClock';
import SkipDialog from '../components/SkipDialog/SkipDialog';
import useTimer from '../hooks/useTimer';
import '../styles/BlockPage.css';

function BlockPage() {
  const { timeRemaining, type, skipBreak, blockLevel } = useTimer();
  const [currentPhrase, setCurrentPhrase] = useState('Hora de descansar! 😊');
  const [currentActivity, setCurrentActivity] = useState('Beba água');
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const activities = [
    '💧 Beba água',
    '🚶 Levante e caminhe',
    '🙆 Alongue o pescoço e ombros',
    '👀 Olhe para longe por 20 segundos',
    '🧘 Respire fundo 5 vezes',
    '🍎 Coma uma fruta',
    '🪟 Olhe pela janela'
  ];

  useEffect(() => {
    // Rotate activities
    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setCurrentActivity(randomActivity);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSkipBreak = () => {
    setShowSkipDialog(true);
  };

  const handleSkipConfirm = async (data) => {
    const result = await skipBreak(data.justification || 'Usuário pulou pausa');
    setShowSkipDialog(false);

    if (!result.success) {
      console.log('Não foi possível pular a pausa:', result.reason);
    }
  };

  const handleSkipCancel = () => {
    setShowSkipDialog(false);
  };

  return (
    <Box
      minH="100vh"
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <VStack spacing={8} p={8} maxW="600px" w="full">
        {/* Título */}
        <Text fontSize="4xl" fontWeight="bold" color="green.400">
          ☕ Pausa para Descanso
        </Text>

        <Text fontSize="xl" color="gray.300" textAlign="center">
          {currentPhrase}
        </Text>

        {/* FlipClock */}
        <Box
          bg="gray.800"
          p={8}
          borderRadius="2xl"
          shadow="2xl"
          w="full"
        >
          <FlipClock
            timeRemaining={timeRemaining || 0}
            type="break"
          />
        </Box>

        {/* Barra de progresso */}
        <Progress
          value={timeRemaining ? (timeRemaining / (5 * 60)) * 100 : 0}
          w="full"
          h={3}
          borderRadius="full"
          colorScheme="green"
          hasStripe
          isAnimated
        />

        {/* Sugestões de atividades */}
        <VStack
          spacing={4}
          bg="gray.800"
          p={6}
          borderRadius="xl"
          w="full"
        >
          <Text fontSize="lg" fontWeight="semibold" color="green.300">
            Enquanto isso...
          </Text>
          <Text fontSize="2xl" color="white">
            {currentActivity}
          </Text>
        </VStack>

        {/* Botão de skip (se permitido) */}
        <Button
          colorScheme="orange"
          variant="outline"
          size="lg"
          onClick={handleSkipBreak}
        >
          Tentar Pular Pausa
        </Button>

        {/* Footer */}
        <Text fontSize="md" color="gray.400" textAlign="center">
          Relaxe! Seu corpo e mente agradecem 🌟
        </Text>
      </VStack>

      {/* Music player placeholder */}
      <Box position="absolute" bottom={8} right={8}>
        <Button
          size="lg"
          borderRadius="full"
          colorScheme="purple"
          shadow="xl"
        >
          🎵
        </Button>
      </Box>

      {/* Skip Dialog */}
      <SkipDialog
        blockLevel={blockLevel || 'soft'}
        onConfirm={handleSkipConfirm}
        onCancel={handleSkipCancel}
      />
    </Box>
  );
}

export default BlockPage;
