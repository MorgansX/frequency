export const PlayerFooter = ({
  totalStations,
  currentStation,
}: {
  totalStations: number;
  currentStation: number;
}) => (
  <div className="flex justify-center">
    <p className="text-xs text-zinc-500">
      Station {currentStation + 1} of {totalStations}
    </p>
  </div>
);
