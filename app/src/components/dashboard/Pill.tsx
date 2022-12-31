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
    <h2
      className={`flex w-full cursor-pointer items-center justify-center rounded-full text-center capitalize ${
        active === name
          ? "bg-neutral-300 text-black"
          : "bg-neutral-700 text-white"
      } p-2 text-center`}
      onClick={() => setActive(name)}
    >
      {name}
      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500 text-sm text-white">
        {amount}
      </span>
    </h2>
  );
}

export default Pill;
