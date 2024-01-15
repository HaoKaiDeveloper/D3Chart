import { useState, useEffect, useRef } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData(num) {
  const data = [];

  for (let i = 0; i < num; i++) {
    data.push({
      x: i,
      y: Math.floor(Math.random() * 60),
    });
  }
  return data;
}

const Area = () => {
  const [data, setData] = useState(getData(7));
  const [drawData, setDrawData] = useState({
    width: "",
    height: 300,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
  });
  const divRef = useRef(null);

  function changeData() {
    setData(getData(7));
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

      const xAccessor = (d) => d.x;
      const yAccessor = (d) => d.y;

      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([drawData.margin.left, currentWidth - drawData.margin.right]);

      const xAxis = d3.axisBottom(xScale).ticks(7);

      const xAxisGroup = svg
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0,${height - drawData.margin.bottom})`);
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, yAccessor)])
        .range([height - drawData.margin.bottom, drawData.margin.top]);

      const yAxis = d3.axisLeft(yScale);
      const yAxisGroup = svg
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${drawData.margin.left},0)`);

      const areaGenerator = d3
        .area()
        .x((d) => xScale(xAccessor(d)))
        .y0(yScale(0))
        .y1((d) => yScale(yAccessor(d)))
        .curve(d3.curveBasis);

      const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))
        .curve(d3.curveBasis);

      svg
        .append("g")
        .append("path")
        .attr("d", areaGenerator(data))
        .attr("fill", "	rgba(255,204,188,0.4)");

      svg
        .append("g")
        .append("path")
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "rgb(255,204,188)")
        .attr("stroke-width", 3);

      //mouse event
      svg
        .append("rect")
        .style("fill", "transparent")
        .attr("width", currentWidth)
        .attr("height", height)
        .style("cursor", "pointer");
      // .on("mouseover", mouseover)
      // .on("mousemove", mousemove)
      // .on("mouseout", mouseout);

      const dot = svg
        .append("g")
        .append("circle")
        .style("fill", "	rgb(255,87,34)")
        .attr("storke", "rgb(255,87,34)")
        .attr("r", 4)
        .style("opacity", 0);

      const text = svg
        .append("g")
        .append("text")
        .style("opacity", 0)
        .attr("text-anchot", "left")
        .attr("alignment-baseline", "middle");

      function mouseover() {
        dot.style("opacity", 1);
        text.style("opacity", 1);
      }
      function mousemove(event) {
        const [x] = d3.pointer(event, this);
        const x0 = xScale.invert(x);
        const fixedX0 = Math.floor(x0);
        let i = d3.bisect(
          data.map((d) => d.x),
          fixedX0
        );
        let selectedData = data[i];
        if (selectedData) {
          dot
            .attr("cx", xScale(selectedData.x))
            .attr("cy", yScale(selectedData.y));

          text
            .html(`組別${selectedData.x},筆數${selectedData.y}`)
            .attr("x", xScale(selectedData.x) + 10)
            .attr("y", yScale(selectedData.y) - 10);
        }
      }
      function mouseout() {
        dot.style("opacity", 0);
        text.style("opacity", 0);
      }
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">面積圖 Area Chart</h1>
      <div ref={divRef}></div>
      <div className="flex justify-end gap-2 mt-3">
        <Button type="changeData" onClickEven={changeData}>
          更新資料
        </Button>
      </div>
    </main>
  );
};

export default Area;
