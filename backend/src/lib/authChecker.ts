import { AuthChecker } from "type-graphql";
import { MyContext } from "..";
export const customAuthChecker: AuthChecker<MyContext> = (
  { context },
  roles
) => {
  if (context.user && roles.includes(context.user.role)) { // on peut imaginer que si le user n'est pas null et qu'il a le rôle faisant partie du tableau de rôle indiqué dans le décorateur Authorized(["MANAGER"]) on le laisse passer 
    return true;
  }
  return false;
};