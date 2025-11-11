import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Select,
  Button,
  useColorModeValue,
  Progress,
  Divider,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import useStats from '../hooks/useStats';
import useProjects from '../hooks/useProjects';

function StatsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [period, setPeriod] = useState('today');

  const { stats, dashboard, loading, exportStats } = useStats(selectedProject, period);
  const { projects } = useProjects();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleExport = async (format) => {
    try {
      await exportStats(format, period);
      // TODO: Toast success
      console.log(`Stats exported as ${format}`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} p={8} display="flex" alignItems="center" justifyContent="center">
        <Text>Carregando estatísticas...</Text>
      </Box>
    );
  }

  const currentStats = selectedProject ? stats : dashboard?.today;

  return (
    <Box minH="100vh" bg={bgColor} p={8}>
      <VStack spacing={8} maxW="1400px" mx="auto" align="stretch">
        {/* Header */}
        <HStack justify="space-between" flexWrap="wrap">
          <VStack align="start" spacing={1}>
            <Heading size="xl">📊 Estatísticas</Heading>
            <Text color="gray.500">
              Acompanhe sua produtividade e evolução
            </Text>
          </VStack>

          <HStack spacing={4} flexWrap="wrap">
            {/* Filtro de projeto */}
            <Select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value || null)}
              w="200px"
            >
              <option value="">Todos os projetos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.icon} {project.name}
                </option>
              ))}
            </Select>

            {/* Filtro de período */}
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} w="150px">
              <option value="today">Hoje</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mês</option>
              <option value="year">Este ano</option>
              <option value="all">Todo período</option>
            </Select>

            {/* Exportar */}
            <Button
              leftIcon={<DownloadIcon />}
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
            >
              Exportar
            </Button>
          </HStack>
        </HStack>

        {/* Métricas Principais */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {/* Total de Pomodoros */}
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <Stat>
              <StatLabel>Pomodoros Completados</StatLabel>
              <StatNumber fontSize="4xl" color="red.500">
                {currentStats?.completedPomodoros || 0}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {currentStats?.totalPomodoros || 0} iniciados
              </StatHelpText>
            </Stat>
          </Box>

          {/* Tempo Focado */}
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <Stat>
              <StatLabel>Tempo Focado</StatLabel>
              <StatNumber fontSize="4xl" color="blue.500">
                {formatHours(currentStats?.totalFocusTime || 0)}
              </StatNumber>
              <StatHelpText>
                {currentStats?.totalFocusTime || 0} minutos
              </StatHelpText>
            </Stat>
          </Box>

          {/* Streak */}
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <Stat>
              <StatLabel>Streak Atual</StatLabel>
              <StatNumber fontSize="4xl" color="orange.500">
                🔥 {currentStats?.streak || 0}
              </StatNumber>
              <StatHelpText>
                Recorde: {currentStats?.longestStreak || 0} dias
              </StatHelpText>
            </Stat>
          </Box>

          {/* Produtividade */}
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <Stat>
              <StatLabel>Produtividade</StatLabel>
              <StatNumber fontSize="4xl" color="green.500">
                {calculateProductivity(currentStats)}%
              </StatNumber>
              <StatHelpText>
                {currentStats?.skippedBreaks || 0} pausas puladas
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Dashboard Semanal/Mensal */}
        {!selectedProject && dashboard && (
          <>
            <Divider />

            <Heading size="md">Visão Geral</Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {/* Hoje */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                <VStack align="start" spacing={3}>
                  <Badge colorScheme="green">Hoje</Badge>
                  <Text fontSize="3xl" fontWeight="bold">
                    {dashboard.today?.completedPomodoros || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    pomodoros completados
                  </Text>
                  <Progress
                    value={(dashboard.today?.completedPomodoros / 8) * 100}
                    colorScheme="green"
                    size="sm"
                    w="full"
                  />
                  <Text fontSize="xs" color="gray.500">
                    Meta diária: 8 pomodoros
                  </Text>
                </VStack>
              </Box>

              {/* Esta Semana */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                <VStack align="start" spacing={3}>
                  <Badge colorScheme="blue">Esta Semana</Badge>
                  <Text fontSize="3xl" fontWeight="bold">
                    {dashboard.thisWeek?.completedPomodoros || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    pomodoros completados
                  </Text>
                  <Progress
                    value={(dashboard.thisWeek?.completedPomodoros / 40) * 100}
                    colorScheme="blue"
                    size="sm"
                    w="full"
                  />
                  <Text fontSize="xs" color="gray.500">
                    Meta semanal: 40 pomodoros
                  </Text>
                </VStack>
              </Box>

              {/* Este Mês */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                <VStack align="start" spacing={3}>
                  <Badge colorScheme="purple">Este Mês</Badge>
                  <Text fontSize="3xl" fontWeight="bold">
                    {dashboard.thisMonth?.completedPomodoros || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    pomodoros completados
                  </Text>
                  <Progress
                    value={(dashboard.thisMonth?.completedPomodoros / 160) * 100}
                    colorScheme="purple"
                    size="sm"
                    w="full"
                  />
                  <Text fontSize="xs" color="gray.500">
                    Meta mensal: 160 pomodoros
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </>
        )}

        {/* Sessões Recentes */}
        {dashboard?.recentSessions && dashboard.recentSessions.length > 0 && (
          <>
            <Divider />

            <Heading size="md">Sessões Recentes</Heading>

            <Box bg={cardBg} borderRadius="xl" shadow="md" overflow="hidden">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Projeto</Th>
                    <Th>Data</Th>
                    <Th isNumeric>Pomodoros</Th>
                    <Th isNumeric>Tempo</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dashboard.recentSessions.map((session) => (
                    <Tr key={session.id}>
                      <Td>
                        <HStack>
                          <Text>{session.project?.icon}</Text>
                          <Text>{session.project?.name}</Text>
                        </HStack>
                      </Td>
                      <Td>{formatDate(session.createdAt)}</Td>
                      <Td isNumeric>{session.completedPomodoros}</Td>
                      <Td isNumeric>{formatTime(session.totalTime)}</Td>
                      <Td>
                        <Badge colorScheme={session.isCompleted ? 'green' : 'yellow'}>
                          {session.isCompleted ? 'Completo' : 'Em andamento'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </>
        )}

        {/* Top Projetos */}
        {currentStats?.topProjects && currentStats.topProjects.length > 0 && (
          <>
            <Divider />

            <Heading size="md">Projetos Mais Produtivos</Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {currentStats.topProjects.slice(0, 6).map((projectStat, index) => (
                <Box key={projectStat.projectId} bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <HStack justify="space-between" mb={3}>
                    <HStack>
                      <Text fontSize="2xl">{projectStat.icon}</Text>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{projectStat.name}</Text>
                        <Text fontSize="xs" color="gray.500">
                          #{index + 1} mais produtivo
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="red.500">
                      {projectStat.pomodoros}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    {formatTime(projectStat.totalTime)} focado
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </>
        )}

        {/* Conquistas e Reputação */}
        {dashboard?.achievements && (
          <>
            <Divider />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Conquistas */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Heading size="sm">🏆 Conquistas</Heading>
                    <Badge colorScheme="yellow">
                      {dashboard.achievements.unlocked}/{dashboard.achievements.total}
                    </Badge>
                  </HStack>
                  <Progress
                    value={(dashboard.achievements.unlocked / dashboard.achievements.total) * 100}
                    colorScheme="yellow"
                    size="lg"
                    w="full"
                  />
                  <Button size="sm" variant="link" colorScheme="blue">
                    Ver todas as conquistas →
                  </Button>
                </VStack>
              </Box>

              {/* Reputação */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                <VStack align="start" spacing={4}>
                  <HStack justify="space-between" w="full">
                    <Heading size="sm">👑 Reputação</Heading>
                    <Badge colorScheme="purple">{dashboard.reputation?.level}</Badge>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {dashboard.reputation?.points} pontos
                  </Text>
                  <Progress
                    value={
                      ((dashboard.reputation?.points || 0) / (dashboard.reputation?.pointsToNext || 1)) * 100
                    }
                    colorScheme="purple"
                    size="lg"
                    w="full"
                  />
                  <Text fontSize="sm" color="gray.500">
                    {dashboard.reputation?.pointsToNext - dashboard.reputation?.points} pontos até {dashboard.reputation?.nextLevel}
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </>
        )}
      </VStack>
    </Box>
  );
}

// Helper functions
function formatHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function formatTime(minutes) {
  return formatHours(minutes);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function calculateProductivity(stats) {
  if (!stats || stats.totalPomodoros === 0) return 0;
  return Math.round((stats.completedPomodoros / stats.totalPomodoros) * 100);
}

export default StatsPage;
