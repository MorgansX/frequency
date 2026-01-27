import React from 'react';

export const Modal = ({
  children,
  isOpen,
  onOpenChange,
  ...props
}: React.PropsWithChildren<{
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: string;
  placement?: string;
  classNames?: Record<string, string>;
}>) =>
  isOpen ? (
    <div data-testid="modal" {...props}>
      {children}
    </div>
  ) : null;

export const ModalContent = ({
  children,
}: {
  children: ((onClose: () => void) => React.ReactNode) | React.ReactNode;
}) => {
  const onClose = jest.fn();
  return (
    <div data-testid="modal-content">
      {typeof children === 'function' ? children(onClose) : children}
    </div>
  );
};

export const ModalHeader = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div data-testid="modal-header" {...props}>
    {children}
  </div>
);

export const ModalBody = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div data-testid="modal-body" {...props}>
    {children}
  </div>
);

export const ModalFooter = ({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <div data-testid="modal-footer" {...props}>
    {children}
  </div>
);

export const useDisclosure = () => ({
  isOpen: false,
  onOpen: jest.fn(),
  onOpenChange: jest.fn(),
  onClose: jest.fn(),
});
