function AuthDivider() {
  return (
    <div className="relative my-8 flex w-full items-center justify-between text-center text-neutral-200">
      <hr className="w-full rounded-lg" />
      <span className="absolute left-1/2 w-fit -translate-x-1/2 bg-white px-4">
        or continue with
      </span>
    </div>
  );
}

export default AuthDivider;
