// src/context/DragContext.tsx
import React, { createContext, useEffect, ReactNode } from 'react';
import interact from 'interactjs';

// Можно определить тип контекста, если понадобится передавать данные
export const DragContext = createContext({});

export const DragProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    function dragMoveListener(event: any) {
      const target = event.target as HTMLElement;
      const x = (parseFloat(target.getAttribute("data-x") ?? "0") || 0) + event.dx;
      const y = (parseFloat(target.getAttribute("data-y") ?? "0") || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute("data-x", x.toString());
      target.setAttribute("data-y", y.toString());
    }

    // Инициализация draggable для элементов с классом "draggable"
    interact(".draggable").draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: dragMoveListener,
      },
    });

    // Сохраняем listener глобально (по желанию)
    window.dragMoveListener = dragMoveListener;

    // Очистка настроек при размонтировании
    return () => {
      interact(".draggable").unset();
    };
  }, []);

  return (
    <DragContext.Provider value={{}}>
      {children}
    </DragContext.Provider>
  );
};

