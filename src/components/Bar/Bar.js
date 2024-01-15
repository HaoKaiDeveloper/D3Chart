import { useRef, useState, useEffect } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData() {
  const category = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const data = [];

  for (let i = 0; i < category.length; i++) {
    data.push({
      x: category[i],
      y: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

const Bar = () => {
  const [data, setData] = useState(getData());
  const divRef = useRef(null);
  const drawData = {
    width: "",
    height: 300,
    margin: 20,
  };

  function changeData() {
    setData(getData());
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
        .scaleBand()
        .domain(xData)
        .range([drawData.margin, currentWidth - drawData.margin])

        .padding(0.2);
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
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - drawData.margin - yScale(d.y)) //總高度-margin-y的高度
        .attr("data-y", (d) => d.y)
        .attr("fill", "#b2ebf2")
        .on("mouseover", function (event, data) {
          d3.select(event.target)
            .style("cursor", "pointer")
            .attr("fill", "#26c6da");
          svg
            .append("text")
            .attr("class", "tooltip")
            .attr("y", yScale(data.y + 1))
            .attr("x", xScale(data.x) + 14)
            .attr("fill", "black")
            .text(`${data.x}:${data.y}`);
        })
        .on("mouseout", function (event, data) {
          d3.select(event.target).attr("fill", "#b2ebf2");
          svg.selectAll(".tooltip").remove();
        });
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">長條圖 Bar Chart</h1>
      <div ref={divRef}></div>
      <div className="flex justify-end gap-2 mt-3">
        <Button type="changeData" onClickEven={changeData}>
          更新資料
        </Button>
      </div>
    </main>
  );
};

export default Bar;
