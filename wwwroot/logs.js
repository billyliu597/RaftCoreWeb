logs=[[],[],[],[],[]]
sm = [0, 0, 0, 0, 0]
logElements = 1;


function sendRequest() {
	httpRequest = new XMLHttpRequest();
	var userRequest = document.getElementById("request").value;
	document.getElementById("request").value = "";

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.open('POST', 'nodes/requests/');
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.send('userRequest=' + encodeURIComponent(userRequest));
}

function drawLogContainers() {
	var v = [{}, {}, {}, {}, {}];
	u = d3.select('div#log')
		  .selectAll('div')
		  .data(v);

	u.enter()
	 .append('div')
	 .attr('class', 'node_log');

	u.exit().remove();

	var b = [{}, {}, {}, {}, {}];

	u = d3.select('div#sm')
		  .selectAll('div')
		  .data(v);

	u.enter()
	 .append('div')
	 .attr('class', 'node_sm');

	u.exit().remove();
}

function updateSM() {
	var oReq = new XMLHttpRequest();
	oReq.open("GET", "nodes/sm/");
	oReq.onload = function (e) {
		if (oReq.readyState === 4) {
			if (oReq.status === 200) {
				sm = JSON.parse(oReq.responseText)
				displaySM()
			}
			else {
				console.error(oReq.statusText);
			}
		}
	};
	oReq.send();
}

function displaySM() {
	var u = d3.select('#sm')
			  .selectAll('div')
			  .data(sm)

	u.enter()
	 .append('div')
	 .attr('class', 'node_sm')
	 .merge(u)
	 .text(function(d, i) {
	   return sm[i]
	 });

	u.exit().remove()
}

function updateLogs() {
	var oReq = new XMLHttpRequest()
	oReq.open("GET", "nodes/log/" + logElements)
	oReq.onload = function (e) {
		if (oReq.readyState === 4) {
			if (oReq.status === 200) {
				logs = JSON.parse(oReq.responseText)
				displayLogs()
			} else {
				console.error(oReq.statusText);
			}
		}
	};
	oReq.send();
}

function displayLogs() {
	for (var i = 0; i < logs.length; i++) {
		v = d3.selectAll('.node_log')
			  .filter(':nth-of-type(' + (i+1) + ')')
			  .selectAll('div')
			  .data(logs[i]);

		v.enter()
		 .append('div')
		 .attr('class', 'log_entry')
		 .merge(v)
		 .text(function(d, j) {
		   return logs[i][j].command
		 })
		 .attr('class', function(d, j) {
		   return 'log_entry ' + (logs[i][j].committed ? 'committed' : '')
		 });
		
		v.exit().remove()
	}
}