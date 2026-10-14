import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ProgrammingIslandId } from '../../types';
import { World2DFallback } from './World2DFallback';

interface WorldErrorBoundaryProps {
  children: ReactNode;
  onSelectIsland: (islandId: ProgrammingIslandId) => void;
  theme?: 'dark' | 'light';
  fallbackMessage?: string;
}

interface WorldErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class WorldErrorBoundary extends Component<WorldErrorBoundaryProps, WorldErrorBoundaryState> {
  constructor(props: WorldErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): WorldErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'WebGL 3D Context Error'
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WorldErrorBoundary caught error in 3D scene:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <World2DFallback
          onSelectIsland={this.props.onSelectIsland}
          theme={this.props.theme}
          errorMessage={this.state.errorMessage || this.props.fallbackMessage || 'WebGL rendering unavailable'}
        />
      );
    }

    return this.props.children;
  }
}
