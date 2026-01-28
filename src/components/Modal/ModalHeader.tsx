import { Xmark } from '@gravity-ui/icons';
import { ModalHeader } from '@heroui/modal';
import { Button } from '@heroui/react';
import React from 'react';

interface ModalHeaderProps extends React.PropsWithChildren {
  ModalIcon: React.ElementType;
  modalName: string;
  onClose: () => void;
}
export const AppModalHeader = ({
  ModalIcon,
  modalName,
  children,
  onClose,
}: ModalHeaderProps) => (
  <ModalHeader>
    <div className="flex items-center justify-between w-full p-5 border-b border-zinc-700/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <ModalIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{modalName}</h2>
          {children}
        </div>
      </div>
      <Button
        isIconOnly
        variant="ghost"
        size="md"
        onPress={onClose}
        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white min-w-8 w-8 h-8"
      >
        <Xmark className="w-4 h-4" />
      </Button>
    </div>
  </ModalHeader>
);
