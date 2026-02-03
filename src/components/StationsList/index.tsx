'use client';
import { useEffect, useRef, useCallback } from 'react';
import { Button, Spinner } from '@heroui/react';
import { ListUl } from '@gravity-ui/icons';
import { Modal, ModalBody, ModalContent, useDisclosure } from '@heroui/modal';
import { MODAL_STYLES } from '../CategoryFilters/styles';
import { AppModalHeader } from '../Modal/ModalHeader';
import { StationCard } from '../StationCard';
import { useRadioStations } from '@/store/useRadioStations';
import { useRadioFilter } from '@/store/useRadioFilter';
import { useCountry } from '@/store/useCounrty';

export const StationsList = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { country } = useCountry();
  const {
    stations,
    playStation,
    currentStationIndex,
    isPlaying,
    loadMoreStations,
    isLoadingMore,
    hasMore,
  } = useRadioStations();
  const { applyedFilters } = useRadioFilter();

  const loaderRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadMoreStations(
        country,
        applyedFilters.length > 0 ? applyedFilters : undefined
      );
    }
  }, [isLoadingMore, hasMore, country, applyedFilters, loadMoreStations]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [isOpen, handleLoadMore]);

  return (
    <>
      <Button onPress={onOpen} size="md" className="!p-4 relative rounded-xl">
        <ListUl />
        <span>List</span>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        placement="center"
        classNames={MODAL_STYLES}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <AppModalHeader
                ModalIcon={ListUl}
                modalName="Stations List"
                onClose={onClose}
              />
              <ModalBody className="p-4 gap-3 max-h-[60vh] overflow-y-auto">
                {stations.length > 0 &&
                  stations.map((station, index) => (
                    <StationCard
                      key={station.stationuuid}
                      station={station}
                      onPlay={playStation}
                      isCurrentlyPlaying={
                        index === currentStationIndex && isPlaying
                      }
                    />
                  ))}
                {stations.length === 0 && (
                  <p className="text-zinc-400">No stations available.</p>
                )}
                {hasMore && (
                  <div ref={loaderRef} className="flex justify-center py-4">
                    {isLoadingMore && <Spinner size="sm" color="current" />}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
