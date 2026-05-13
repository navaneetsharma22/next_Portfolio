"use client";

import React, { createContext, useContext, useState } from 'react';

const CursorContext = createContext();

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default'); // 'default', 'hover', 'text'
  const [cursorText, setCursorText] = useState('');

  const setCursor = (type, text = '') => {
    setCursorType(type);
    setCursorText(text);
  };

  return (
    <CursorContext.Provider value={{ cursorType, cursorText, setCursor }}>
      {children}
    </CursorContext.Provider>
  );
};
