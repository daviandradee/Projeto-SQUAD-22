import { useMediaQuery } from 'react-responsive';
import { useMemo, useEffect, useState } from 'react';

// Breakpoints mais abrangentes e modernos
export const BREAKPOINTS = {
  // Mobile First Approach
  xs: '(max-width: 479px)', // Mobile pequeno
  sm: '(min-width: 480px) and (max-width: 767px)', // Mobile grande
  md: '(min-width: 768px) and (max-width: 1023px)', // Tablet
  lg: '(min-width: 1024px) and (max-width: 1279px)', // Desktop pequeno
  xl: '(min-width: 1280px) and (max-width: 1439px)', // Desktop médio
  xxl: '(min-width: 1440px)', // Desktop grande
  '2xl': '(min-width: 1920px)', // Desktop extra grande
  
  // Breakpoints úteis para comportamentos específicos
  touchDevice: '(hover: none) and (pointer: coarse)',
  stylusDevice: '(hover: none) and (pointer: fine)',
  mouseDevice: '(hover: hover) and (pointer: fine)',
  
  // Para modo alto contraste/dark mode preferido
  prefersDark: '(prefers-color-scheme: dark)',
  prefersLight: '(prefers-color-scheme: light)',
  prefersReducedMotion: '(prefers-reduced-motion: reduce)'
};

// Sistema de breakpoints para mobile-first
export const BREAKPOINTS_MOBILE_FIRST = {
  xs: 480,   // > 480px
  sm: 768,   // > 768px  
  md: 1024,  // > 1024px
  lg: 1280,  // > 1280px
  xl: 1440,  // > 1440px
  xxl: 1920  // > 1920px
};

export const useResponsive = () => {
  // Breakpoints principais
  const isXS = useMediaQuery({ query: BREAKPOINTS.xs });
  const isSM = useMediaQuery({ query: BREAKPOINTS.sm });
  const isMD = useMediaQuery({ query: BREAKPOINTS.md });
  const isLG = useMediaQuery({ query: BREAKPOINTS.lg });
  const isXL = useMediaQuery({ query: BREAKPOINTS.xl });
  const isXXL = useMediaQuery({ query: BREAKPOINTS.xxl });
  const is2XL = useMediaQuery({ query: BREAKPOINTS['2xl'] });
  
  // Dispositivos e capacidades
  const isTouchDevice = useMediaQuery({ query: BREAKPOINTS.touchDevice });
  const isStylusDevice = useMediaQuery({ query: BREAKPOINTS.stylusDevice });
  const isMouseDevice = useMediaQuery({ query: BREAKPOINTS.mouseDevice });
  
  // Preferências do usuário
  const prefersDark = useMediaQuery({ query: BREAKPOINTS.prefersDark });
  const prefersLight = useMediaQuery({ query: BREAKPOINTS.prefersLight });
  const prefersReducedMotion = useMediaQuery({ query: BREAKPOINTS.prefersReducedMotion });

  // Estado para evitar hidratação inconsistente no SSR
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Device type com lógica mais robusta
  const deviceType = useMemo(() => {
    if (!isClient) return 'ssr'; // Para SSR
    
    if (isXS) return 'xs';
    if (isSM) return 'sm';
    if (isMD) return 'md';
    if (isLG) return 'lg';
    if (isXL) return 'xl';
    if (isXXL) return 'xxl';
    if (is2XL) return '2xl';
    
    return 'unknown';
  }, [isClient, isXS, isSM, isMD, isLG, isXL, isXXL, is2XL]);

  // Agrupamentos úteis
  const isMobile = useMemo(() => isXS || isSM, [isXS, isSM]);
  const isTablet = useMemo(() => isMD, [isMD]);
  const isDesktop = useMemo(() => isLG || isXL || isXXL || is2XL, [isLG, isXL, isXXL, is2XL]);
  const isLargeScreen = useMemo(() => isXL || isXXL || is2XL, [isXL, isXXL, is2XL]);

  // Helpers para orientação de layout
  const layoutType = useMemo(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    if (isDesktop) return 'desktop';
    return 'unknown';
  }, [isMobile, isTablet, isDesktop]);

  // Retorno memoizado para performance
  return useMemo(() => ({
    // Breakpoints individuais
    isXS,
    isSM,
    isMD,
    isLG,
    isXL,
    isXXL,
    is2XL,
    
    // Agrupamentos
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    
    // Tipo de dispositivo e layout
    deviceType,
    layoutType,
    
    // Capacidades do dispositivo
    isTouchDevice,
    isStylusDevice,
    isMouseDevice,
    
    // Preferências do usuário
    prefersDark,
    prefersLight,
    prefersReducedMotion,
    
    // Helpers para condições comuns
    isPortrait: typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false,
    isLandscape: typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false,
    
    // Métodos úteis
    breakpoint: deviceType,
    isAbove: (breakpoint) => {
      const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', '2xl'];
      const currentIndex = breakpoints.indexOf(deviceType);
      const targetIndex = breakpoints.indexOf(breakpoint);
      return currentIndex > targetIndex;
    },
    isBelow: (breakpoint) => {
      const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', '2xl'];
      const currentIndex = breakpoints.indexOf(deviceType);
      const targetIndex = breakpoints.indexOf(breakpoint);
      return currentIndex < targetIndex;
    }
  }), [
    isXS, isSM, isMD, isLG, isXL, isXXL, is2XL,
    isMobile, isTablet, isDesktop, isLargeScreen,
    deviceType, layoutType,
    isTouchDevice, isStylusDevice, isMouseDevice,
    prefersDark, prefersLight, prefersReducedMotion
  ]);
};

// Hook específico para orientação melhorado
export const useOrientation = () => {
  const [orientation, setOrientation] = useState({
    isPortrait: false,
    isLandscape: false,
    angle: 0
  });

  useEffect(() => {
    const updateOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const screenOrientation = window.screen?.orientation || {};
      
      setOrientation({
        isPortrait,
        isLandscape: !isPortrait,
        angle: screenOrientation.angle || 0,
        type: screenOrientation.type || (isPortrait ? 'portrait' : 'landscape')
      });
    };

    updateOrientation();
    
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
};

// Hook para debug (apenas desenvolvimento)
export const useResponsiveDebug = () => {
  const responsive = useResponsive();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 Responsive Debug:', responsive);
    }
  }, [responsive]);
  
  return responsive;
};

// Export default para compatibilidade
export default useResponsive;