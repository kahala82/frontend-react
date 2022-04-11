import logo from './logo.svg';


import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Main from './components/common/Main';
import Product from './components/common/Product';
import Footer from './components/common/Footer';
import NotFound from './components/common/NotFound';
import Chart1 from './components/sample/chart/Chart1';
import Chart2 from './components/sample/chart/Chart2';
import Chart3 from './components/sample/chart/Chart3';
import Chart4 from './components/sample/chart/Chart4';

function App() {
	
	return (
		<div className='App'>
			<Header />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Main />}></Route>
						<Route path="/chart1" element={<Chart1 />}></Route>
						<Route path="/chart2" element={<Chart2 />}></Route>
						<Route path="/chart3" element={<Chart3 />}></Route>
						<Route path="/chart4" element={<Chart4 />}></Route>
						<Route path="/product/:productId" element={<Product />}></Route>
						{/* 엘리먼트의 상단에 위치하는 라우트들의 규칙을 모두 확인하고, 일치하는 라우트가 없다면 이 라우트가 화면에 나타나게 됩니다. */}
						<Route path="*" element={<NotFound />}></Route>
					</Routes>
				</BrowserRouter>
			<Footer />
		</div>
	);
}

export default App;
