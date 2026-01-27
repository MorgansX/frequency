import React from 'react';

export const CirclePlay = (props: Record<string, unknown>) => (
  <svg data-testid="circle-play" {...props} />
);

export const CirclePause = (props: Record<string, unknown>) => (
  <svg data-testid="circle-pause" {...props} />
);

export const CircleChevronLeft = (props: Record<string, unknown>) => (
  <svg data-testid="circle-chevron-left" {...props} />
);

export const CircleChevronRight = (props: Record<string, unknown>) => (
  <svg data-testid="circle-chevron-right" {...props} />
);

export const CircleFill = (props: Record<string, unknown>) => (
  <svg data-testid="circle-fill" {...props} />
);

export const Funnel = (props: Record<string, unknown>) => (
  <svg data-testid="funnel" {...props} />
);

export const Xmark = (props: Record<string, unknown>) => (
  <svg data-testid="xmark" {...props} />
);
