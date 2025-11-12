import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  useDisclosure
} from '@chakra-ui/react';
import useToast from '../../hooks/useToast';

/**
 * SessionRecovery - Detecta e permite recuperar sessões interrompidas
 *
 * Quando o app é fechado/crash durante um timer, salva o estado.
 * Ao reabrir, oferece opção de continuar de onde parou.
 */
function SessionRecovery() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recoveryData, setRecoveryData] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Verificar se há sessão para recuperar
    checkForRecovery();
  }, []);

  const checkForRecovery = async () => {
    try {
      const data = await window.electronAPI.checkSessionRecovery?.();

      if (data && data.hasRecovery) {
        setRecoveryData(data);
        onOpen();
      }
    } catch (error) {
      console.error('Error checking session recovery:', error);
    }
  };

  const handleRestore = async () => {
    if (!recoveryData) return;

    setIsRestoring(true);

    try {
      // Restaurar sessão
      await window.electronAPI.restoreSession?.(recoveryData.sessionId);

      toast.success('Sessão restaurada com sucesso!');
      onClose();

      // Redirecionar para TimerPage se necessário
      // window.location.hash = '#/timer';
    } catch (error) {
      console.error('Error restoring session:', error);
      toast.error('Erro ao restaurar sessão. Tente novamente.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDiscard = async () => {
    try {
      // Descartar sessão salva
      await window.electronAPI.discardRecovery?.();

      toast.info('Sessão descartada');
      onClose();
    } catch (error) {
      console.error('Error discarding recovery:', error);
    }
  };

  if (!recoveryData) return null;

  const {
    project,
    type,
    timeRemaining,
    pomodorosCompleted,
    interruptedAt
  } = recoveryData;

  // Calcular quanto tempo passou desde a interrupção
  const timeElapsed = Date.now() - new Date(interruptedAt).getTime();
  const minutesElapsed = Math.floor(timeElapsed / 1000 / 60);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      size="lg"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Text fontSize="2xl">🔄</Text>
            <Text>Sessão Interrompida Detectada</Text>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Informação da sessão */}
            <VStack spacing={2} align="start">
              <Text fontSize="sm" color="gray.500">
                Detectamos que você estava em uma sessão quando o app foi fechado.
              </Text>

              <HStack spacing={3} mt={2}>
                <Badge colorScheme={type === 'focus' ? 'red' : 'green'} fontSize="md">
                  {type === 'focus' ? '🎯 Foco' : '☕ Pausa'}
                </Badge>

                {project && (
                  <Text fontWeight="semibold">
                    {project.icon} {project.name}
                  </Text>
                )}
              </HStack>
            </VStack>

            {/* Detalhes */}
            <VStack
              spacing={3}
              align="stretch"
              bg="gray.50"
              _dark={{ bg: 'gray.800' }}
              p={4}
              borderRadius="md"
            >
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                  Tempo Restante:
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  {formatTime(timeRemaining)}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                  Pomodoros Completados:
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="red.500">
                  {pomodorosCompleted} 🍅
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                  Interrompido há:
                </Text>
                <Text fontSize="sm">
                  {minutesElapsed < 1
                    ? 'Menos de 1 minuto'
                    : `${minutesElapsed} minuto${minutesElapsed !== 1 ? 's' : ''}`}
                </Text>
              </HStack>
            </VStack>

            {/* Aviso se muito tempo passou */}
            {minutesElapsed > 30 && (
              <Text fontSize="xs" color="orange.600" _dark={{ color: 'orange.400' }}>
                ⚠️ Passou bastante tempo desde a interrupção. Considere começar uma nova sessão.
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3} w="full" justify="space-between">
            <Button variant="ghost" onClick={handleDiscard} isDisabled={isRestoring}>
              Descartar
            </Button>

            <HStack spacing={2}>
              <Button variant="outline" onClick={onClose} isDisabled={isRestoring}>
                Decidir Depois
              </Button>
              <Button
                colorScheme="green"
                onClick={handleRestore}
                isLoading={isRestoring}
                loadingText="Restaurando..."
              >
                🔄 Continuar Sessão
              </Button>
            </HStack>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Helper para formatar tempo
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default SessionRecovery;
