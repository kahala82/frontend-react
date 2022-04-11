import React from 'react';
import { Link } from 'react-router-dom';

function Main(props) {
	return (
		<>
			<h3>안녕하세요. 메인페이지 입니다.</h3>
			<div>초기 데이터를 이곳에 보여줘야 합니다.</div>
			<Link to="/chart1"><li>호가정보테스트</li></Link>
			<Link to="/chart2"><li>차트테스트</li></Link>
			<Link to="/chart3"><li>차트테스트2</li></Link>
			<Link to="/chart4"><li>차트테스트3</li></Link>
		</>
	);
};

export default Main;
