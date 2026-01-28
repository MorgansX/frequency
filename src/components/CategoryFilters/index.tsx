'use client';

import { Funnel } from '@gravity-ui/icons';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Button } from '@heroui/react';
import { MODAL_STYLES } from './styles';
import { ItemsCountIndicator } from '../ItemsCountIndicator';
import { CategoriesButtons } from './CategoriesButtons';
import { CategoriesFooter } from './CategoriesFooter';
import { useCategoriesFilter } from './useCtagoriesFilter';
import { AppModalHeader } from '../Modal/ModalHeader';

export const CategoryFilters = ({ categories }: { categories: string[] }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    selectedCategories,
    selectedCount,
    toggleCategory,
    clearAll,
    applyFilters,
    resetFiltersToUrlState,
  } = useCategoriesFilter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetFiltersToUrlState();
    }
    onOpenChange();
  };

  return (
    <>
      <Button onPress={onOpen} size="md" className="!p-4 relative rounded-xl">
        <Funnel />
        <span>Filters</span>
        <ItemsCountIndicator count={selectedCount} />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        size="lg"
        placement="center"
        classNames={MODAL_STYLES}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <AppModalHeader
                ModalIcon={Funnel}
                modalName="Filters"
                onClose={onClose}
              >
                <p className="text-sm text-zinc-400">
                  {selectedCount > 0
                    ? `${selectedCount} selected`
                    : 'Select to filter stations'}
                </p>
              </AppModalHeader>
              <ModalBody>
                <CategoriesButtons
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                />
              </ModalBody>

              <ModalFooter>
                <CategoriesFooter
                  selectedCount={selectedCount}
                  clearAll={clearAll}
                  onClose={onClose}
                  applyFilters={applyFilters}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
