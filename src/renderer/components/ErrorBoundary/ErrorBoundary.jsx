import React from 'react';
import { Box, VStack, Heading, Text, Button, Code } from '@chakra-ui/react';

/**
 * ErrorBoundary - Catches React errors and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also log the error to an error reporting service here
    // if (window.electronAPI?.logError) {
    //   window.electronAPI.logError({
    //     message: error.toString(),
    //     stack: errorInfo.componentStack
    //   });
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Box
          minH="100vh"
          bg="gray.900"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={8}
        >
          <VStack spacing={6} maxW="600px" textAlign="center">
            <Text fontSize="6xl">😕</Text>

            <Heading size="xl" color="red.400">
              Oops! Algo deu errado
            </Heading>

            <Text color="gray.400" fontSize="lg">
              Ocorreu um erro inesperado no aplicativo. Você pode tentar recarregar a página ou
              entrar em contato com o suporte se o problema persistir.
            </Text>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                bg="gray.800"
                p={4}
                borderRadius="md"
                w="full"
                textAlign="left"
                overflow="auto"
                maxH="300px"
              >
                <Text fontSize="sm" fontWeight="bold" color="red.400" mb={2}>
                  Error:
                </Text>
                <Code colorScheme="red" p={2} borderRadius="md" display="block" whiteSpace="pre-wrap">
                  {this.state.error.toString()}
                </Code>

                {this.state.errorInfo && (
                  <>
                    <Text fontSize="sm" fontWeight="bold" color="orange.400" mt={4} mb={2}>
                      Component Stack:
                    </Text>
                    <Code
                      colorScheme="orange"
                      p={2}
                      borderRadius="md"
                      display="block"
                      whiteSpace="pre-wrap"
                      fontSize="xs"
                    >
                      {this.state.errorInfo.componentStack}
                    </Code>
                  </>
                )}
              </Box>
            )}

            {/* Action buttons */}
            <VStack spacing={3} w="full">
              <Button colorScheme="red" size="lg" w="full" onClick={this.handleReload}>
                🔄 Recarregar Aplicativo
              </Button>

              <Button variant="outline" colorScheme="gray" w="full" onClick={this.handleReset}>
                ↩️ Tentar Novamente
              </Button>

              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('Error:', this.state.error);
                    console.log('Error Info:', this.state.errorInfo);
                  }}
                >
                  📋 Log Error to Console
                </Button>
              )}
            </VStack>

            <Text fontSize="xs" color="gray.600" mt={4}>
              Pomodoro Extreme v1.0.0
            </Text>
          </VStack>
        </Box>
      );
    }

    // Normal render
    return this.props.children;
  }
}

export default ErrorBoundary;
