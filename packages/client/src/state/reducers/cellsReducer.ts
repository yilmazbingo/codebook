import produce from "immer";
import { Cell } from "../cell";
import { ActionType } from "../action-types";
import { Action } from "../actions";
//  check what cell is in cell.ts
export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: { [key: string]: Cell };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  // order of cells. store the id's of cells
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;

    case ActionType.FETCH_CELL_COMPLETE:
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState["data"]);
      return state;

    case ActionType.FETCH_CELL_ERROR:
      (state.loading = false), (state.error = action.payload);
      return state;

    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;

    // id is used with order and data. if remove cell, ne have to delete the id in both locations
    // case ActionType.DELETE_CELL:
    //   delete state.data[action.payload];
    //   state.order = state.order.filter((id) => id !== action.payload);
    //   //  WE RETURN STATE FOR TS. OTHERWISE IT WILL CONSIDER IT UNDEFINED
    //   return state;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);

      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);

      // if we move up, target index will decrease. it will move to top of the page or to the beginning of the array
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;

    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: randomId(),
      };
      state.data[cell.id] = cell;
      // returns -1
      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );
      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        // remove ) element and add cell.id
        state.order.splice(foundIndex + 1, 0, cell.id);
      }

      return state;
    default:
      return state;
  }
});

const randomId = () => {
  // base 36 meand all number 0-9 and a-z letters
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
