import { CellTypes } from "./../cell";
import { Dispatch } from "redux";
import bundle from "../../bundler";
import {
  Action,
  UpdateCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  MoveCellACtion,
  Direction,
} from "../actions/index";
import { ActionType } from "../action-types";

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return { type: ActionType.UPDATE_CELL, payload: { id, content } };
};
export const deleteCell = (id: string): DeleteCellAction => {
  return { type: ActionType.DELETE_CELL, payload: id };
};
export const moveCell = (id: string, direction: Direction): MoveCellACtion => {
  return { type: ActionType.MOVE_CELL, payload: { id, direction } };
};
export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: { id, type: cellType },
  };
};

export const createBundle = (cellId: string, inputCode: string) => async (
  dispatch: Dispatch<Action>
) => {
  dispatch({
    type: ActionType.BUNDLE_START,
    payload: {
      cellId,
    },
  });
  const result = await bundle(inputCode);
  dispatch({
    type: ActionType.BUNDLE_COMPLETE,
    payload: {
      cellId,
      bundle: result,
    },
  });
};
