import { useRef, useState, useEffect } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData(num) {
  const category = ["A", "B", "C", "D", "E"];
  const data = [];

  for (let i = 0; i < num; i++) {
    data.push({
      x: Math.random() * 10,
      y: Math.floor(Math.random() * 100),
      z: Math.floor(Math.random() * 100),
      category: category[Math.floor(Math.random() * 5)],
    });
  }
  return data;
}

const Bubble = () => {
  const [data, setData] = useState(getData(20));
  const divRef = useRef(null);
  const svgRef = useRef(null);
  const toolTipRef = useRef(null);

  const drawData = {
    width: "",
    height: 300,
    margin: 20,
  };
  function changeData() {
    setData(getData(20));
  }

  useEffect(() => {
    if (divRef.current && svgRef.current) {
      const width = divRef.current.offsetWidth;
      const height = drawData.height;
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height);
      svg.selectAll("*").remove();

      d3.select(divRef.current).style("position", "relative");

      const tooltip = d3
        .select(toolTipRef.current)
        .style("background-color", "white")
        .style("border-radius", "10px")
        .style("padding", "10px")
        .style("color", "black")
        .style("position", "absolute")
        .style("top", 0 + "px")
        .style("left", 0 + "px")
        .style("display", "none");

      // svg.selectAll("*").remove();
      const xData = data.map((d) => d.x);
      const yData = data.map((d) => d.y);
      const zData = data.map((d) => d.z);

      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(xData)])
        .range([drawData.margin, width - drawData.margin]);

      const xAxis = d3.axisBottom(xScale).ticks(10);
      const xAxisGroup = svg
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0,${height - drawData.margin})`);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(yData)])
        .range([height - drawData.margin, drawData.margin]);
      const yAxis = d3.axisLeft(yScale).ticks(10);
      const yAxisGroup = svg
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${drawData.margin},0)`);

      const radiusScale = d3
        .scaleLinear()
        .domain(d3.extent(zData))
        .range([3, 14]);

      const bubbleColor = d3
        .scaleOrdinal()
        .domain(["A", "B", "C", "D", "E"])
        .range(d3.schemeSet1);

      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", (d) => radiusScale(d.z))
        .attr("fill", (d) => bubbleColor(d.category))
        .style("opacity", 0.3)
        .on("mouseover", function (event, data) {
          d3.select(event.target)
            .style("opacity", 1)
            .style("cursor", "pointer");
        })
        .on("mousemove", function (event, data) {
          const [x, y] = d3.pointer(event);

          tooltip
            .style("display", "block")
            .style("color", bubbleColor(data.category))
            .html(
              `
              category:${data.category}<br/>
              x:${data.x.toFixed(2)}<br/>
              y:${data.y}<br/>
              z:${data.z}
              `
            )
            .style("top", y + "px")
            .style("left", x + 10 + "px");
        })
        .on("mouseout", function (event) {
          d3.select(event.target).style("opacity", 0.3);

          tooltip.style("display", "none");
        });
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">氣泡圖 Bubble Chart</h1>
      <div ref={divRef}>
        <svg ref={svgRef}></svg>
        <div ref={toolTipRef}></div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <Button type="changeData" onClickEven={changeData}>
          更新資料
        </Button>
      </div>
    </main>
  );
};

export default Bubble;
