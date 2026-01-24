export const PlayerFooter = ({
  totalStations,
  currentStation,
}: {
  totalStations: number;
  currentStation: number;
}) => (
  <div className="px-4 pb-3 flex justify-center">
    <p className="text-xs text-zinc-500">
      Station {currentStation + 1} of {totalStations}
    </p>
  </div>
);
