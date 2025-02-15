import jwt_decode from "jwt-decode";
import { getFromStorage } from "../../../Utils/localStorageHelper";
import { storageEnums } from "../../../Enums/storageEnums";

const IsAdmin = () => {
  const token = getFromStorage(storageEnums.TOKEN, null);
  if (token === null) {
    return false;
  }
  const { admin: isAdmin } = jwt_decode(token);

  return isAdmin;
};

export { IsAdmin };
