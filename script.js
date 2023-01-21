window.onload = function () {
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})
	user_level_on_change();
	
	max_height = Math.max(document.getElementById("card-1").offsetHeight, document.getElementById("card-2").offsetHeight, document.getElementById("card-3").offsetHeight);
	
	document.getElementById('card-1').style.height=max_height+"px";
	document.getElementById('card-2').style.height=max_height+"px";
	document.getElementById('card-3').style.height=max_height+"px";
};

// https://gamewith.jp/pricone-re/article/show/93344
let mission_exp_param = [
	[[200, 45], [95, 40], [55, 35], [1, 30]],
	[[200, 45], [95, 40], [40, 35], [1, 30]],
	[[220, 60], [120, 55], [75, 50], [40, 45], [1, 40]],
	[[160, 30], [75, 25], [1, 20]],
	[[160, 30], [75, 25], [1, 20]],
	[[220, 40], [120, 35], [55, 30], [1, 25]],
	[[140, 35], [55, 30], [1, 25]],
	[[180, 45], [95, 40], [55, 35], [1, 30]],
	[[120, 55], [75, 50], [40, 45], [1, 40]],
	[[120, 55], [95, 50], [40, 45], [1, 40]],
	[[140, 70], [95, 65], [55, 60], [40, 55], [1, 50]],
	[[75, 25], [1, 20]]  //luna tower
];

let dessert_param = [
	[240, 72], [230, 70], [220, 68], [210, 66], [200, 64], 
	[190, 62], [180, 60], [170, 58], [160, 56], [150, 54], 
	[140, 52], [130, 50], [120, 48], [100, 46], [90, 44], 
	[80, 42], [75, 40], [70, 38], [60, 36], [50, 34], 
	[40, 32], [30, 30], [20, 28], [10, 24], [1, 20]
];

let player_max_exp_param = [
	[101, 4425], [76, 3540], [65, 2655], [53, 1770], [52, 1576],
	[51, 1359], [50, 1172], [49, 1010], [48, 871], [47, 750],
	[46, 647], [45, 558], [44, 481], [43, 430], [42, 383],
	[41, 342], [40, 306], [39, 278], [38, 252], [37, 230],
	[36, 209], [35, 202], [34, 197], [33, 191], [32, 185],
	[31, 181], [30, 174], [29, 170], [28, 165], [27, 160],
	[26, 155], [25, 151], [24, 146], [23, 142], [21, 138],
	[20, 110], [19, 100], [14, 82], [13, 76], [12, 64],
	[10, 56], [9, 48], [8, 24], [5, 16], [2, 8], [1, 24]
]

function enforceMinMax(el){
	if(el.value != ""){
		if(parseInt(el.value) < parseInt(el.min)){
			el.value = el.min;
		}
		if(parseInt(el.value) > parseInt(el.max)){
			el.value = el.max;
		}
	}
}

function user_level_on_change(){
	let level = document.getElementById("user_level").value;
	
	if(document.getElementById("user_exp").value == ""){
		return false;
	}
	
	if(document.getElementById("target_level").value == ""){
		return false;
	}
	
	if(document.getElementById("exp_bonus").value == ""){
		return false;
	}
	
	if(document.getElementById("points_bottom").value == ""){
		return false;
	}

	if(level == ""){
		return false;
	}
	
	calc_mission_exp(level, query=true);
	calc_points(level, query=true);
	calc_level(level);
}

function calc_stone(){
	let point_b = parseInt(document.getElementById("points_bottom").value);
	sum = (point_b-3 > 0 ? 40*3 : 40*point_b)+
	(point_b-6 > 0 ? 60*3 : 60*Math.max(point_b-3, 0))+
	(point_b-14 > 0 ? 100*8 : 100*Math.max(point_b-6, 0))+
	(point_b-22 > 0 ? 150*8 : 150*Math.max(point_b-14, 0))+
	(point_b-30 > 0 ? 180*8 : 180*Math.max(point_b-22, 0))+
	(point_b-35 > 0 ? 200*5 : 200*Math.max(point_b-30, 0))+
	250*Math.max(point_b-35, 0)
	
	document.getElementById("stone").innerHTML = `需支出${sum}寶石`;
	
	return sum;
}

function calc_mission_exp(level, query=false){
	let e_mission_exp = document.getElementsByName("mission_exp");
	let sum = 0;
	let tooltip_content = "";
	for(let i = 0; i < e_mission_exp.length; i++){
		if(e_mission_exp[i].checked){
			for(let j = 0; j < mission_exp_param[i].length; j++){
				if(level >= mission_exp_param[i][j][0]){
					sum += mission_exp_param[i][j][1];
					tooltip_content += e_mission_exp[i].parentElement.getElementsByTagName("label")[0].innerText+" "+mission_exp_param[i][j][1]+"<br>";
					break;
				}
			}
		}
	}
	
	if(query){
		let e = document.getElementById("display_mission_exp");
		e.innerHTML = sum+" Exp";
		var tt = bootstrap.Tooltip.getInstance(e);
		tt.dispose();
		e.setAttribute('title', tooltip_content);
		tt = bootstrap.Tooltip.getOrCreateInstance(e);
	}
	//console.log(sum);
	return sum;
}

function calc_max_exp(level){
	let sum = 0;
	for(let i = 0; i < player_max_exp_param.length; i++){
		if(level >= player_max_exp_param[i][0]){
			return player_max_exp_param[i][1];
		}
	}
}

function calc_points(level, query=false){
	let sum = 0;
	
	sum += 240;
	sum += document.getElementById("p_mission").checked ? 400 : 200;
	sum += document.getElementById("p_dungeon_normal").checked ? 48 : 0;
	sum += document.getElementById("p_dungeon_hard").checked ? 48 : 0;
	sum += document.getElementById("p_dungeon_veryhard").checked ? 48 : 0;
	sum += document.getElementById("p_dungeon_ex1").checked ? 48 : 0;
	sum += document.getElementById("p_dungeon_ex2").checked ? 48 : 0;
	sum += document.getElementById("p_dungeon_ex3").checked ? 48 : 0;
	sum += document.getElementById("p_dungeon_ex4").checked ? 48 : 0;
	sum += document.getElementById("p_dungeon_ex5").checked ? 48 : 0;
	sum += document.getElementById("p_extra").checked ? 500 : 0;
	sum += 10;
	
	let desk_point = 0;
	if(document.getElementById("p_dessert_desk").checked){
		for(let i = 0; i < dessert_param.length; i++){
			if(level >= dessert_param[i][0]){
				//console.log(dessert_param[i][1]);
				sum += dessert_param[i][1] * 4;
				desk_point = dessert_param[i][1] * 4;
				break;
			}
		}
	}
	
	let tooltip_content = `
	自然回體 240<br>
	每日任務體力 ${document.getElementById("p_mission").checked ? 400 : 200}<br>
	地下城 Normal ${document.getElementById("p_dungeon_normal").checked ?  48 : 0}<br>
	地下城 Hard ${document.getElementById("p_dungeon_hard").checked ?  48 : 0}<br>
	地下城 Very Hard ${document.getElementById("p_dungeon_veryhard").checked ?  48 : 0}<br>
	地下城 Exterme 1 ${document.getElementById("p_dungeon_ex1").checked ?  48 : 0}<br>
	地下城 Exterme 2 ${document.getElementById("p_dungeon_ex2").checked ?  48 : 0}<br>
	地下城 Exterme 3 ${document.getElementById("p_dungeon_ex3").checked ?  48 : 0}<br>
	地下城 Exterme 4 ${document.getElementById("p_dungeon_ex4").checked ?  48 : 0}<br>
	地下城 Exterme 5 ${document.getElementById("p_dungeon_ex5").checked ?  48 : 0}<br>
	點心桌 ${document.getElementById("p_dessert_desk").checked ?  desk_point : 0}<br>
	戰隊成員按讚 10<br>
	體力包 ${document.getElementById("p_extra").checked ?  500 : 0}<br>
	`;
	
	if(query){
		let e = document.getElementById("display_points");
		e.innerHTML = sum;
		var tt = bootstrap.Tooltip.getInstance(e);
		tt.dispose();
		e.setAttribute('title', tooltip_content);
		tt = bootstrap.Tooltip.getOrCreateInstance(e);
	}
	
	//console.log(sum);
	return sum;
}

function calc_level(level){
	let current_level = parseInt(level);
	let current_exp = parseInt(document.getElementById("user_exp").value);
	let target_level = parseInt(document.getElementById("target_level").value);
	let exp_bonus = parseFloat(document.getElementById("exp_bonus").value);
	let point_b = parseInt(document.getElementById("points_bottom").value);
	let total_exp = 0;
	let total_point = 0;
	let current_max_level = target_level == 0 ? calc_max_level(0) : target_level;
	let max_exp = calc_max_exp(current_level);
	let today = 0;
	
	output_str = "";
	
	while(current_level < current_max_level || (current_level == current_max_level && current_exp < max_exp-1)){
		//console.log("-------------------- "+today+" --------------------");
		//console.log("原先剩餘經驗: "+current_exp);
		
		let mission_exp = calc_mission_exp(current_level);
		let points = calc_points(current_level);
		let points_bottle = point_b * 120;
		
		total_point = points+points_bottle;
		total_exp = mission_exp + points*exp_bonus + points_bottle*exp_bonus;
		//console.log("今日獲取經驗:"+total_exp+"(今日任務經驗"+mission_exp+"+今日體力"+points+"*經驗倍率"+exp_bonus+"+吃管回體"+point_b+"*每管體力120*經驗倍率"+exp_bonus+")");
		
		current_exp += total_exp;
		//console.log("總計經驗量: "+current_exp);
		//console.log("模擬等級提升 -------------------------");
		
		let origin_level = current_level;
		
		while(current_exp >= max_exp && current_level < current_max_level){
			current_exp -= max_exp;
			current_level += 1;
			//let _str = "    等級提升至"+current_level+", 經驗扣除4425，剩餘經驗"+current_exp;
			max_exp = calc_max_exp(current_level);
			
			let regen = (58 + current_level) * exp_bonus;
			total_point += (58 + current_level)
			total_exp += regen;
			current_exp += regen;
			//console.log(_str+"。升等後系統回體經驗"+regen+"(體力"+(58 + current_level)+"*經驗倍率"+exp_bonus+")，剩餘"+current_exp+"。");
		}
		//console.log("剩餘經驗未達4425或已達等級上限 -------------------------");
		if(current_level <= current_max_level){
			today += 1;
		}
		
		//console.log("等級: "+origin_level+" -> "+current_level+"等");
		//console.log("合計經驗值總和: "+total_exp+",估算當日提升"+(total_exp / max_exp)+"等");
		
		output_str += "<tr class='text-center'><td>"+calc_date(today)+"</td><td>"+current_level+" ("+max_exp+")</td><td>"+mission_exp+"</td><td>"+total_point+" ("+(total_point/120).toFixed(2)+")</td><td>"+(total_exp-mission_exp)+"</td><td>"+total_exp+"</td><td>"+(total_exp/max_exp).toFixed(2)+"</td></tr>"
		
		if(target_level == 0){
			current_max_level = calc_max_level(today);
		}
	}
	
	document.getElementById("result").innerHTML = "預計"+today+"天("+calc_date(today)+")到達"+current_max_level+"等<br><span style='font-size: 1.25rem;'>(支出"+calc_stone()*today+"寶石，相當於"+calc_stone()*30+"/月)</span>";
	document.getElementById("tbody").innerHTML = output_str;
	
	console.log("預計"+today+"天到達"+current_max_level+"等");
}

function calc_date(days){
	let datetime = new Date();
	datetime = datetime.setDate(datetime.getDate()+days);
	datetime = new Date(datetime);
	return datetime.toLocaleDateString();
}

function calc_max_level(days){
	let end_date = calc_date(days);
	let date_arr = end_date.split("/");
	return 220 + ((date_arr[0]-2022)*12+(date_arr[1]-4)+(date_arr[2] >= 15 ? 0 : -1))*3;
}