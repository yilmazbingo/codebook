import { ActionType } from "../action-types";
import { CellTypes, Cell } from "../cell";

export type Direction = "up" | "down";

export interface MoveCellACtion {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellTypes;
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: { cellId: string };
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: { cellId: string; bundle: { code: string; error: string } };
}

export interface FetchCellsAction {
  type: ActionType.FETCH_CELLS;
}

export interface FetchCellsCompleteAction {
  type: ActionType.FETCH_CELL_COMPLETE;
  // payload is the response from the api
  payload: Cell[];
}

export interface FetchCellsErrorAction {
  type: ActionType.FETCH_CELL_ERROR;
  payload: string;
}

export interface SaveCellsErrorAction {
  type: ActionType.SAVE_CELLS_ERROR;
  payload: string;
}
export type Action =
  | MoveCellACtion
  | DeleteCellAction
  | InsertCellAfterAction
  | BundleStartAction
  | BundleCompleteAction
  | UpdateCellAction
  | FetchCellsAction
  | FetchCellsCompleteAction
  | FetchCellsErrorAction
  | SaveCellsErrorAction;
