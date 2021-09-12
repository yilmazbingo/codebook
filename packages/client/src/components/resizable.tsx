import React, { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "./resizable.css";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  // ResizableBox does not support width=100%. width={Infinity} means take as much horizontal space possible.
  // when state changes, component will rerender, maxConstraint and minConstraint will be updated.
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  let resizableProps: ResizableBoxProps;
  useEffect(() => {
    // we should not update innerHeight and innerWidth frequently. to do so we use debouncing
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener("resize", listener);
    // whenever we set up a global event listener inside of a component, especially inside useEffect, we always clean up after ourselves.
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [width]);
  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      // width: innerWidth * 0.75,
      width: width,
      height: Infinity,
      resizeHandles: ["e"],
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
      // this will be called after user finishes resizing the panel.
      onResizeStop: (event, data) => {
        console.log("data inside onResizeStop prop", data);
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      width: Infinity,
      height: 300,
      resizeHandles: ["s"],
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, Infinity],
    };
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
