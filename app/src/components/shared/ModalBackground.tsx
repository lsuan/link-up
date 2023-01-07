function ModalBackground({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen?: (state: boolean) => void;
}) {
  return (
    <>
      {isModalOpen && (
        <div
          className="absolute top-0 left-0 z-30 h-full w-full overflow-hidden bg-neutral-700 opacity-90 blur-sm transition-all"
          onClick={
            setIsModalOpen ? () => setIsModalOpen(!isModalOpen) : undefined
          }
        />
      )}
    </>
  );
}

export default ModalBackground;
