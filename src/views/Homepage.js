import Line from "components/Line/Line";
import Scatter from "components/Scatter/Scatter";
import Area from "components/Area/Area";
import Bubble from "components/Bubble/Bubble";
import Bar from "components/Bar/Bar";
import Pie from "components/Pie/Pie";
import Donut from "components/Donut/Donut";
import MultipleBar from "components/MultipleBar/MultipleBar";
import StackedBar from "components/StackedBar/StackedBar";

const Homepage = () => {
  return (
    <section>
      <main className="w-[90%] mx-auto grid grid-cols-[repeat(2,1fr)] gap-4 justify-center bg-slate-200 max-[1000px]:grid-cols-[repeat(1,1fr)] max-[1000px]:w-[95%]">
        <Line />
        <Scatter />
        <Area />
        <Bubble />
        <Bar />
        <Pie />
        <Donut />
        <MultipleBar />
        <StackedBar />
      </main>
    </section>
  );
};

export default Homepage;
