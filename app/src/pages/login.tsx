import Link from "next/link";

function Login() {
  return (
    <section>
      <h1>Login</h1>
      <Link href="/register">Register instead</Link>
    </section>
  );
}

export default Login;
