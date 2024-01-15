import { useRef, useState, useEffect } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData(num) {
  const data = [];

  for (let i = 0; i < num; i++) {
    data.push({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

const Scatter = () => {
  const [data, setData] = useState(getData(100));
  const divRef = useRef(null);
  const drawData = {
    width: "",
    height: 300,
    margin: 20,
  };
  function changeData() {
    setData(getData(100));
  }

  useEffect(() => {
    if (divRef.current) {
      const currentWidth = divRef.current.offsetWidth;
      const height = drawData.height;
      d3.select(divRef.current).selectAll("svg").remove();

      const svg = d3
        .select(divRef.current)
        .append("svg")
        .attr("width", currentWidth)
        .attr("height", height);
      svg.selectAll("*").remove();

      const xData = data.map((d) => d.x);
      const yData = data.map((d) => d.y);

      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(yData)])
        .range([drawData.margin, currentWidth - drawData.margin]);
      const xAxis = d3.axisBottom(xScale);
      const xAxisGroup = svg
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0,${height - drawData.margin})`);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(yData)])
        .range([height - drawData.margin, drawData.margin]);
      const yAxis = d3.axisLeft(yScale);
      const yAxisGroup = svg
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${drawData.margin},0)`);

      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 3)
        .attr("fill", "#03a9f4")
        .attr("stroke", "#03a9f4")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

      function mouseover(event, d) {
        const [x, y] = d3.pointer(event);

        d3.select(this)
          .attr("fill", "red")
          .attr("r", 6)
          .style("cursor", "pointer");

        svg
          .append("text")
          .attr("id", "tooltip")
          .attr("x", x + 10)
          .attr("y", y - 10)
          .attr("text-anchor", "left")
          .attr("alignment-baseline", "middle")
          .html(`x:${d.x},y:${d.y}`);
      }
      function mouseout(event) {
        d3.select(this).attr("fill", "#03a9f4").attr("r", 3);

        d3.selectAll("#tooltip").remove();
      }
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">點散圖 Scatter Chart</h1>
      <div ref={divRef}></div>
      <div className="flex justify-end gap-2 mt-3">
        <Button type="changeData" onClickEven={changeData}>
          更新資料
        </Button>
      </div>
    </main>
  );
};

export default Scatter;
