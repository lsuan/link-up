function ModalBackground({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen?: (state: boolean) => void;
}) {
  if (!isModalOpen) {
    return null;
  }
  return (
    <div
      className="absolute top-0 left-0 z-30 h-full w-full overflow-hidden bg-neutral-700 opacity-90 blur-sm transition-all"
      onPointerDown={setIsModalOpen ? () => setIsModalOpen(false) : undefined}
    />
  );
}

export default ModalBackground;
