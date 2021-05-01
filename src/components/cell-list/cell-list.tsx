import { Fragment } from "react";
import CellListItem from "../cell-list-item";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AddCell from "../add-cell";
import { RootState } from "../../state/reducers";
import { CellsState } from "../../state/reducers/cellsReducer";
import "./cell-list.css";

const CellList: React.FC = () => {
  const cellState = useSelector(
    (state: RootState) => state.cells
  ) as CellsState;
  const cells = cellState?.order.map((id) => cellState.data[id]);

  const renderedCells = cells.map((cell) => (
    // we could not add any prop to <></>
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));
  return (
    <div className="cell-list">
      {/* when we click on new cell, a new cell is created on the array. but this is still same */}
      {/* if it was under, we would have fade effect */}
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};
export default CellList;
