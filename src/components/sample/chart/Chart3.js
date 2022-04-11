import React, {useEffect } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import Chart from './Chart';
import { getData } from "./utils"
import axios from 'axios';
import { timeParse } from "d3-time-format";

import { TypeChooser } from "react-stockcharts/lib/helper";

const parseDate = timeParse("%Y-%m-%d %I:%M");
let timerId;
//let itemList = [];
class ChartComponent extends React.Component {

	state = { 
		itemList: [],
		stockItem: null
	};
	
	componentDidMount() {
		this.getItemList();
		this.getStockData();
	}

	componentDidUpdate() {
	}
	
	
	//종목 리스트
	getItemList = () => {
		axios.get(process.env.REACT_APP_URL+"/etc/data/stratsymbollist")
		.then(({ data }) => {
			console.log("itemList", data);
			//this.setState({  
			//	itemList: data
			//});
			//itemList = data;
			//itemList.push({itemList:data});
			
			this.setState({ itemList : data });
			
		})
		.catch(e => {  // API 호출이 실패한 경우
			console.error(e);  // 에러표시
		});
	}
	
	//그래프 데이터 호출
	getStockData = () =>{
		//timerId 초기화
		clearTimeout(timerId);
		
		if (!document.getElementById("item")){
			timerId = setTimeout(this.getStockData, 3000);
			return;
		}else if (this.state.data == null && this.state.stockItem != null){
			clearTimeout(timerId);
			this.setState({stockItem: null});
			timerId = setTimeout(this.getStockData, 100);
		}
		
		var currentSelect = document.getElementById("item").value;
		var itemType = document.getElementById("winType").value;
		var itemTypeMin = document.getElementById("winType")[document.getElementById("winType").selectedIndex].text;
		var itemCnt = document.getElementById("winCnt").value;
		
		//this.setState({stockItem: currentSelect});
		
		//분봉타입 시간으로 데이터
		//timerId = setTimeout(getStockData, (Number(itemTypeMin) * 60) * 1000 );
		timerId = setTimeout(this.getStockData, 3000);
		
		if (!currentSelect){
			return;
		}
		
		//추가 데이터 2건 조회
		if (this.state.data != null && this.state.data.length > 0){
			itemCnt = 2;
		}
		
		axios.get(process.env.REACT_APP_URL+"/chart/chartdata/"+currentSelect+"/"+itemType+"/"+itemCnt)
		.then(({ data }) => {
			let optionData = [];
			const lastData = [];
			
			if (data){
				//초기 데이터
				if (this.state.data == null){
					for (var i=data.length-1; i>=0; i--){
						const odata = data[i];
						const temp = [];
						
						optionData.push(
							{
								absoluteChange: "",
								close: odata.CLOSE_PRC,
								date: parseDate(odata.CHART_NM.substring(0,4)+"-"+odata.CHART_NM.substring(4,6)+"-"+odata.CHART_NM.substring(6,8) + " " +odata.CHART_NM.substring(8,10)+":"+odata.CHART_NM.substring(10,12)),
								dividend: "",
								high: odata.HIGH_PRC,
								low: odata.LOW_PRC,
								open: odata.OPEN_PRC,
								percentChange: "",
								split: "",
								volume: odata.CHART_NM,
								chartNm : odata.CHART_NM
							}
						);
					}
					
					//data 저장소 입력
					this.setState({ data: optionData });
				}else{
					//최신 데이터2건
					lastData.push(
						{
							absoluteChange: "",
							close: data[0].CLOSE_PRC,
							date: parseDate(data[0].CHART_NM.substring(0,4)+"-"+data[0].CHART_NM.substring(4,6)+"-"+data[0].CHART_NM.substring(6,8) + " " +data[0].CHART_NM.substring(8,10)+":"+data[0].CHART_NM.substring(10,12)),
							dividend: "",
							high: data[0].HIGH_PRC,
							low: data[0].LOW_PRC,
							open: data[0].OPEN_PRC,
							percentChange: "",
							split: "",
							volume: data[0].CHART_NM,
							chartNm : data[0].CHART_NM
						},
						{
							absoluteChange: "",
							close: data[1].CLOSE_PRC,
							date: parseDate(data[1].CHART_NM.substring(0,4)+"-"+data[1].CHART_NM.substring(4,6)+"-"+data[0].CHART_NM.substring(6,8) + " " +data[1].CHART_NM.substring(8,10)+":"+data[1].CHART_NM.substring(10,12)),
							dividend: "",
							high: data[1].HIGH_PRC,
							low: data[1].LOW_PRC,
							open: data[1].OPEN_PRC,
							percentChange: "",
							split: "",
							volume: data[1].CHART_NM,
							chartNm : data[1].CHART_NM
						}
					);
					
					//기존 데이터
					optionData = this.state.data;
					
					//기존 마지막 데이터 = 최신데이터 날짜시간이 같으면
					if (lastData.length > 0 && optionData[optionData.length -1].chartNm != lastData[0].chartNm){
						optionData.shift(); //첫번째 데이터 삭제
						optionData[optionData.length -1] = lastData[1]; //마지막 데이터 원복
						optionData.push(lastData[0]); //최신데이터 push
						
						//data 저장소 갱신
						if (this.state.data != null){
							this.setState({ data: optionData });
						}
					}
				}
			}
		});
	}
	
	handleChangeSelect=(e)=>{
		this.setState({data: null, stockItem : e.target.value}); //데이터 초기화
		clearTimeout(timerId); //settime 초기화
		timerId = setTimeout(this.getStockData, 100);
	}
	
	render() {
		const { itemList } = this.state;
		
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
									<select id="item" onChange={this.handleChangeSelect} >
									{itemList.length > 0 && itemList.map((row) => {
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
				{
				this.state.data == null
				? (<div>Loading...</div>)
				: (
				<TypeChooser>
					{type => <Chart type={type} data={this.state.data} />}
				</TypeChooser>	
				)
				}
				
					

				
{
	/*
		if ({this.state.data} == null) {
			<div>Loading...</div>
		}else{
				<TypeChooser>
					{type => <Chart type={type} data={this.state.data} />}
				</TypeChooser>			
		}
		
	*/
	
	
}

			</div>
		)
	}
}

/*
render(
	<ChartComponent />,
	document.getElementById("Chart3")
);
*/

export default ChartComponent;