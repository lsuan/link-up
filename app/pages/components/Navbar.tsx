function Navbar() {
  return (
    <section className= "flex justify-between dark-puple">
      <h1 className="text-5xl">
        Link Up!
      </h1>
      <ul className="action-btns flex justify-around items-center gap-8">
        <li className="text-indigo-400/75 hover:text-indigo-500/75">
          Login
        </li>
        <li className="text-indigo-400/75 hover:text-indigo-500/75">
          Sign Up
        </li>
      </ul>
    </section>
  );
}

export default Navbar;