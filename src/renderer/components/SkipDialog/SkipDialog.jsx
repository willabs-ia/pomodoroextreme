import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Box,
  Badge
} from '@chakra-ui/react';
import { WarningIcon, LockIcon } from '@chakra-ui/icons';

/**
 * SkipDialog - Modal para lidar com tentativas de pular pausa
 *
 * 3 níveis de bloqueio:
 * - Soft: 3 mensagens desmotivadoras + justificativa obrigatória
 * - Medium: Sistema de penalidade 3x (5min → 15min → 45min → 135min) com 3 tentativas
 * - Extreme: Impossível pular - sem escapatória
 */
function SkipDialog({ blockLevel = 'soft', onConfirm, onCancel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [justification, setJustification] = useState('');
  const [penaltyInfo, setPenaltyInfo] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);

  // Mensagens desmotivadoras para nível Soft
  const demotivatingMessages = [
    {
      title: '🤔 Você realmente precisa fazer isso?',
      message: 'Pausas são essenciais para sua produtividade. Pular pausas é como correr uma maratona sem água.',
      emoji: '💦'
    },
    {
      title: '😰 Seu cérebro está implorando por descanso',
      message: 'Estudos mostram que trabalhar sem pausas reduz sua eficiência em até 40%. Vale a pena?',
      emoji: '📉'
    },
    {
      title: '🚨 Última chance de reconsiderar',
      message: 'Burnout não é produtividade. Cuidar de si mesmo é parte do trabalho inteligente.',
      emoji: '🧠'
    }
  ];

  useEffect(() => {
    // Listen to skip dialog events from main process
    const handleShowMessage = ({ message }) => {
      setMessageHistory((prev) => [...prev, message]);
      setCurrentMessageIndex((prev) => prev + 1);
      setIsOpen(true);
    };

    const handleRequestJustification = () => {
      setIsOpen(true);
    };

    window.electronAPI?.onSkipShowMessage?.(handleShowMessage);
    window.electronAPI?.onSkipRequestJustification?.(handleRequestJustification);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSoftSkip = () => {
    if (currentMessageIndex < 3) {
      // Ainda não mostrou todas as mensagens
      setCurrentMessageIndex(currentMessageIndex + 1);
    } else {
      // Já mostrou todas, pedir justificativa
      if (!justification.trim() || justification.trim().length < 20) {
        return; // Justificativa muito curta
      }

      // Enviar justificativa
      window.electronAPI?.sendSkipJustification?.(justification);
      handleClose();
      if (onConfirm) onConfirm({ justification });
    }
  };

  const handleMediumSkip = () => {
    // Confirmar skip com penalidade
    window.electronAPI?.sendSkipMessageResponse?.(true);
    handleClose();
    if (onConfirm) onConfirm({ acceptPenalty: true });
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentMessageIndex(0);
    setJustification('');
    setMessageHistory([]);
    if (onCancel) onCancel();
  };

  const handleCancel = () => {
    window.electronAPI?.sendSkipMessageResponse?.(false);
    handleClose();
  };

  const renderSoftMode = () => {
    const currentMessage = demotivatingMessages[Math.min(currentMessageIndex, 2)];

    return (
      <>
        <ModalHeader>
          <HStack spacing={3}>
            <Text fontSize="3xl">{currentMessage.emoji}</Text>
            <Text>{currentMessage.title}</Text>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Mensagem desmotivadora */}
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertDescription fontSize="md">
                  {currentMessage.message}
                </AlertDescription>
              </Box>
            </Alert>

            {/* Progresso das mensagens */}
            <HStack justify="center" spacing={2}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={i <= currentMessageIndex ? 'orange.500' : 'gray.300'}
                />
              ))}
            </HStack>

            {/* Justificativa (aparece após 3 mensagens) */}
            {currentMessageIndex >= 2 && (
              <VStack spacing={3} align="stretch">
                <Text fontWeight="semibold">
                  Se você realmente precisa pular esta pausa, justifique abaixo (mínimo 20 caracteres):
                </Text>
                <Textarea
                  placeholder="Ex: Tenho uma reunião urgente que não posso adiar..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  minH="100px"
                  autoFocus
                />
                <Text fontSize="sm" color="gray.500">
                  {justification.length} / 20 caracteres mínimos
                </Text>
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleCancel}>
            Cancelar e Descansar
          </Button>
          <Button
            colorScheme="orange"
            onClick={handleSoftSkip}
            isDisabled={currentMessageIndex >= 2 && justification.trim().length < 20}
          >
            {currentMessageIndex < 2 ? 'Continuar' : 'Pular Pausa'}
          </Button>
        </ModalFooter>
      </>
    );
  };

  const renderMediumMode = () => {
    // Pegar info de penalidade do último skip
    const lastMessage = messageHistory[messageHistory.length - 1] || '';
    const penaltyMatch = lastMessage.match(/(\d+) minutos/);
    const penalty = penaltyMatch ? parseInt(penaltyMatch[1]) : 0;

    return (
      <>
        <ModalHeader>
          <HStack spacing={3}>
            <WarningIcon boxSize={6} color="red.500" />
            <Text>⚠️ Sistema de Penalidade Ativo</Text>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Alert de penalidade */}
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box flex={1}>
                <AlertTitle>Penalidade 3x Aplicada!</AlertTitle>
                <AlertDescription>
                  {lastMessage || 'Você está tentando pular a pausa. A penalidade será aplicada.'}
                </AlertDescription>
              </Box>
            </Alert>

            {/* Visual da penalidade */}
            {penalty > 0 && (
              <Box
                bg="red.50"
                p={6}
                borderRadius="lg"
                border="2px solid"
                borderColor="red.300"
              >
                <VStack spacing={3}>
                  <Text fontSize="4xl" fontWeight="bold" color="red.600">
                    +{penalty} minutos
                  </Text>
                  <Text fontSize="sm" color="red.700" textAlign="center">
                    Sua próxima pausa será {penalty} minutos mais longa.
                    A próxima tentativa triplicará novamente!
                  </Text>
                </VStack>
              </Box>
            )}

            {/* Explicação do sistema */}
            <Box bg="gray.100" p={4} borderRadius="md">
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Como funciona o sistema 3x:
              </Text>
              <VStack align="start" spacing={1} fontSize="sm">
                <Text>• 1ª tentativa: +15 min (5 min × 3)</Text>
                <Text>• 2ª tentativa: +45 min (15 min × 3)</Text>
                <Text>• 3ª tentativa: +135 min (45 min × 3)</Text>
              </VStack>
            </Box>

            <Text fontSize="sm" color="gray.600" textAlign="center">
              Tem certeza que quer aceitar esta penalidade?
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleCancel} colorScheme="green">
            Não, Vou Descansar
          </Button>
          <Button colorScheme="red" onClick={handleMediumSkip}>
            Aceitar Penalidade
          </Button>
        </ModalFooter>
      </>
    );
  };

  const renderExtremeMode = () => {
    return (
      <>
        <ModalHeader>
          <HStack spacing={3}>
            <LockIcon boxSize={6} color="red.600" />
            <Text>🚫 Modo Extremo Ativo</Text>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Mensagem final */}
            <Alert status="error" borderRadius="md" variant="solid">
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="lg">SEM ESCAPATÓRIA</AlertTitle>
                <AlertDescription>
                  Você escolheu o modo extremo. Não há como pular esta pausa.
                </AlertDescription>
              </Box>
            </Alert>

            {/* Frases sarcásticas */}
            <VStack spacing={3} bg="gray.800" p={6} borderRadius="lg" color="white">
              <Text fontSize="2xl" textAlign="center">
                🔒
              </Text>
              <Text fontSize="lg" fontWeight="bold" textAlign="center">
                "Suas escolhas te trouxeram até aqui"
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.300">
                Você literalmente pediu para isso acontecer ao ativar o modo extremo.
                Aproveite sua pausa forçada! 😊
              </Text>
            </VStack>

            <Box bg="blue.50" p={4} borderRadius="md">
              <Text fontSize="sm" fontWeight="semibold" mb={2} color="blue.800">
                💡 Sugestões para sua pausa:
              </Text>
              <VStack align="start" spacing={1} fontSize="sm" color="blue.700">
                <Text>• Beba um copo de água</Text>
                <Text>• Alongue os braços e pernas</Text>
                <Text>• Olhe para um ponto distante por 20 segundos</Text>
                <Text>• Respire fundo 5 vezes</Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose} isDisabled>
            Não há botão de pular aqui 🤷
          </Button>
        </ModalFooter>
      </>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={blockLevel === 'extreme' ? undefined : handleCancel}
      closeOnOverlayClick={blockLevel !== 'extreme'}
      closeOnEsc={blockLevel !== 'extreme'}
      size="lg"
      isCentered
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <ModalContent>
        {blockLevel === 'soft' && renderSoftMode()}
        {blockLevel === 'medium' && renderMediumMode()}
        {blockLevel === 'extreme' && renderExtremeMode()}
      </ModalContent>
    </Modal>
  );
}

export default SkipDialog;
