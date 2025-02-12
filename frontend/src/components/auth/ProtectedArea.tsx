import { CHECK_TOKEN } from "@/requetes/queries/auth.queries";
import { CheckTokenQuery } from "@/types/graphql";
import { useQuery } from "@apollo/client";
import { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//pour l'instant je prévoir un énum comme ça, mais lorsque le back aura cette fonctionnalité, on prendra le type depuis codegen
enum Role {
  "ADMIN",
  "USER",
}

function ProtectedArea({
  children,
  role = Role["USER"], // par défaut le rôle est USER
}: PropsWithChildren & { role?: Role }) {
  console.log("%c⧭", "color: #00e600", role);
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useQuery<CheckTokenQuery>(CHECK_TOKEN, {
    onError(error) {
      console.log(error); //on verra comment on gère l'erreur
    },
    onCompleted(data) {
      console.log("%c⧭", "color: #00a3cc", data);
      if (!data.checkToken) {
        //si la personne n'est pas connectée, on la redirige vers /auth/login, et on envoie désormais la route initialement jointe
        navigate("/auth/login", { state: { initialRoute: location.pathname } });
        return;
      }
      //ici on imaginera stocker dans le contexte les infos contenu dans data

      //on pourra même imaginer regarder le rôle du user
    },
    fetchPolicy: "no-cache",
  });

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  return <div>{children}</div>;
}

export default ProtectedArea;

