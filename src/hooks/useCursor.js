import { useEffect, useRef, useCallback } from 'react';

export const useCursor = () => {
  const cursorState = useRef({
    x: -100,
    y: -100,
    dotX: -100,
    dotY: -100,
    isVisible: false,
    isClicking: false,
    cursorType: 'default',
    cursorText: '',
  });

  const isTouchDevice = useRef(
    typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  const listeners = useRef([]);

  const subscribe = useCallback((fn) => {
    listeners.current.push(fn);
    return () => {
      listeners.current = listeners.current.filter((l) => l !== fn);
    };
  }, []);

  const notify = useCallback(() => {
    listeners.current.forEach((fn) => fn({ ...cursorState.current }));
  }, []);

  useEffect(() => {
    if (isTouchDevice.current) return;

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onMouseMove = (e) => {
      cursorState.current.dotX = e.clientX;
      cursorState.current.dotY = e.clientY;
      if (!cursorState.current.isVisible) {
        cursorState.current.x = e.clientX;
        cursorState.current.y = e.clientY;
        cursorState.current.isVisible = true;
      }
      notify();
    };

    const onMouseLeave = () => {
      cursorState.current.isVisible = false;
      notify();
    };

    const onMouseEnter = () => {
      cursorState.current.isVisible = true;
      notify();
    };

    const onMouseDown = () => {
      cursorState.current.isClicking = true;
      notify();
    };

    const onMouseUp = () => {
      cursorState.current.isClicking = false;
      notify();
    };

    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        cursorState.current.cursorType = target.dataset.cursor || 'default';
        cursorState.current.cursorText = target.dataset.cursorText || '';
      } else {
        cursorState.current.cursorType = 'default';
        cursorState.current.cursorText = '';
      }
      notify();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, [notify]);

  return { cursorState, subscribe, isTouchDevice: isTouchDevice.current };
};
