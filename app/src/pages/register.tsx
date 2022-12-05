import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../utils/trpc";

type RegisterInputs = {
  email: string;
  password: string;
};

function Register() {
  const createUser = trpc.user.createUser.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const newUser = await createUser.mutateAsync(data);
    console.log(newUser);

    // TODO: redirect to dashboard
  };

  return (
    <section>
      <h1 className="mb-4">Register</h1>
      <Link href="/login">Login instead</Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label>Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /[\w]+@[a-z]+[\.][a-z]+/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email?.message}
        </div>
        <div className="flex flex-col">
          <label>Password</label>
          <input
            type={"password"}
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password?.message}
        </div>

        <button type="submit">Register</button>
      </form>
    </section>
  );
}

export default Register;
