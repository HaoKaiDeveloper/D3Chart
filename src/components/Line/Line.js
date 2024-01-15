import { useState, useEffect, useRef } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData() {
  const xData = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const data = [];
  for (let i = 0; i < xData.length; i++) {
    data.push({
      x: xData[i],
      y: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

const Line = () => {
  const [data, setData] = useState(getData());
  const divRef = useRef(null);
  const drawData = {
    width: "",
    height: 300,
    margin: 20,
  };

  function changeData() {
    const newData = getData();
    setData(newData);
  }

  useEffect(() => {
    if (divRef.current) {
      d3.select(divRef.current).selectAll("svg").remove();

      const currentWidth = divRef.current.offsetWidth;
      const height = drawData.height;

      const svg = d3
        .select(divRef.current)
        .append("svg")
        .attr("width", currentWidth)
        .attr("height", height);

      const xData = data.map((d) => d.x);
      const yData = data.map((d) => d.y);

      const xScale = d3
        .scalePoint()
        .domain(xData)
        .range([drawData.margin, currentWidth - drawData.margin]);

      const xAxis = d3.axisBottom(xScale);
      const xAxisGroup = svg
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0,${height - drawData.margin})`);

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(yData))
        .range([height - drawData.margin, drawData.margin]);
      const yAxis = d3.axisLeft(yScale);
      const yAxisGroup = svg
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${drawData.margin},0)`);

      const lineGenerator = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));
      // .curve(d3.curveBasis);

      svg
        .append("path")
        .attr("d", lineGenerator(data))
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", "1");

      svg
        .append("rect")
        .attr("fill", "transparent")
        .attr("width", currentWidth)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mousemove", (event) => mousemove(event, data, xScale, yScale))
        .on("mouseout", mouseout);

      const dot = svg
        .append("g")
        .append("circle")
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("r", 3)
        .style("opacity", 0);

      const text = svg
        .append("g")
        .append("text")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");

      function mouseover(even, data) {
        dot.style("opacity", 1);
        text.style("opacity", 1);
      }
      function mousemove(event, data, xScale, yScale) {
        const [x] = d3.pointer(event);
        const domain = xScale.domain();
        const range = xScale.range();
        const step = (range[1] - range[0]) / (domain.length - 1);
        const index = Math.round(x / step);
        let selectedData = data[index];
        if (selectedData) {
          dot
            .attr("cx", xScale(selectedData.x))
            .attr("cy", yScale(selectedData.y));
          text
            .html(`${selectedData.x}組:${selectedData.y}`)
            .attr("x", xScale(selectedData.x) + 10)
            .attr("y", yScale(selectedData.y) - 10);
        }
      }
      function mouseout(even, data) {
        dot.style("opacity", 0);
        text.style("opacity", 0);
      }
    }
  }, [data]);
  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">折線圖 Line Chart</h1>
      <div ref={divRef}></div>
      <div className="flex justify-end gap-2 mt-3">
        <Button type="changeData" onClickEven={changeData}>
          更新資料
        </Button>
      </div>
    </main>
  );
};

export default Line;
