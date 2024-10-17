'use client';

import { useEffect } from 'react';

function ErrorGenerator() {
  useEffect(() => {
    throw new Error("This is a test error");
  }, []);

  return null;
}

export default ErrorGenerator;