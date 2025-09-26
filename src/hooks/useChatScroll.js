import React, { useRef, useEffect } from 'react';

// This custom hook manages auto-scrolling a container to the bottom
// whenever a dependency (like a messages array) changes.
export const useChatScroll = (dep) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
};