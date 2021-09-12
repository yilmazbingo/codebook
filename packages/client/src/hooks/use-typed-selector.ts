import {
  useSelector,
  TypedUseSelectorHook,
  createSelectorHook,
} from "react-redux";
import { RootState } from "../state";

// whenever we want to access any state inside of a component, we are going to use this type
// export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedSelector = createSelectorHook<RootState>();
