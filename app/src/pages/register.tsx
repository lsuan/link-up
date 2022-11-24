import Link from "next/link";

function Register() {
  return (
    <section>
      <h1>Register</h1>
      <Link href="/login">Login instead</Link>
    </section>
  );
}

export default Register;
