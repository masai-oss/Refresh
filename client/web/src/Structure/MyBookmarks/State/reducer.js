import {
  GET_BOOKMARKS_COUNT_FAILURE,
  GET_BOOKMARKS_COUNT_LOADING,
  GET_BOOKMARKS_COUNT_SUCCESS,
  GET_TOPICWISE_BOOKMARKS_FAILURE,
  GET_TOPICWISE_BOOKMARKS_LOADING,
  GET_TOPICWISE_BOOKMARKS_SUCCESS,
} from "./actionTypes";
import { storageEnums } from "../../../Enums/storageEnums";
import {
  getFromStorage,
  saveToStorage,
} from "../../../Utils/localStorageHelper";
import {
  GET_NEXT_QUESTION_FAILURE,
  GET_PRACTICE_TOPICS_FAILURE,
} from "../../Practice/State/actionTypes";
const initState = {
  isLoading: false,
  isError: false,
  errMessage: "",
  myBookmarks: [],
  topicwiseBookmarks: null,
};

const myBookmarks = (state = initState, { type, payload }) => {
  switch (type) {
    case GET_BOOKMARKS_COUNT_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
        errMessage: "",
        myBookmarks: [],
      };
    case GET_BOOKMARKS_COUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        errMessage: "",
        myBookmarks: [...payload],
      };
    case GET_BOOKMARKS_COUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errMessage: "Error fetching bookmarks",
        myBookmarks: [],
      };

    case GET_TOPICWISE_BOOKMARKS_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
        errMessage: "",
        topicwiseBookmarks: null,
      };
    case GET_TOPICWISE_BOOKMARKS_SUCCESS:
      console.log("");
      return {
        ...state,
        isLoading: false,
        isError: false,
        errMessage: "",
        topicwiseBookmarks: payload,
      };
    case GET_TOPICWISE_BOOKMARKS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errMessage: "Error fetching topicwise bookmarks",
        topicwiseBookmarks: null,
      };
    default:
      return { ...state };
  }
};
export { myBookmarks };
