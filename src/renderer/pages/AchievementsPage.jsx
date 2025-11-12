import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Progress,
  useColorModeValue,
  Tooltip,
  IconButton,
  Divider
} from '@chakra-ui/react';
import { LockIcon, UnlockIcon, InfoIcon } from '@chakra-ui/icons';
import useAchievements from '../hooks/useAchievements';

function AchievementsPage() {
  const {
    achievements,
    reputation,
    loading,
    getUnlockedAchievements,
    getLockedAchievements,
    getOverallProgress,
    getProgressToNextAchievement
  } = useAchievements();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const lockedBg = useColorModeValue('gray.100', 'gray.700');

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} p={8} display="flex" alignItems="center" justifyContent="center">
        <Text>Carregando conquistas...</Text>
      </Box>
    );
  }

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const overallProgress = getOverallProgress();
  const nextAchievement = getProgressToNextAchievement();

  return (
    <Box minH="100vh" bg={bgColor} p={8}>
      <VStack spacing={8} maxW="1400px" mx="auto" align="stretch">
        {/* Header */}
        <VStack align="start" spacing={2}>
          <Heading size="xl">🏆 Conquistas</Heading>
          <Text color="gray.500">
            Desbloqueie conquistas e suba de nível completando desafios
          </Text>
        </VStack>

        {/* Progresso Geral */}
        <Box bg={cardBg} p={8} borderRadius="2xl" shadow="xl">
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                  PROGRESSO GERAL
                </Text>
                <Heading size="2xl" bgGradient="linear(to-r, yellow.400, orange.400)" bgClip="text">
                  {overallProgress}%
                </Heading>
              </VStack>
              <VStack align="end" spacing={1}>
                <Badge fontSize="lg" px={4} py={2} borderRadius="full" colorScheme="yellow">
                  {unlockedAchievements.length} / {achievements.length}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  conquistas desbloqueadas
                </Text>
              </VStack>
            </HStack>

            <Progress
              value={overallProgress}
              size="lg"
              colorScheme="yellow"
              borderRadius="full"
              hasStripe
              isAnimated
            />

            {/* Próxima Conquista */}
            {nextAchievement && (
              <Box bg={lockedBg} p={4} borderRadius="lg">
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }}>
                    🎯 Próxima Conquista ({nextAchievement.progressPercent.toFixed(0)}%)
                  </Text>
                  <HStack w="full" justify="space-between">
                    <Text fontWeight="semibold">{nextAchievement.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {nextAchievement.progress} / {nextAchievement.target}
                    </Text>
                  </HStack>
                  <Progress
                    value={nextAchievement.progressPercent}
                    size="sm"
                    colorScheme="blue"
                    w="full"
                    borderRadius="full"
                  />
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Sistema de Reputação */}
        {reputation && (
          <Box bg={cardBg} p={8} borderRadius="2xl" shadow="xl">
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                    REPUTAÇÃO
                  </Text>
                  <Heading size="2xl" bgGradient="linear(to-r, purple.400, pink.400)" bgClip="text">
                    {reputation.level}
                  </Heading>
                </VStack>
                <VStack align="end" spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                    {reputation.points}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    pontos de reputação
                  </Text>
                </VStack>
              </HStack>

              <Progress
                value={(reputation.points / reputation.pointsToNext) * 100}
                size="lg"
                colorScheme="purple"
                borderRadius="full"
                hasStripe
                isAnimated
              />

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.500">
                  Rank #{reputation.rank} • Nível {reputation.rank}/{reputation.totalLevels}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {reputation.pointsToNext - reputation.points} pontos até <strong>{reputation.nextLevel}</strong>
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}

        <Divider />

        {/* Conquistas Desbloqueadas */}
        {unlockedAchievements.length > 0 && (
          <>
            <Heading size="md" color="green.500">
              ✅ Desbloqueadas ({unlockedAchievements.length})
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {unlockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={true}
                  cardBg={cardBg}
                />
              ))}
            </SimpleGrid>
          </>
        )}

        {/* Conquistas Bloqueadas */}
        {lockedAchievements.length > 0 && (
          <>
            <Heading size="md" color="gray.500">
              🔒 Bloqueadas ({lockedAchievements.length})
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {lockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={false}
                  cardBg={lockedBg}
                />
              ))}
            </SimpleGrid>
          </>
        )}
      </VStack>
    </Box>
  );
}

// Componente de Card de Conquista
function AchievementCard({ achievement, isUnlocked, cardBg }) {
  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow={isUnlocked ? 'xl' : 'md'}
      opacity={isUnlocked ? 1 : 0.6}
      position="relative"
      transition="all 0.3s"
      _hover={{
        transform: isUnlocked ? 'translateY(-4px)' : 'none',
        shadow: isUnlocked ? '2xl' : 'md'
      }}
    >
      {/* Ícone de Status */}
      <Box position="absolute" top={3} right={3}>
        {isUnlocked ? (
          <Badge colorScheme="green" fontSize="sm" px={2} py={1} borderRadius="md">
            <UnlockIcon mr={1} /> Desbloqueado
          </Badge>
        ) : (
          <LockIcon color="gray.400" boxSize={5} />
        )}
      </Box>

      <VStack align="start" spacing={4}>
        {/* Ícone da Conquista */}
        <Box
          w={16}
          h={16}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={isUnlocked ? 'yellow.100' : 'gray.200'}
          _dark={{ bg: isUnlocked ? 'yellow.900' : 'gray.600' }}
          borderRadius="xl"
          fontSize="3xl"
        >
          {achievement.icon || '🏆'}
        </Box>

        {/* Nome e Descrição */}
        <VStack align="start" spacing={1} w="full">
          <Heading size="sm" noOfLines={1}>
            {achievement.name}
          </Heading>
          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            {achievement.description}
          </Text>
        </VStack>

        {/* Progresso (se não desbloqueada) */}
        {!isUnlocked && achievement.progress !== undefined && achievement.target && (
          <VStack align="stretch" w="full" spacing={2}>
            <HStack justify="space-between" fontSize="xs" color="gray.500">
              <Text>Progresso</Text>
              <Text>
                {achievement.progress} / {achievement.target}
              </Text>
            </HStack>
            <Progress
              value={(achievement.progress / achievement.target) * 100}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
            />
          </VStack>
        )}

        {/* Data de Desbloqueio */}
        {isUnlocked && achievement.unlockedAt && (
          <HStack spacing={2} fontSize="xs" color="gray.500">
            <Text>Desbloqueado em</Text>
            <Text fontWeight="semibold">
              {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
            </Text>
          </HStack>
        )}

        {/* Recompensa */}
        {achievement.rewardPoints && (
          <Badge colorScheme="purple" fontSize="sm">
            +{achievement.rewardPoints} pontos
          </Badge>
        )}

        {/* Dica (se bloqueada) */}
        {!isUnlocked && achievement.hint && (
          <Tooltip label={achievement.hint} placement="top">
            <IconButton
              icon={<InfoIcon />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              aria-label="Dica"
            />
          </Tooltip>
        )}
      </VStack>
    </Box>
  );
}

export default AchievementsPage;
