//const main = require('./database');
/*module.exports = function main() {
    console.log("Debug Info");
    return 'Hello World!';
};*/
//var allItems;
//var inputs = loadAllItems();
//var promotions = loadPromotions();
function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}
//module.exports = loadAllItems;
function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: '电池',
            unit: '个',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
        }
    ];
}

module.exports = function printInventory(inputs) {
		allItems = loadAllItems();
		var promotions = loadPromotions();
		var allItems = loadAllItems();
		var counts = getCount(inputs);
		var freecounts = checkPromotion(promotions, counts);
		var finalcounts = changeCounts(freecounts, counts);
		var consumption = getConsumption(finalcounts, allItems);
		var freeconsumption = getFreeCounting(freecounts,allItems);
		outputConsumption(consumption, freeconsumption);
}

//这一步的时候不需要loadALLitem,只需要count可以了
function getCount(inputs) {
	let val = inputs[0].split("-")[0];
	let count = 0;
	let result;
	let outputs = [];
	inputs.map(function(element, index, self){
		let mediaVal = element.split("-");
		if (mediaVal[0] == val) {
			if (mediaVal.length == 2) {
				count += Number(mediaVal[1]);
			} else {
				count++;
			}
		} else {
			result = {val: val,
					  counts: count}
			outputs.push(result);
			val = mediaVal[0];
			if (mediaVal.length == 2) {
				count = Number(mediaVal[1]);
			} else {
				count = 1;
			}
		}
		if (index == (self.length - 1)) {
			result = {val: val,
					  counts: count}
			outputs.push(result);
		}
	});
	//console.log(outputs);
	return outputs;
}

function checkPromotion(promotions, counts) {
	let outputs = [];
	let freenum = 0;
	counts.map(function(element1) {
		promotions.map(function(element2) {
			if (element2.barcodes.indexOf(element1.val) > -1) {
				if (element2.type == 'BUY_TWO_GET_ONE_FREE') {
					if (element1.counts >= 2) {
						freenum++;
					}
				}
			}
		});
		outputs.push(
		{
			val: element1.val,
			freenums: freenum
		});
		freenum = 0;
	});
	//console.log(outputs);
	return outputs;
}
function changeCounts(freecounts,counts) {
	let outputs = [];
	counts.map(function(element,index, self) {
		let num = Number(element.counts) - Number(freecounts[index].freenums);
		outputs.push(
		{
			val: element.val,
			counts: element.counts,
			finalcounts: num
		});
	});
	//console.log(outputs);
	return outputs;
}

function outputConsumption(consumption, freeconsumption) {
	let sum = 0;
	for (let i = 0; i < consumption.length; i++) {
		sum += consumption[i]["total"];
	}
	//console.log("sum" + sum);
	let freesum = 0;
	for (let i = 0; i < freeconsumption.length; i++) {
		freesum += freeconsumption[i]["total"];
	}
	/*
	console.log("***<没钱赚商店>购物清单***" + "\n");
	consumption.map(function(element) {
		console.log("名称：" + element["name"] + ", " + "数量:" + element["counts"] + element["unit"] + ", " + "单价：" + element["price"].toFixed(2) + "(元)" + ", " + "小计：" + element["total"].toFixed(2) + "(元)" + "\n");
	});
	console.log("----------------------" + "\n");
	console.log("挥泪赠送商品：" + "\n")
	freeconsumption.map(function(element) {
		if (element["freenums"] > 0) {
			console.log("名称：" + element["name"] + ", " + "数量:" + element["freenums"] + "\n");
		}
		
	});
	console.log("----------------------" + "\n");
	console.log("总计：" + sum + "(元)" + "\n");
	console.log("节省：" + freesum + "(元)" + "\n");
	console.log("**********************" + "\n");
	*/
	let str;
	str = '***<没钱赚商店>购物清单***\n';
	consumption.map(function(element) {
		str += "名称：" + element["name"] + "，" + "数量：" + element["counts"] + element["unit"] + "，" + "单价：" + element["price"].toFixed(2) + "(元)" + "，" + "小计：" + element["total"].toFixed(2) + "(元)" + "\n";
	});
	str += '----------------------\n';
	str += '挥泪赠送商品：\n';
	freeconsumption.map(function(element) {
		if (element["freenums"] > 0) {
			str += "名称：" + element["name"] + "，" + "数量：" + element["freenums"]  + element["unit"] + "\n";
		}
		
	});
	str += '----------------------\n';
	str += "总计：" + sum.toFixed(2) + "(元)" + "\n";
	str += "节省：" + freesum.toFixed(2) + "(元)" + "\n";
	str += '**********************';
	console.log(str);
}

function getConsumption(finalcounts, allItems) {
	let outputs = [];
	//console.log(finalcounts);
	finalcounts.map(function(element1, index, self) {
		for (let i = 0; i < allItems.length; i++) {
			let element2 = allItems[i];
			if (element1.val == element2.barcode) {
				element1["name"] = element2["name"];
				element1["unit"] = element2["unit"];
				element1["price"] = element2["price"];
				element1["total"] = element1.finalcounts * element2["price"];
				outputs.push(element1);
				break;
			}
		}
	});
	//console.log(outputs);
	return outputs;
}

function getFreeCounting(freecounts, allItems) {
	let outputs = [];
	freecounts.map(function(element1,index,self) {
		for (let i = 0; i < allItems.length; i++) {
			let element2 = allItems[i];
			if (element1.val == element2.barcode) {
				element1["name"] = element2["name"];
				element1["unit"] = element2["unit"];
				element1["price"] = element2["price"];
				element1["total"] = element1.freenums * element2["price"];
				outputs.push(element1);
				break;
			}
		}
	});
	//console.log(outputs);
	return outputs;
}