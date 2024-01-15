import { useRef, useState, useEffect } from "react";
import Button from "../Layout/Button";
import * as d3 from "d3";

function getData() {
  const category = ["A", "B", "C"];
  const data = [];

  for (let i = 0; i < category.length; i++) {
    data.push({
      group: category[i] + " Group",
      subgroups: [
        { category: "Category 1", value: Math.floor(Math.random() * 99) },
        { category: "Category 2", value: Math.floor(Math.random() * 99) },
        { category: "Category 3", value: Math.floor(Math.random() * 99) },
      ],
    });
  }
  return data;
}

const MultipleBar = () => {
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

      //分類別所以是用scaleBand
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.group))
        .range([drawData.margin, currentWidth - drawData.margin])
        .padding(0.2);
      const xAxis = d3.axisBottom(xScale);
      const xAxisGroup = svg
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0,${height - drawData.margin})`);

      //y軸是正常數字使用scaleLinear
      const yScale = d3
        .scaleLinear()
        .domain([0, 99])
        .range([height - drawData.margin, drawData.margin]);
      const yAxis = d3.axisLeft(yScale);
      const yScaleGroup = svg
        .append("g")
        .call(yAxis)
        .attr("transform", `translate(${drawData.margin},0)`);

      //每一個group裡面都有分三類
      const x1 = d3
        .scaleBand()
        .domain(["Category 1", "Category 2", "Category 3"])
        .range([0, xScale.bandwidth()]) //group之間的間隔的寬度
        .padding(0.05); //每一個category裡面的間隔

      // data[0].subgroups.map(d=>d.category)就是["Category 1","Category 2","Category 3"]
      const color = d3
        .scaleOrdinal()
        .domain(data[0].subgroups.map((d) => d.category))
        .range(d3.schemeSet2);

      /**
      一筆資料建立一個'g',裡面放3個rect,
      共有三筆資料，所以有3個'g',9個rect
      */
      svg
        .append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d) => `translate(${xScale(d.group)},0)`)
        .selectAll("rect")
        .data((d) => d.subgroups)
        .join("rect")
        .attr("x", (d) => {
          return x1(d.category);
        })
        .attr("y", (d) => yScale(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", (d) => height - yScale(d.value) - drawData.margin)
        .attr("fill", (d) => color(d.category))
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

      function mouseover(event, d) {
        const [x, y] = d3.pointer(event, svg.node());
        d3.select(event.target)
          .style("cursor", "pointer")
          .attr("fill", "#90caf9");
        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", x)
          .attr("y", y - 10)
          .attr("fill", "black")
          .text(`${d.category}=${d.value}`);
      }
      function mouseout(event, d) {
        d3.select(event.target).attr("fill", (d) => color(d.category));

        svg.selectAll(".tooltip").remove();
      }
    }
  }, [data]);

  return (
    <main className="w-full h-[400px] bg-slate-50 p-2">
      <h1 className="text-center text-xl font-bold">
        複數長條圖 multiple bar chart
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

export default MultipleBar;
