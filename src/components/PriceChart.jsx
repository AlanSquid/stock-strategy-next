import React, { useState } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CandlestickSeries,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  OHLCTooltip,
  withDeviceRatio,
  withSize,
} from "react-financial-charts";

// const axisStyles = {
//   strokeStyle: "#383E55",
//   strokeWidth: 2,
//   tickLabelFill: "#9EAAC7",
//   tickStrokeStyle: "#383E55",
//   gridLinesStrokeStyle: "rgba(56, 62, 85, 0.5)"
// };

// const coordinateStyles = {
//   fill: "#383E55",
//   textFill: "#FFFFFF"
// };

// const zoomButtonStyles = {
//   fill: "#383E55",
//   fillOpacity: 0.75,
//   strokeWidth: 0,
//   textFill: "#9EAAC7"
// };

// const crossHairStyles = {
//   strokeStyle: "#9EAAC7"
// };

const openCloseColor = (d) => (d.close > d.open ? "#ef5350" : "#26a69a"); // 根據收盤價和開盤價的關係來決定顏色
const candleStrokeColor = ({ close, open }) =>
  close > open ? "#ef5350" : "#26a69a";
const candleFillColor = ({ close, open }) =>
  close > open ? "rgba(239, 83, 80, 0.3)" : "rgba(38, 166, 154, 0.3)";

const yExtentsCalculator = ({ plotData }) => {
  let min, max;
  for (const { low, high } of plotData) {
    if (min === undefined) min = low;
    if (max === undefined) max = high;
    if (low !== undefined && min > low) min = low;
    if (high !== undefined && max < high) max = high;
  }
  if (min === undefined) min = 0;
  if (max === undefined) max = 0;

  const padding = (max - min) * 0.1;
  return [min - padding, max + padding * 2];
};

const CandlestickChart = ({
  dateTimeFormat = "%Y-%m-%d",
  height,
  margin = { left: 0, right: 48, top: 0, bottom: 24 },
  priceDisplayFormat = format(".2f"),
  ratio,
  width,
  stockData,
}) => {
  const [resetCount, setResetCount] = useState(0);
  // console.log(stockData);
  if (!height || !ratio || !width || !stockData) return null;
  //
  const processedData = stockData.map((d) => ({
    ...d,
    open: parseFloat(d.open),
    high: parseFloat(d.high),
    low: parseFloat(d.low),
    close: parseFloat(d.close),
    date: d.date,
  }));

  const timeDisplayFormat = timeFormat(dateTimeFormat);
  const parseDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return new Date(`${year}-${month}-${day}`);
  };

  const xScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) =>
      parseDate(d.date)
    );
  const {
    data: scaleData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = xScaleProvider(processedData);

  const min = xAccessor(
    scaleData[Math.max(0, scaleData.length - parseInt(width / 5))]
  );
  const max = xAccessor(scaleData[scaleData.length - 1]);
  const xExtents = [min, max + 1];

  return (
    <ChartCanvas
      height={height}
      ratio={ratio}
      width={width}
      margin={margin}
      seriesName={`Chart ${resetCount}`}
      data={scaleData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
      <Chart id={1} yExtentsCalculator={yExtentsCalculator}>
        {/* x軸 */}
        <XAxis className="axis" showGridLines />

        {/* y軸 */}
        <YAxis className="axis" showGridLines />

        {/* 鼠標顯示目前的對應的位置 */}
        <MouseCoordinateX
          displayFormat={timeDisplayFormat}
          className="coordinate"
        />

        {/* 鼠標顯示目前對應的Y軸 */}
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={priceDisplayFormat}
          className="coordinate"
        />

        {/* 在右邊顯示最新的收盤價 */}
        <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={priceDisplayFormat}
          yAccessor={(d) => d.close}
        />

        {/* 顯示K線圖 */}
        <CandlestickSeries
          stroke={candleStrokeColor}
          fill={candleFillColor}
          wickStroke={candleStrokeColor}
        />

        {/* 上面顯示開盤價和收盤價的工具提示 */}
        <OHLCTooltip origin={[8, 16]} textFill={openCloseColor} />

        {/* 放大縮小按鈕 */}
        <ZoomButtons
          onReset={() => setResetCount(resetCount + 1)}
          className="zoom-button"
        />
      </Chart>

      {/* 十字虛線 */}
      <CrossHairCursor className="crosshair" />
    </ChartCanvas>
  );
};

// 使用 withSize 和 withDeviceRatio 來處理圖表的尺寸和設備比例
export const PriceChart = withSize({ style: { minHeight: 600 } })(
  withDeviceRatio()(CandlestickChart)
);
