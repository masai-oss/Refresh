import { 
  GET_RESULT_LOADING,
  GET_RESULT_SUCCESS,
  GET_RESULT_FAILURE
} from "./actionTypes";
import axios from "axios";
import { getFromStorage } from "../../../Utils/localStorageHelper"
import { storageEnums } from "../../../Enums/storageEnums"
const RESULT_API = process.env.REACT_APP_ATTEMPT_URL;



export const getResultRequest = () => ({
  type: GET_RESULT_LOADING,
});

export const getResultSuccess = (payload) => ({
  type: GET_RESULT_SUCCESS,
  payload,
});

export const getResultFailure = (payload) => ({
  type: GET_RESULT_FAILURE,
  payload,
});


export const getResult = ({attempt_id}) => (dispatch) => {
  console.log(`${RESULT_API}/result/${attempt_id}`)
  dispatch(getResultRequest())
  const token = getFromStorage(storageEnums.TOKEN, "");
  axios({
    method: "GET",
    url: `${RESULT_API}/result/${attempt_id}`,
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => dispatch(getResultSuccess(res.data.result)))
  .catch((err) => dispatch(getResultFailure(err)));
};
