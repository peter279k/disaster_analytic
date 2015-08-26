$(function() {
	var region = ['北投','士林','內湖','中山','松山','信義','南港','中正','大同','大安','文山','萬華'];
	var region_series = [0,0,0,0,0,0,0,0,0,0,0,0];
	var region_PName = new Array();
	var case_data = new Array();
	
	$.getJSON("http://peter279k.com/xml_converter/xml_handler.php", function(data) {
		case_data = data["DataSet"]["diffgr:diffgram"]["NewDataSet"]["CASE_SUMMARY"];
		for(var count=0;count<case_data.length;count++) {
			var region_count = 0;
			while(region_count<region.length) {
				if(case_data[count]["CaseLocationDistrict"] == region[region_count]+"區") {
					region_series[region_count] += 1;
				}
				region_count++;
			}
		}
		
		region_count = 0;
		var temp = 0;
		var min = 0;
		var temp2 = "";
		
		while(region_count<region.length-1) {
			min = region_count;
			for(var tmp_count=region_count+1;tmp_count<region.length;tmp_count++) {
				if(region_series[min] > region_series[tmp_count]) {
					min = tmp_count;
				}
			}
			
			if(min != region_count) {
				temp2 = region[min];
				region[min] = region[region_count];
				region[region_count] = temp2;
				
				temp = region_series[min];
				region_series[min] = region_series[region_count];
				region_series[region_count] = temp;
				
			}
			region_count++;
		}

		new Chartist.Bar('.ct-barchart', {
			labels: region,
			series: region_series
		}, {
			distributeSeries: true
		}).on('draw', function(data) {
			if(data.type == "bar") {
				data.element.attr({
					style: 'stroke-width: 25px'
				});
			}
		});
		
		
		var region_series_sum = region_series.reduce(function(val1, val2) { return val1 + val2; });
		
		new Chartist.Pie('.ct-piechart', {
			series: region_series
		}, {
			labelInterpolationFnc: function(value) {
				return Math.round(value / region_series_sum * 100) + '%';
			}
		});
		
		//table
		var str = "<thead><tr><th>行政區</th><th>災害數</th></tr></thead>";
		str += "<tbody>";
		for(region_count=0;region_count<region.length;region_count++) {
			str += "<tr><td>"+region[region_count]+"</td>";
			str += "<td>"+region_series[region_count]+"</td></tr>";
		}
		
		$("#disaster-count-table").append(str+"</tbody>");
		$("#disaster-count-table").table("refresh");
	});
});