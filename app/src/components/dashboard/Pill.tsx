function Pill({
  name,
  active,
  setActive,
  amount,
}: {
  name: string;
  active: string;
  setActive: (name: string) => void;
  amount: number;
}) {
  return (
    <button
      className={`w-full cursor-pointer rounded-full p-2 text-center capitalize transition-colors ${
        active === name
          ? "bg-neutral-300 text-black"
          : "bg-neutral-500 text-white hover:bg-neutral-600"
      }`}
      onClick={() => setActive(name)}
    >
      <h2 className="flex items-center justify-center">
        {name}
        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-700 text-sm text-white">
          {amount}
        </span>
      </h2>
    </button>
  );
}

export default Pill;
