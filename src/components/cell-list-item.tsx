import React, { useState, useEffect } from "react";
import ActionBar from "./action-bar";
import { Cell } from "../state";
import CodeCell from "./code-cell";
import TextEditor from "./text-editor";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  console.log("Cell id inside cell item", cell.id);
  let child: JSX.Element;
  if (cell.type === "code") {
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        {/* I either have to set z-index for ActionBar or have this structure */}
        {/* trying to avoid z-index */}
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );
  }
  return (
    // we need to set this relative for action-bar absoulute to work
    <div className="cell-list-item">{child}</div>
  );
};
export default CellListItem;
