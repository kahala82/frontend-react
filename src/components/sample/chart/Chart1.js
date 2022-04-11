import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


//시고저
class CurrentList extends React.Component {
	//저장 변수 설정
	state = { 
		loading: false,
		trimerId:'',
		follingTime:100,
		currentPrice:'',
		currentSelect:''
	};
	
	componentDidMount() {
		this.getCurrentPrice();
	}
	
	render() {
		const { currentPrice } = this.state;
		return(
			<div className="currentWrap">
				<table className="tblCurrent">
					<colgroup>
						<col width="15%" />
						<col width="15%" />
						<col width="15%" />
						<col width="15%" />
						<col width="10%" />
						<col width="15%" />
						<col width="15%" />
					</colgroup>
					<tbody>
					<tr>
						<th>시 / 고 / 저</th>
						<td>{currentPrice.open}</td>
						<td>{currentPrice.high}</td>
						<td>{currentPrice.low}</td>
						<th>현 / 비</th>
						<td>{currentPrice.cur}</td>
						<td>{currentPrice.per}</td>
					</tr>
					</tbody>
				</table>
			</div>
		)
	}
	
	setCurrentTimeout = () =>{
		var itemCd = document.getElementById("item").value;
	
		//종목코드가 있으면 currentSelect 선택코드 입력
		if (itemCd){
			this.setState({ 
				currentSelect: itemCd
			});
		}
		
		//시고저 데이터 호출
		this.getCurrentPrice();
	}
	
	getCurrentPrice = async () => {
		const {follingTime} = this.state;
		
		this.timeout = setTimeout( () => {
			clearTimeout(this.timeout);
			this.setCurrentTimeout();
		}, follingTime);
		
		let {currentSelect} = this.state;
		
		if (!currentSelect) return;
		axios
		.get(process.env.REACT_APP_URL+"/sise/price/currentprc/0")
		.then(({ data }) => {
			let selData = '';
			
			if (currentSelect){
				for (let i=0; i<data.length; i++){
					if (data[i].sym == currentSelect){
						selData = data[i];
					}
				}
			}
			this.setState({ 
				loading: true,
				currentPrice: selData
			});
		})
		.catch(e => {  // API 호출이 실패한 경우
			console.error(e);  // 에러표시
			this.setState({  
				loading: false
			});
		});
	}
}

//호가정보
class StockPriceList extends React.Component {
	stockTimeout;
	
	state = { 
		loading: false,
		follingTime:100,
		stockPrice:'',
		currentSelect:''
	};
	
	componentDidMount() {
		this.getCurrentStockList();
	}
	
	setCurrentStockTimeout = () =>{
		var itemCd = document.getElementById("item").value;
	
		//종목코드가 있으면 currentSelect 선택코드 입력
		if (itemCd){
			this.setState({ 
				currentSelect: itemCd
			});
		}
		
		//호가 데이터 호출
		this.getCurrentStockList();
	}
	
	getCurrentStockList = async() =>{
		this.stockTimeout = setTimeout( () => {
			clearTimeout(this.stockTimeout);
			this.setCurrentStockTimeout();
		}, 100);
		
		let {currentSelect} = this.state;
		
		if (!currentSelect) return;
		
		axios
		.get(process.env.REACT_APP_URL+"/sise/price/hogaprc/"+currentSelect)
		.then(({ data }) => {
			
			let selData = '';
			
			if (currentSelect){
				selData = data[0];
			}
			this.setState({ 
				loading: true,
				stockPrice: selData
			});
		})
		.catch(e => {  // API 호출이 실패한 경우
			console.error(e);  // 에러표시
			this.setState({  
				loading: false
			});
		});
	}
	
	render() {
		const { stockPrice } = this.state;
		return (
		<div className="searchWrap">
			<table className="tbList">
				<colgroup>
					<col width="15%" />
					<col width="15%" />
					<col width="*" />
					<col width="15%" />
					<col width="15%" />
				</colgroup>
				<tbody>
				<tr>
					<td colSpan="5" className="txt_left"><b>호가정보</b></td>
				</tr>
				<tr>
					<th>건수</th>
					<th>잔량</th>
					<th></th>
					<th>잔량</th>
					<th>건수</th>
				</tr>
				<tr>
					<td>{stockPrice.ask_1_qty}</td>
					<td>{stockPrice.ask_1_cnt}</td>
					<td>{stockPrice.ask_1_price}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>{stockPrice.ask_2_qty}</td>
					<td>{stockPrice.ask_2_cnt}</td>
					<td>{stockPrice.ask_2_price}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>{stockPrice.ask_3_qty}</td>
					<td>{stockPrice.ask_3_cnt}</td>
					<td>{stockPrice.ask_3_price}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>{stockPrice.ask_4_qty}</td>
					<td>{stockPrice.ask_4_cnt}</td>
					<td>{stockPrice.ask_4_price}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>{stockPrice.ask_5_qty}</td>
					<td>{stockPrice.ask_5_cnt}</td>
					<td>{stockPrice.ask_5_price}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td>{stockPrice.bid_1_price}</td>
					<td>{stockPrice.bid_1_qty}</td>
					<td>{stockPrice.bid_1_cnt}</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td>{stockPrice.bid_2_price}</td>
					<td>{stockPrice.bid_2_qty}</td>
					<td>{stockPrice.bid_2_cnt}</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td>{stockPrice.bid_3_price}</td>
					<td>{stockPrice.bid_3_qty}</td>
					<td>{stockPrice.bid_3_cnt}</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td>{stockPrice.bid_4_price}</td>
					<td>{stockPrice.bid_4_qty}</td>
					<td>{stockPrice.bid_4_cnt}</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td>{stockPrice.bid_5_price}</td>
					<td>{stockPrice.bid_5_qty}</td>
					<td>{stockPrice.bid_5_cnt}</td>
				</tr>
				<tr className="total">
					<td>{stockPrice.ask_tot_vol}</td>
					<td>{stockPrice.ask_tot_cnt}</td>
					<td>{stockPrice.tvol}</td>
					<td>{stockPrice.bid_tot_vol}</td>
					<td>{stockPrice.bid_tot_cnt}</td>
				</tr>
				</tbody>
			</table>
		</div>			
		)

	}
}

//종목 및 Chart1 메인
class Chart1 extends React.Component {
	state = { 
		loading: false,
		ItemList: [],
	};
  
	init = () => {
		console.log("init~~~");
		this.getItemList();
		//this.getCurrentPrice();
	}

	getItemList = async () => {
		axios.get(process.env.REACT_APP_URL+"/etc/data/stratsymbollist")
		.then(({ data }) => {
			this.setState({ 
				loading: true,
				ItemList: data
			});
		})
		.catch(e => {  // API 호출이 실패한 경우
			console.error(e);  // 에러표시
			this.setState({  
				loading: false
			});
		});
  }

  componentDidMount() {
	this.init();
  }

	render() {

		
		const { ItemList } = this.state;
		//console.log(ItemList);
		console.log(ItemList);
		return (
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
								{ItemList.map((row) => {
									return (
										<option value={row.sym} key={row.sym}>{row.kornm}</option>
									);
								})}
							</select>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				
				<CurrentList/>
				<StockPriceList/>
			</div>
    );
  }
}




export default Chart1;


