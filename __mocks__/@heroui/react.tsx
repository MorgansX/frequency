import React from 'react';

export const Button = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <button {...props}>{children}</button>
);

export const Card = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div {...props}>{children}</div>
);

export const CardHeader = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div {...props}>{children}</div>
);

export const CardBody = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div {...props}>{children}</div>
);

export const CardFooter = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div {...props}>{children}</div>
);

export const Chip = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <span {...props}>{children}</span>
);

export const Spinner = (props: Record<string, unknown>) => (
  <div data-testid="spinner" {...props} />
);

export const Divider = (props: Record<string, unknown>) => <hr {...props} />;

export const Surface = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div {...props}>{children}</div>
);
