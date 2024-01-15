import { useRef, useState, useEffect } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData() {
  const category = ["A", "B", "C", "D", "E"];
  const data = [];

  for (let i = 0; i < category.length; i++) {
    data.push({
      x: category[i],
      y: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

const Donut = () => {
  const [data, setData] = useState(getData());
  const divRef = useRef(null);
  const svgRef = useRef(null);
  const [drawData, setDrawData] = useState({
    width: "",
    height: 300,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
  });

  function changeData() {
    setData(getData());
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

      svg
        .append("g")
        .attr("class", "slices")
        .attr("transform", `translate(${currentWidth / 2},${height / 2})`);

      const colors = d3.scaleOrdinal(d3.schemeSet2);

      const radius = Math.min(currentWidth, height) / 2 - drawData.margin.left;
      const pieGenerator = d3.pie().value((d) => d.y);

      const arc = d3
        .arc()
        .innerRadius(radius * 0.3)
        .outerRadius(radius * 0.6);
      const pieData = pieGenerator(data);
      const total = d3.sum(data, (d) => d.y);
      data.forEach((d) => {
        d.percentage = Math.round((d.y / total) * 100);
      });
      const textArc = d3
        .arc()
        .innerRadius(radius * 0.3)
        .outerRadius(radius * 0.6);

      const chart = svg
        .select(".slices")
        .append("g")
        .selectAll("path")
        .data(pieData)
        .join(
          (enter) =>
            enter
              .append("path")
              .attr("d", arc)
              .attr("class", "arc")
              .attr("fill", colors)
              // .transition()
              // .duration(500)
              .attr("stroke", "#fff")
              .attr("stroke-width", "3px")
              .attr("opacity", 1),
          (update) => update,
          (exit) => exit.remove()
        );

      // chart
      //   .append("text")
      //   .attr("transform", (d) => `translate(${textArc.centroid(d)})`)
      //   .text((d) => d.data.item + d.data.percentage + "%")
      //   .style("text-anchor", "middle")
      //   .style("font-size", 16)
      //   .style("fill", "black");
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">甜圈圖 Donut Chart</h1>
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

export default Donut;
