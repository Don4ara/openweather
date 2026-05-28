import React, {useEffect, useState} from 'react';
import {Text} from 'ink';

type SpinnerProps = {
  label: string;
};

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function Spinner({label}: SpinnerProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(current => (current + 1) % frames.length);
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <Text color="yellow">
      {frames[frame]} {label}
    </Text>
  );
}
