import React, {useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as echarts from 'echarts';

//import ReactECharts from 'echarts-for-react';

var chk = 0;
//const {optionList} = this.state;
const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#0041da';
const downBorderColor = '#0e40b5';
// Each item: open，close，lowest，highest

let chart;

let data0 = {categoryData: [], values: []};

function splitData(rawData) {
  const categoryData = [];
  const values = [];
  for (var i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
  }
  return {
    categoryData: categoryData,
    values: values
  };
}
function calculateMA(dayCount) {
  var result = [];
  for (var i = 0, len = data0.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += +data0.values[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}

function Chart2() {
	const chartRef = useRef(null);
	//const selectRef = useRef(null);
	const [ItemList, setItemList] = useState({});
	const [loading, setLoading] = useState(true);
	
	let [options, setOptions] = useState({
		title: {
			text: '',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		legend: {
			data: ['일봉', 'MA5', 'MA10', 'MA20', 'MA30'],
			orient: 'vertical',
			left: 'left'
		},
		grid: {
			left: '10%',
			right: '10%',
			bottom: '15%'
		},
		xAxis: {
			type: 'category',
			data: data0.categoryData,
			boundaryGap: false,
			axisLine: { onZero: false },
			splitLine: { show: false },
			min: 'dataMin',
			max: 'dataMax',
			textStyle: {
				fontSize: 20
			}
		},
		yAxis: {
			scale: true,
			splitArea: {
				show: true
			}
		},
		dataZoom: [
			{
				type: 'inside',
				start: 0,
				end: 100
			},
			{
				show: true,
				type: 'slider',
				top: '90%',
				start: 50,
				end: 100
			}
		],
		series: [
			{
				name: '일K',
				type: 'candlestick',
				data: data0.values,
				itemStyle: {
					color: upColor,
					color0: downColor,
					borderColor: upBorderColor,
					borderColor0: downBorderColor
				},
				/*
				markPoint: {
					label: {
						formatter: function (param) {
							return param != null ? Math.round(param.value) + '' : '';
						}
					},
					data: [
						{
							name: 'Mark',
							coord: ['', 0],
							value: 0,
							itemStyle: {
								color: 'rgb(41,60,85)'
							}
						},
						{
							name: 'highest value',
							type: 'max',
							valueDim: 'highest'
						},
						{
							name: 'lowest value',
							type: 'min',
							valueDim: 'lowest'
						},
						{
							name: 'average value on close',
							type: 'average',
							valueDim: 'close'
						}
					],
					tooltip: {
						formatter: function (param) {
							return param.name + '<br>' + (param.data.coord || '');
						}
					}
				},
				*/
				markLine: {
					symbol: ['none', 'none'],
					data: [
						[
							{
								name: 'from lowest to highest',
								type: 'min',
								valueDim: 'lowest',
								symbol: 'circle',
								symbolSize: 10,
								label: {
									show: false
								},
								emphasis: {
									label: {
										show: false
									}
								}
							},
							{
								type: 'max',
								valueDim: 'highest',
								symbol: 'circle',
								symbolSize: 10,
								label: {
									show: false
								},
								emphasis: {
									label: {
										show: false
									}
								}
							}
						],
						{
							name: 'min line on close',
							type: 'min',
							valueDim: 'close'
						},
						{
							name: 'max line on close',
							type: 'max',
							valueDim: 'close'
						}
					]
				}
			},
			{
				name: 'MA5',
				type: 'line',
				data: calculateMA(5),
				smooth: true,
				lineStyle: {
					opacity: 0.5
				}
			},
			{
				name: 'MA10',
				type: 'line',
				data: calculateMA(10),
				smooth: true,
				lineStyle: {
					opacity: 0.5
				}
			},
			{
				name: 'MA20',
				type: 'line',
				data: calculateMA(20),
				smooth: true,
				lineStyle: {
					opacity: 0.5
				}
			},
			{
				name: 'MA30',
				type: 'line',
				data: calculateMA(30),
				smooth: true,
				lineStyle: {
					opacity: 0.5
				}
			}
		]
	});
	
	var timerId;

	useEffect(() => {
		getItemList();
		
		timerId = setTimeout(getCurrentList, 1000);
		
		if (chartRef.current) {
			chart = echarts.init(chartRef.current);
			//const chart = echarts.init(chartRef.current);
			//chart.setOption(options);
		}
	}, [options, chartRef]);

	//종목 리스트
	function getItemList() {
		axios.get(process.env.REACT_APP_URL+"/etc/data/stratsymbollist")
		.then(({ data }) => {
			setItemList(data);
		})
		.catch(e => {  // API 호출이 실패한 경우
			console.error(e);  // 에러표시
		});
	}
	var cnt = 0;
	//그래프 데이터 호출
	function getCurrentList() {
		var currentSelect = document.getElementById("item").value;
		var itemType = document.getElementById("winType").value;
		var itemTypeMin = document.getElementById("winType")[document.getElementById("winType").selectedIndex].text;
		var itemCnt = document.getElementById("winCnt").value;

		//timerId 초기화
		clearTimeout(timerId);
		//분봉타입 시간으로 데이터
		//timerId = setTimeout(getCurrentList, (Number(itemTypeMin) * 60) * 1000 );
		timerId = setTimeout(getCurrentList, 3000 );
		
		if (!currentSelect){
			return;
		}
		
		//추가 데이터 2건 조회
		if (data0.values.length > 0){
			itemCnt = 2;
		}
		
		axios.get(process.env.REACT_APP_URL+"/chart/chartdata/"+currentSelect+"/"+itemType+"/"+itemCnt)
		.then(({ data }) => {
			const optionData = [];
			const lastData = [];
			
			if (data){
				//data0 초기상태
				if (data0.values.length == 0){
					
					for (var i=data.length-1; i>=0; i--){
						const odata = data[i];
						const temp = [];
						//분봉타입별 시간 substring
						temp.push(odata.CHART_NM.substring(8,10)+":"+odata.CHART_NM.substring(10,12));
						temp.push(odata.OPEN_PRC);
						temp.push(odata.CLOSE_PRC);
						temp.push(odata.LOW_PRC);
						temp.push(odata.HIGH_PRC);
						
						optionData.push(temp);
					}
					console.log("초기???", optionData);
				}else{
					const odata = data[0];
					const preData = data[1];
					const temp = [];
					temp.push(odata.CHART_NM.substring(8,10)+":"+odata.CHART_NM.substring(10,12));
					temp.push(odata.OPEN_PRC);
					temp.push(odata.CLOSE_PRC);
					temp.push(odata.LOW_PRC);
					temp.push(odata.HIGH_PRC);
					lastData.push(temp);
				}
				
				
				//데이터가 초기상태면 optionData 입력
				if (data0.values.length == 0){
					console.log("초기");
					data0 = splitData(optionData);
					
					if (chartRef.current) {
						options.series[0].data = data0.values;
						options.xAxis.data = data0.categoryData;
						options.series[1].data = calculateMA(5);
						options.series[2].data = calculateMA(10);
						options.series[3].data = calculateMA(20);
						options.series[4].data = calculateMA(30);
						console.log("options", options);
						
						//const chart = echarts.init(chartRef.current);
						chart.setOption(options);
					}
					
				}else if (lastData.length > 0 && data0.values.length != 0){
					const data1 = splitData(lastData);
					//console.log("lastData ==>", data1.categoryData[0]);
					//console.log("options.xAxis.data.length ==>", options.xAxis.data.length-1);
					//console.log("options.xAxis.data ==>", options.xAxis.data[options.xAxis.data.length-1]);
					
					//차트 줌 데이터
					if (chartRef.current) {
						let startValue = chart.getModel().option.dataZoom[0].startValue;
						let endValue = chart.getModel().option.dataZoom[0].endValue;
						let ystartValue = chart.getModel().option.dataZoom[1].startValue;//y datazoom   
						let yendValue = chart.getModel().option.dataZoom[1].endValue;//y datazoom   
						
						options.dataZoom[0].startValue = startValue;
						options.dataZoom[0].endValue = endValue;
						options.dataZoom[0].start = chart.getModel().option.dataZoom[0].start;
						options.dataZoom[0].end = chart.getModel().option.dataZoom[0].end;
						
						options.dataZoom[1].startValue = ystartValue;
						options.dataZoom[1].endValue = yendValue;
						options.dataZoom[1].start = chart.getModel().option.dataZoom[1].start;
						options.dataZoom[1].end = chart.getModel().option.dataZoom[1].end;
					}
					if (data1.categoryData[0] != options.xAxis.data[options.xAxis.data.length-1]){
						console.log("data1==>", data1);
						
						
						//data0.values.shift();
						//data0.values.push(data1.values[0]);
						
						//data0.categoryData.shift();
						//data0.categoryData.push(data1.categoryData[0]);
						
						options.series[0].data.shift();
						options.series[0].data.push(data1.values[0]);
		
						options.xAxis.data.shift();
						options.xAxis.data.push(data1.categoryData[0]);
						
						
						if (chartRef.current){
							console.log("그래프 새로고침");
							options.series[1].data = calculateMA(5);
							options.series[2].data = calculateMA(10);
							options.series[3].data = calculateMA(20);
							options.series[4].data = calculateMA(30);
							console.log("options", options);
							
							//const chart = echarts.init(chartRef.current);
							chart.setOption(options);
						}
					}
				}
			}
			
			
			/*
			if (chartRef.current && data0.values.length == 0) {
				options.series[0].data = data0.values;
				options.xAxis.data = data0.categoryData;
				options.series[1].data = calculateMA(5);
				options.series[2].data = calculateMA(10);
				options.series[3].data = calculateMA(20);
				options.series[4].data = calculateMA(30);
				console.log("options", options);
				
				const chart = echarts.init(chartRef.current);
				chart.setOption(options);
			}else if (chartRef.current & data0.values.length > 0){
				options.series[1].data = calculateMA(5);
				options.series[2].data = calculateMA(10);
				options.series[3].data = calculateMA(20);
				options.series[4].data = calculateMA(30);
				console.log("options", options);
				
				const chart = echarts.init(chartRef.current);
				chart.setOption(options);
			}
			*/
			/*
			optionDataList = splitData(optionData);
			console.log("optionDataList====>", optionDataList);
			data0 = optionDataList;
			
			const chart = ReactECharts;
			
			
			if (optionData.length >0 && chk == 0){
				this.setState({ 
					loading: true,
					optionList: optionData
				});
				
				chk++;
			}else if(optionData.length >0 && chk == 1){
				console.log("090-80808080");
			    data0.categoryData.push("15:05");
			    data0.values.push(['15:05', 2190.1, 2148.35, 2126.22, 2190.1]);
			}else if (optionData.length >0 && chk == 2){
			    data0.categoryData.push("15:04");
			    data0.values.push(['15:04', 2290.1, 2348.35, 2426.22, 2590.1]);
			}
			*/
			
			
			
			//options.xAxis.data = optionDataList.categoryData;
			//options.series.data = data0.values;
			
			//this.setState({ 
			//	loading: true,
			//	optionList: optionData
			//});
			setLoading(false);
		})
		.catch(e => {  // API 호출이 실패한 경우
			console.error(e);  // 에러표시
			setLoading(false);
		});
		
	}

	return (
			<div>
				<div>
					<div>
						<Link to="/"><li>메인</li></Link>
					</div>
					
					<div className="searchWrap">
						<table className="tbAdd">
							<colgroup>
								<col width="20%" />
								<col width="*" />
							</colgroup>
							<tbody>
							<tr>
								<th>종목</th>
								<td>
									<select id="item">
									{ItemList.length > 0 && ItemList.map((row) => {
										return (
											<option value={row.sym} key={row.sym}>{row.kornm}</option>
										);
									})}
									</select>
								</td>
								<th>분봉타입</th>
								<td>
								<select id="winType">
									<option value="1">1</option>
									<option value="2">3</option>
									<option value="3">5</option>
									<option value="4">10</option>
									<option value="5">15</option>
									<option value="6">30</option>
									<option value="7">60</option>
								</select>
								</td>
								<th>수량</th>
								<td>
								<input id="winCnt" type="text" defaultValue="30" maxLength="3" />
								</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				{loading && <span>Loading...</span>}
				<div
				ref={chartRef}
				style={{
					width: "100%",
					height: "400px",
				}}
				/>
			</div>

	)		
}

export default Chart2;
