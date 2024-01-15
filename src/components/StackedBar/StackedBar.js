import { useRef, useState, useEffect } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData() {
  const group = ["A", "B", "C"];
  const data = [];

  for (let i = 0; i < group.length; i++) {
    data.push({
      group: group[i] + " Group",
      value1: Math.floor(Math.random() * 10),
      value2: Math.floor(Math.random() * 10),
      value3: Math.floor(Math.random() * 10),
    });
  }
  return data;
}

const StackedBar = () => {
  const [data, setData] = useState(getData(100));
  const divRef = useRef(null);
  const svgRef = useRef(null);
  const drawData = {
    width: "",
    height: 300,
    margin: 20,
  };

  function changeData() {
    setData(getData(100));
  }

  useEffect(() => {
    if (divRef.current && svgRef.current) {
      const currentWidth = divRef.current.offsetWidth;
      const height = drawData.height;
      const svg = d3
        .select(svgRef.current)
        .attr("width", currentWidth)
        .attr("height", height);
      svg.selectAll("*").remove();

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.group))
        .range([drawData.margin, currentWidth - drawData.margin])
        .padding(0.5);
      const xAxis = d3.axisBottom(xScale);
      const xAxisGroup = svg
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0,${height - drawData.margin})`);

      const yScale = d3
        .scaleLinear()
        .domain([0, 30])
        .range([height - drawData.margin, drawData.margin]);
      const yAxis = d3.axisLeft(yScale).ticks(7);

      const yAxisGroup = svg
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${drawData.margin},0)`);

      //['value1', 'value2', 'value3']
      const subgroups = Object.keys(data[0]).slice(1);

      const stackedData = d3.stack().keys(subgroups)(data);

      const color = d3.scaleOrdinal().domain(subgroups).range(d3.schemeSet2);

      svg
        .append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", (d) => {
          return color(d.key);
        })
        .selectAll("rect")
        .data((d) => {
          return d;
        })
        .join("rect")
        .attr("x", (d) => xScale(d.data.group))
        .attr("y", (d) => yScale(d[1]))
        .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .style("cursor", "pointer")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave);

      const text = svg
        .append("text")
        .attr("class", "tooltip")
        .style("fill", "black")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .style("opacity", 0);

      function mouseover(event, d) {
        const start = d[0];
        const end = d[1];
        text
          .style("opacity", 1)
          .attr("x", xScale(d.data.group))
          .attr("y", yScale(d[1]))
          .html(`${end - start}個單位`);
      }
      function mouseleave() {
        text.style("opacity", 0);
      }
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">
        堆疊長條圖 Stacked Bar Chart
      </h1>
      <div ref={divRef}>
        <svg ref={svgRef}></svg>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <Button type="changeData" onClickEven={changeData}>
          更新資料
        </Button>
      </div>
    </main>
  );
};

export default StackedBar;
