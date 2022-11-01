function Navbar() {
  return (
    <section className= "flex justify-between dark-puple">
      <h1 className="text-5xl">
        Link Up!
      </h1>
      <ul className="action-btns">
        <li>
          Login
        </li>
        <li>
          Sign Up
        </li>
      </ul>
    </section>
  );
}

export default Navbar;