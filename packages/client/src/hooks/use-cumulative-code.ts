import { RootState } from "./../state/reducers/index";
import { useSelector } from "react-redux";

export const useCumulativeHook = (cellId: string) => {
  return useSelector((state: RootState) => {
    const { data, order } = state.cells;
    // [{content:"",id:"",type:""},] orderedCells is array of objects
    const orderedCells = order.map((id: string) => data[id]);
    const showFunc = `
    import _React from "react"
    import _ReactDOM from "react-dom"
    var show=(value)=>{
      const root= document.querySelector('#root')
      if(typeof value==='object'){
        if(value.$$typeof && value.props){
          _ReactDOM.render(value, root)
        }
        else{
          root.innerHTML=JSON.stringify(value)
        }
      } else{
        root.innerHTML=value
      }
    }
    `;
    // Noop stands for no-operation
    // with "var" we can call declarre twice.
    const showFuncNoop = "var show=()=>{}";
    const cumulativeCode = [];
    for (let code of orderedCells) {
      if (code.type === "code") {
        if (code.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(code.content);
      }
      // we stop when it gets to the current cell that was passed into our component
      // we pick up the code from previous cells until this current cell.
      if (code.id === cellId) {
        // break early out of the loop
        break;
      }
    }
    console.log("joined code", cumulativeCode.join("\n"));
    return cumulativeCode;
  }).join("\n");
};
