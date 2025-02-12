import { useAuth } from "@/context/AuthContext";
import { LOGOUT } from "@/requetes/queries/auth.queries";
import { LogoutQuery, LogoutQueryVariables } from "@/types/graphql";
import { useQuery } from "@apollo/client";

function Logout() {
  const {getInfos} = useAuth();
  const { loading } = useQuery<LogoutQuery, LogoutQueryVariables>(LOGOUT, {
    fetchPolicy: "no-cache",
    async onCompleted() {
      await getInfos()
      //libre à vous ensuite de rediriger la personne quelque part... (en utilisant useNavigate)
    },
  });
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      {loading ? "Veuillez patienter..." : "Vous êtes déconnectés!"}
    </main>
  );
}

export default Logout;
