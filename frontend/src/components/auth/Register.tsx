import { REGISTER } from "@/requetes/mutations/auth.mutations";
import {
  InputRegister,
  RegisterMutation,
  RegisterMutationVariables,
} from "@/types/graphql";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";


function Register() {

  const navigate = useNavigate();

  const [register, { error }] = useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(REGISTER, {
    onCompleted: (data) => {
      console.log(data);
      navigate("/auth/login");
    },
      onError(error) {
        console.log(error);
    },

  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as InputRegister;
    if (data.email && data.password) {
      register({
        variables: { infos: { email: data.email, password: data.password } },
      });
    }
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="email" placeholder="Indiquez votre email" />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Indiquez votre mot de passe"
          />
        </div>
        <input type="submit" />
        <div>
          <span className="text-red-500">{error?.message}</span>
        </div>
      </form>
    </main>
  );
}

export default Register;