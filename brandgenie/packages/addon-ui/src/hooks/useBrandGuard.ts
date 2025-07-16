import { useEffect } from 'react';
import chroma from 'chroma-js';
import { useToast } from '@chakra-ui/react';
import { useBrandGuardContext } from '../contexts/BrandGuardContext';

// @ts-ignore – SDK injected
declare const addOnUISdk: any;

export function useBrandGuard() {
  const { rules } = useBrandGuardContext();
  const toast = useToast();

  useEffect(() => {
    if (!rules) return;

    const validateElement = (el: any) => {
      try {
        if (el.fill?.color) {
          const hex = el.fill.color;
          if (!rules.colors.includes(hex)) {
            toast({ description: `Off-brand color detected (${hex})`, status: 'warning' });
          }
          // contrast vs white bg quick check
          const contrast = chroma.contrast(hex, '#ffffff');
          if (contrast < 3) {
            toast({ description: `Low contrast color (${hex})`, status: 'warning' });
          }
        }
        if (el.fontFamily && !rules.fonts.includes(el.fontFamily)) {
          toast({ description: `Off-brand font ${el.fontFamily}`, status: 'warning' });
        }
      } catch (e) {
        console.warn('BrandGuard validation error', e);
      }
    };

    const runtime = addOnUISdk.instance.runtime;
    const handler = (event: any) => {
      const { element } = event;
      if (element) validateElement(element);
    };

    runtime.canvas.on('elementChanged', handler);
    runtime.canvas.on('elementAdded', handler);

    return () => {
      runtime.canvas.off('elementChanged', handler);
      runtime.canvas.off('elementAdded', handler);
    };
  }, [rules]);
}