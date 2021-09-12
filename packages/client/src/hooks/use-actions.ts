import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

export const useActions = () => {
  // since we are using the value dispatch defined in component inside useEffect, we add dispatch to dependency array.
  const dispatch = useDispatch();
  // Turns an object whose values are action creators, into an object with the same keys, but with every action creator wrapped into a dispatch call so they may be invoked directly.
  return useMemo(() => {
    // since actionCreators is imported we do not add it to the end of the array.
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
