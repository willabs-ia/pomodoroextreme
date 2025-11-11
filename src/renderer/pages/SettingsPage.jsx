import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  useColorModeValue,
  Divider,
  Badge,
  SimpleGrid,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import useSettings from '../hooks/useSettings';

function SettingsPage() {
  const { settings, loading, updateField, resetToDefaults } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleChange = async (field, value) => {
    try {
      setIsSaving(true);
      await updateField(field, value);
      // TODO: Show success toast
    } catch (err) {
      console.error('Error updating setting:', err);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      try {
        await resetToDefaults();
        // TODO: Show success toast
      } catch (err) {
        console.error('Error resetting settings:', err);
      }
    }
  };

  if (loading || !settings) {
    return (
      <Box minH="100vh" bg={bgColor} p={8} display="flex" alignItems="center" justifyContent="center">
        <Text>Carregando configurações...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} p={8}>
      <VStack spacing={6} maxW="1200px" mx="auto" align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="xl">⚙️ Configurações</Heading>
            <Text color="gray.500">
              Personalize o Pomodoro Extreme ao seu gosto
            </Text>
          </VStack>

          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={handleReset}
          >
            Restaurar Padrões
          </Button>
        </HStack>

        {/* Tabs */}
        <Box bg={cardBg} borderRadius="xl" shadow="xl" overflow="hidden">
          <Tabs colorScheme="red" isLazy>
            <TabList borderBottomWidth={2}>
              <Tab>⚙️ Geral</Tab>
              <Tab>🎨 Visual</Tab>
              <Tab>🔊 Áudio</Tab>
              <Tab>🔔 Notificações</Tab>
              <Tab>⌨️ Atalhos</Tab>
            </TabList>

            <TabPanels>
              {/* ABA 1: GERAL */}
              <TabPanel p={8}>
                <VStack spacing={8} align="stretch">
                  <Heading size="md">Configurações Gerais</Heading>

                  {/* Durações */}
                  <VStack spacing={6} align="stretch">
                    <Heading size="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      Durações
                    </Heading>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <FormControl>
                        <FormLabel>Duração do Foco</FormLabel>
                        <HStack>
                          <Input
                            type="number"
                            value={settings.focusDuration}
                            onChange={(e) => handleChange('focusDuration', parseInt(e.target.value))}
                            min={1}
                            max={90}
                          />
                          <Text>min</Text>
                        </HStack>
                        <FormHelperText>Tempo de trabalho focado</FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Pausa Curta</FormLabel>
                        <HStack>
                          <Input
                            type="number"
                            value={settings.shortBreakDuration}
                            onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value))}
                            min={1}
                            max={30}
                          />
                          <Text>min</Text>
                        </HStack>
                        <FormHelperText>Pausa após cada pomodoro</FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Pausa Longa</FormLabel>
                        <HStack>
                          <Input
                            type="number"
                            value={settings.longBreakDuration}
                            onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value))}
                            min={5}
                            max={60}
                          />
                          <Text>min</Text>
                        </HStack>
                        <FormHelperText>Pausa a cada 4 pomodoros</FormHelperText>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel>Pomodoros até Pausa Longa</FormLabel>
                      <Select
                        value={settings.pomodorosUntilLongBreak}
                        onChange={(e) => handleChange('pomodorosUntilLongBreak', parseInt(e.target.value))}
                      >
                        <option value={2}>2 pomodoros</option>
                        <option value={3}>3 pomodoros</option>
                        <option value={4}>4 pomodoros (padrão)</option>
                        <option value={5}>5 pomodoros</option>
                        <option value={6}>6 pomodoros</option>
                      </Select>
                    </FormControl>
                  </VStack>

                  <Divider />

                  {/* Nível de Bloqueio */}
                  <VStack spacing={6} align="stretch">
                    <Heading size="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      Nível de Bloqueio
                    </Heading>

                    <FormControl>
                      <FormLabel>Modo de Bloqueio de Pausas</FormLabel>
                      <Select
                        value={settings.blockLevel}
                        onChange={(e) => handleChange('blockLevel', e.target.value)}
                      >
                        <option value="soft">Suave - 3 mensagens + justificativa</option>
                        <option value="medium">Médio - Penalidade 3x ao pular</option>
                        <option value="extreme">Extremo - Sem escapatória</option>
                      </Select>
                      <FormHelperText>
                        {settings.blockLevel === 'soft' && '🟢 Pode pular pausas com mensagens desmotivadoras'}
                        {settings.blockLevel === 'medium' && '🟡 Cada pulo triplica o tempo da próxima pausa'}
                        {settings.blockLevel === 'extreme' && '🔴 Impossível pular pausas - foco total!'}
                      </FormHelperText>
                    </FormControl>

                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">
                        O modo escolhido afeta como você pode (ou não) pular as pausas obrigatórias.
                        Recomendamos começar no modo Suave e aumentar gradualmente.
                      </Text>
                    </Alert>
                  </VStack>

                  <Divider />

                  {/* Auto-Start */}
                  <VStack spacing={6} align="stretch">
                    <Heading size="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      Automação
                    </Heading>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Auto-iniciar Foco</FormLabel>
                        <FormHelperText mt={0}>
                          Inicia automaticamente o próximo período de foco
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.autoStartFocus}
                        onChange={(e) => handleChange('autoStartFocus', e.target.checked)}
                        colorScheme="green"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Auto-iniciar Pausas</FormLabel>
                        <FormHelperText mt={0}>
                          Inicia automaticamente as pausas após completar um pomodoro
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.autoStartBreak}
                        onChange={(e) => handleChange('autoStartBreak', e.target.checked)}
                        colorScheme="green"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Detectar Inatividade</FormLabel>
                        <FormHelperText mt={0}>
                          Pausa o timer após {settings.inactivityTimeout} minutos sem atividade
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.detectInactivity}
                        onChange={(e) => handleChange('detectInactivity', e.target.checked)}
                        colorScheme="blue"
                        size="lg"
                      />
                    </FormControl>

                    {settings.detectInactivity && (
                      <FormControl>
                        <FormLabel>Tempo de Inatividade (minutos)</FormLabel>
                        <Slider
                          value={settings.inactivityTimeout}
                          onChange={(val) => handleChange('inactivityTimeout', val)}
                          min={1}
                          max={15}
                          step={1}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={6}>
                            <Box color="blue.500" fontWeight="bold" fontSize="xs">
                              {settings.inactivityTimeout}
                            </Box>
                          </SliderThumb>
                        </Slider>
                      </FormControl>
                    )}
                  </VStack>

                  <Divider />

                  {/* Sistema */}
                  <VStack spacing={6} align="stretch">
                    <Heading size="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      Sistema
                    </Heading>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Mostrar na Bandeja do Sistema</FormLabel>
                        <FormHelperText mt={0}>
                          Mantém o ícone na system tray
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.showInTray}
                        onChange={(e) => handleChange('showInTray', e.target.checked)}
                        size="lg"
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Fechar para Bandeja</FormLabel>
                        <FormHelperText mt={0}>
                          Minimiza para tray ao invés de fechar
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.closeToTray}
                        onChange={(e) => handleChange('closeToTray', e.target.checked)}
                        size="lg"
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Iniciar com o Sistema</FormLabel>
                        <FormHelperText mt={0}>
                          Abre automaticamente ao iniciar o computador
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.launchAtStartup}
                        onChange={(e) => handleChange('launchAtStartup', e.target.checked)}
                        size="lg"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Idioma</FormLabel>
                      <Select
                        value={settings.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                      >
                        <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                        <option value="en-US">🇺🇸 English (US)</option>
                        <option value="es-ES">🇪🇸 Español</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </VStack>
              </TabPanel>

              {/* ABA 2: VISUAL */}
              <TabPanel p={8}>
                <VStack spacing={8} align="stretch">
                  <Heading size="md">Aparência e Visual</Heading>

                  <FormControl>
                    <FormLabel>Tema</FormLabel>
                    <Select
                      value={settings.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                    >
                      <option value="light">☀️ Claro</option>
                      <option value="dark">🌙 Escuro</option>
                      <option value="auto">🔄 Automático (segue o sistema)</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cor de Destaque</FormLabel>
                    <Input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                    />
                    <FormHelperText>
                      Cor principal do timer e elementos de destaque
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tipo de Fundo</FormLabel>
                    <Select
                      value={settings.backgroundType}
                      onChange={(e) => handleChange('backgroundType', e.target.value)}
                    >
                      <option value="gradient">Gradiente</option>
                      <option value="solid">Cor sólida</option>
                      <option value="image">Imagem</option>
                      <option value="video">Vídeo (experimental)</option>
                    </Select>
                  </FormControl>

                  {settings.backgroundType === 'gradient' && (
                    <FormControl>
                      <FormLabel>Gradiente CSS</FormLabel>
                      <Input
                        value={settings.backgroundValue}
                        onChange={(e) => handleChange('backgroundValue', e.target.value)}
                        placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      />
                      <FormHelperText>
                        Use <a href="https://cssgradient.io" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>CSS Gradient Generator</a>
                      </FormHelperText>
                    </FormControl>
                  )}

                  <FormControl>
                    <FormLabel>Transparência do Gadget</FormLabel>
                    <Slider
                      value={settings.transparency * 100}
                      onChange={(val) => handleChange('transparency', val / 100)}
                      min={20}
                      max={100}
                      step={5}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        <Box color="purple.500" fontWeight="bold" fontSize="xs">
                          {Math.round(settings.transparency * 100)}%
                        </Box>
                      </SliderThumb>
                    </Slider>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tamanho da Fonte</FormLabel>
                    <Select
                      value={settings.fontSize}
                      onChange={(e) => handleChange('fontSize', e.target.value)}
                    >
                      <option value="small">Pequeno</option>
                      <option value="medium">Médio</option>
                      <option value="large">Grande</option>
                      <option value="xl">Extra Grande</option>
                    </Select>
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* ABA 3: ÁUDIO */}
              <TabPanel p={8}>
                <VStack spacing={8} align="stretch">
                  <Heading size="md">Configurações de Áudio</Heading>

                  {/* Tick-Tack */}
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Som do Relógio (Tick-Tack)</FormLabel>
                        <FormHelperText mt={0}>
                          Som de relógio a cada segundo durante o foco
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.enableTickSound}
                        onChange={(e) => handleChange('enableTickSound', e.target.checked)}
                        colorScheme="blue"
                        size="lg"
                      />
                    </FormControl>

                    {settings.enableTickSound && (
                      <FormControl>
                        <FormLabel>Volume do Tick-Tack</FormLabel>
                        <Slider
                          value={settings.tickVolume * 100}
                          onChange={(val) => handleChange('tickVolume', val / 100)}
                          min={0}
                          max={100}
                          step={5}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={6}>
                            <Box color="blue.500" fontWeight="bold" fontSize="xs">
                              {Math.round(settings.tickVolume * 100)}
                            </Box>
                          </SliderThumb>
                        </Slider>
                      </FormControl>
                    )}
                  </VStack>

                  <Divider />

                  {/* Alertas */}
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Sons de Alerta</FormLabel>
                        <FormHelperText mt={0}>
                          Sons ao iniciar/completar pomodoros e pausas
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.enableAlerts}
                        onChange={(e) => handleChange('enableAlerts', e.target.checked)}
                        colorScheme="green"
                        size="lg"
                      />
                    </FormControl>

                    {settings.enableAlerts && (
                      <FormControl>
                        <FormLabel>Volume dos Alertas</FormLabel>
                        <Slider
                          value={settings.alertVolume * 100}
                          onChange={(val) => handleChange('alertVolume', val / 100)}
                          min={0}
                          max={100}
                          step={5}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={6}>
                            <Box color="green.500" fontWeight="bold" fontSize="xs">
                              {Math.round(settings.alertVolume * 100)}
                            </Box>
                          </SliderThumb>
                        </Slider>
                      </FormControl>
                    )}
                  </VStack>

                  <Divider />

                  {/* Música de Pausa */}
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <FormLabel mb={0}>Música de Fundo nas Pausas</FormLabel>
                        <FormHelperText mt={0}>
                          Toca música relaxante durante as pausas
                        </FormHelperText>
                      </Box>
                      <Switch
                        isChecked={settings.enableBreakMusic}
                        onChange={(e) => handleChange('enableBreakMusic', e.target.checked)}
                        colorScheme="purple"
                        size="lg"
                      />
                    </FormControl>

                    {settings.enableBreakMusic && (
                      <>
                        <FormControl>
                          <FormLabel>Fonte da Música</FormLabel>
                          <Input
                            value={settings.breakMusicSource || ''}
                            onChange={(e) => handleChange('breakMusicSource', e.target.value)}
                            placeholder="URL da música ou caminho local"
                          />
                          <FormHelperText>
                            Cole a URL de um arquivo MP3 ou selecione um arquivo local
                          </FormHelperText>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Volume da Música</FormLabel>
                          <Slider
                            value={settings.musicVolume * 100}
                            onChange={(val) => handleChange('musicVolume', val / 100)}
                            min={0}
                            max={100}
                            step={5}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb boxSize={6}>
                              <Box color="purple.500" fontWeight="bold" fontSize="xs">
                                {Math.round(settings.musicVolume * 100)}
                              </Box>
                            </SliderThumb>
                          </Slider>
                        </FormControl>
                      </>
                    )}
                  </VStack>

                  <Divider />

                  {/* Pausar Mídia Externa */}
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <FormLabel mb={0}>Pausar Mídia Externa ao Focar</FormLabel>
                      <FormHelperText mt={0}>
                        Pausa Spotify, YouTube, etc. ao iniciar período de foco
                      </FormHelperText>
                    </Box>
                    <Switch
                      isChecked={settings.pauseMediaOnFocus}
                      onChange={(e) => handleChange('pauseMediaOnFocus', e.target.checked)}
                      size="lg"
                    />
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* ABA 4: NOTIFICAÇÕES */}
              <TabPanel p={8}>
                <VStack spacing={8} align="stretch">
                  <Heading size="md">Notificações</Heading>

                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <FormLabel mb={0}>Ativar Notificações</FormLabel>
                      <FormHelperText mt={0}>
                        Exibe notificações do sistema
                      </FormHelperText>
                    </Box>
                    <Switch
                      isChecked={settings.enableNotifications}
                      onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                      colorScheme="blue"
                      size="lg"
                    />
                  </FormControl>

                  {settings.enableNotifications && (
                    <>
                      <FormControl display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <FormLabel mb={0}>Som nas Notificações</FormLabel>
                          <FormHelperText mt={0}>
                            Toca som junto com a notificação
                          </FormHelperText>
                        </Box>
                        <Switch
                          isChecked={settings.notificationSound}
                          onChange={(e) => handleChange('notificationSound', e.target.checked)}
                          size="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Posição na Tela</FormLabel>
                        <Select
                          value={settings.notificationPosition}
                          onChange={(e) => handleChange('notificationPosition', e.target.value)}
                        >
                          <option value="top-right">Canto Superior Direito</option>
                          <option value="top-left">Canto Superior Esquerdo</option>
                          <option value="bottom-right">Canto Inferior Direito</option>
                          <option value="bottom-left">Canto Inferior Esquerdo</option>
                        </Select>
                      </FormControl>

                      <Divider />

                      <Heading size="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                        Tipos de Notificações
                      </Heading>

                      <Text fontSize="sm" color="gray.500">
                        Configure quais eventos devem exibir notificações:
                      </Text>

                      <VStack align="stretch" spacing={2} pl={4}>
                        <Text fontSize="sm">✅ Pomodoro iniciado</Text>
                        <Text fontSize="sm">✅ Pomodoro completado</Text>
                        <Text fontSize="sm">✅ Pausa iniciada</Text>
                        <Text fontSize="sm">✅ Pausa terminada</Text>
                        <Text fontSize="sm">✅ Conquista desbloqueada</Text>
                        <Text fontSize="sm">✅ Sessão completada</Text>
                        <Text fontSize="sm">✅ Streak atualizado</Text>
                      </VStack>
                    </>
                  )}
                </VStack>
              </TabPanel>

              {/* ABA 5: ATALHOS */}
              <TabPanel p={8}>
                <VStack spacing={8} align="stretch">
                  <Heading size="md">Atalhos de Teclado</Heading>

                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Atalhos globais funcionam mesmo quando o app está em segundo plano
                    </Text>
                  </Alert>

                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Iniciar/Pausar Timer</FormLabel>
                      <Input
                        value={settings.shortcuts?.startPause || ''}
                        onChange={(e) =>
                          handleChange('shortcuts', {
                            ...settings.shortcuts,
                            startPause: e.target.value
                          })
                        }
                        placeholder="Ex: CommandOrControl+Shift+S"
                      />
                      <FormHelperText>
                        Formato: CommandOrControl+Shift+S (use Command no Mac, Control no Windows/Linux)
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Parar Timer</FormLabel>
                      <Input
                        value={settings.shortcuts?.stop || ''}
                        onChange={(e) =>
                          handleChange('shortcuts', {
                            ...settings.shortcuts,
                            stop: e.target.value
                          })
                        }
                        placeholder="Ex: CommandOrControl+Shift+X"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Tentar Pular Pausa</FormLabel>
                      <Input
                        value={settings.shortcuts?.skipBreak || ''}
                        onChange={(e) =>
                          handleChange('shortcuts', {
                            ...settings.shortcuts,
                            skipBreak: e.target.value
                          })
                        }
                        placeholder="Ex: CommandOrControl+Shift+K"
                      />
                      <FormHelperText>
                        Disponível apenas se o nível de bloqueio permitir
                      </FormHelperText>
                    </FormControl>
                  </VStack>

                  <Divider />

                  <Box bg="gray.100" _dark={{ bg: 'gray.700' }} p={4} borderRadius="md">
                    <Heading size="sm" mb={3}>
                      Teclas Modificadoras
                    </Heading>
                    <VStack align="start" spacing={2} fontSize="sm">
                      <Text>• <Badge>Command</Badge> ou <Badge>Control</Badge> - Tecla Ctrl/Cmd</Text>
                      <Text>• <Badge>Shift</Badge> - Tecla Shift</Text>
                      <Text>• <Badge>Alt</Badge> - Tecla Alt/Option</Text>
                      <Text>• <Badge>+</Badge> - Combina teclas (ex: Control+Shift+S)</Text>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Footer */}
        <HStack justify="space-between" px={4}>
          <Text fontSize="sm" color="gray.500">
            As configurações são salvas automaticamente
          </Text>
          {isSaving && (
            <Badge colorScheme="blue">Salvando...</Badge>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}

export default SettingsPage;
