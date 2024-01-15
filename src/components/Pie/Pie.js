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

const Pie = () => {
  const [data, setData] = useState(getData());
  const divRef = useRef(null);
  const svgRef = useRef(null);
  const drawData = {
    width: "",
    height: 300,
    margin: 20,
  };

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

      // 圓餅圖的g移到svg中央
      const arcGroup = svg
        .append("g")
        .attr("transform", `translate(${currentWidth / 2},${height / 2})`);

      //預定的色票
      const colors = d3.scaleOrdinal(d3.schemeSet2);
      //設定半徑
      const radius = Math.min(currentWidth, height) / 2 - drawData.margin;
      //因為是用path畫所以有需要用data計算出d的值
      const pieGenerator = d3.pie().value((d) => d.y);
      //設定圓餅內圈外圈的半徑
      const arc = d3.arc().innerRadius(0).outerRadius(radius).padAngle(0);

      // 把data帶給pieGenerator計算d值
      const pieData = pieGenerator(data);

      // 建立pie
      const chart = arcGroup.selectAll("path").data(pieData).enter();

      chart
        .append("path")
        .attr("d", arc)
        .attr("fill", colors)
        .attr("storke", "#fff")
        .style("stroke-width", "3px")
        .style("opacity", 1);

      // 計算百分比
      const total = d3.sum(data, (d) => d.y);
      data.forEach((d) => {
        d.percentage = Math.round((d.y / total) * 100);
      });

      const textArc = d3
        .arc()
        .innerRadius(radius)
        .outerRadius(radius / 2);

      chart
        .append("text")
        .attr("transform", (d) => {
          return `translate(${textArc.centroid(d)}) `;
        })
        .text((d) => {
          return Math.abs(d.startAngle - d.endAngle) > 0.2
            ? d.data.x + d.data.percentage + "%"
            : "";
        })
        .style("text-anchor", "middle")
        .style("font-size", 16)
        .style("fill", "black");
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">圓餅圖 Pie Chart</h1>
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

export default Pie;
