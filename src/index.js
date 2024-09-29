"use strict";

const APP_ENTRY_ELEMENT_NAME = "body";
const APP_ENTRY_ELEMENT = document.querySelector(APP_ENTRY_ELEMENT_NAME);

if (!APP_ENTRY_ELEMENT) {

	const errorMessage = "Please refresh your app to start!";

	alert(errorMessage);
	throw new Error(errorMessage);
}

const chartTypeToFunction = {
	"bar": createBarChart,
	"line": createLineChart,
	"pie": createPieChart,
	"doughnut": createDoughnutChart,
	"scatter": createScatterChart,
	"bubble": createBubbleChart,
	"radar": createRadarChart,
	"polar-area": createPolarAreaChart,
	"custom-bar": createCustomBarChart,
	"custom-line": createCustomLineChart,
	"interactive-chart": createInteractiveChart,
};

const chartSelectOptions = Object.keys(chartTypeToFunction).sort((a, b) => {

	const formattedA = a.toLowerCase();
	const formattedB = b.toLowerCase();

	return formattedA.localeCompare(formattedB);
});

const chartTypesKeys = {};
chartSelectOptions.forEach(type => chartTypesKeys[type] = type);

main();

function main() {

	createToolbar();
	createChartEntryPoint();
	createBarChart();
}

function createToolbar() {

	const toolbar = document.createElement("div");
	toolbar.classList.add("flex-center");

	const updateButton = createUpdateButton();
	const chartSelect = createChartSelect();

	toolbar.append(updateButton, chartSelect);
	APP_ENTRY_ELEMENT.appendChild(toolbar);
}

function createUpdateButton() {

	const updateButton = document.createElement("button");

	updateButton.type = "button";
	updateButton.innerText = "Update";

	updateButton.onclick = () => {

		const chart = getChart();

		if ([chartTypesKeys["scatter"], chartTypesKeys["bubble"]].includes(chart.config.type.toLowerCase())) {

			alert("Unable to update chart...");
			return;
		}

		chart.data.datasets[0].data = [50, 60, 70, 80, 90, 100];

		if (chart.data.datasets?.[1]) {
			chart.data.datasets[1].data = [100, 90, 80, 70, 60, 50];
		}

		chart.update();
	};

	return updateButton;
}

function createChartEntryPoint() {

	const container = document.createElement("figure");
	container.classList.add("flex-center", "chart-container");

	const canvasElement = document.createElement("canvas");
	canvasElement.id = "chart";
	canvasElement.classList.add("chart");

	container.appendChild(canvasElement);
	APP_ENTRY_ELEMENT.appendChild(container);
}

function createChartSelect() {

	const container = document.createElement("div");
	container.classList.add("flex-center");

	const chartSelect = document.createElement("select");

	const chartOptions = chartSelectOptions.map(option => createChartSelectOption(option));
	chartSelect.append(...chartOptions);

	const labelElement = document.createElement("label");
	labelElement.htmlFor = "chart-select";
	labelElement.innerText = `Choose a chart type (${chartOptions?.length || 0} found):`;

	chartSelect.name = "chart-select";
	chartSelect.value = chartSelectOptions[0];

	chartSelect.onchange = event => {

		const nextChartType = event.target?.value;
		const createChartCallback = chartTypeToFunction[nextChartType];

		createChartCallback?.();
	};

	container.append(labelElement, chartSelect);

	return container;
}

function createChartSelectOption(value) {

	const optionElement = document.createElement("option");
	const formattedValue = `${value?.[0]?.toUpperCase()}${value?.slice(1)}`;

	optionElement.value = value;
	optionElement.innerText = formattedValue || "Chart type not found";

	return optionElement;
}

function createBarChart() {

	const chartOptions = {
		type: "bar",
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: "votes",
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1,
			}],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createChart({ chartOptions }) {

	destroyCurrentChart();

	const canvasCtx = get2DCanvasCtx();
	let isDelayed;

	const finalChartOptions = {
		...chartOptions,
		options: {
			...chartOptions.options,
			...createResponsiveChartOptions(),
			animation: {
				onComplete: () => {
					isDelayed = true;
				},
				delay: (context) => handleChartDelay(context, isDelayed),
			},
		},
	};

	new Chart(canvasCtx, finalChartOptions);
}

function get2DCanvasCtx() {

	const canvasElement = getCanvasElement();
	return canvasElement?.getContext("2d");
}

function createResponsiveChartOptions() {

	return {
		responsive: true,
		maintainAspectRatio: true,
	};
}

function getCanvasElement() {
	return document.getElementById("chart");
}

function destroyCurrentChart() {

	const currentChart = getChart();
	currentChart?.destroy();
}

function getChart() {

	const canvasElement = getCanvasElement();
	return Chart.getChart(canvasElement);
}

function handleChartDelay(context, isDelayed) {

	if (context.type === 'data' && context.mode === 'default' && !isDelayed) {
		return context.dataIndex * 300 + context.datasetIndex * 100;
	}

	return 0;
}

function createLineChart() {

	const chartOptions = {
		type: "line",
		data: {
			labels: ['January', 'February', 'March', 'April', 'May', 'June'],
			datasets: [{
				label: "Sales",
				data: [30, 45, 60, 35, 50, 40],
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 2,
				fill: false,
			}],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createPieChart() {

	const chartOptions = {
		type: "pie",
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: 'Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			}],
		},
		options: {
			plugins: {
				legend: {
					position: 'top',
				},
				tooltip: {
					callbacks: {
						label: tooltipItem => `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}`,
					},
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createDoughnutChart() {

	const chartOptions = {
		type: 'doughnut',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: 'Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			}],
		},
		options: {
			plugins: {
				legend: {
					position: 'top',
				},
				tooltip: {
					callbacks: {
						label: tooltipItem => `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}`,
					},
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createScatterChart() {

	const chartOptions = {
		type: 'scatter',
		data: {
			datasets: [{
				label: 'Coordinates',
				data: [
					{ x: 10, y: 20 },
					{ x: 15, y: 25 },
					{ x: 7, y: 10 },
					{ x: 12, y: 18 },
					{ x: 20, y: 30 },
				],
				backgroundColor: 'rgba(54, 162, 235, 0.5)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1,
			}],
		},
		options: {
			scales: {
				x: {
					// Scatter charts support only 'linear' scale type for x-axis
					type: 'linear',
					position: 'bottom',
				},
				y: {
					// Scatter charts support only 'linear' scale type for y-axis
					type: 'linear',
					position: 'left',
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createBubbleChart() {

	const chartOptions = {
		type: 'bubble',
		data: {
			datasets: [{
				label: 'Concentration coordinates',
				data: [
					{ x: 10, y: 20, r: 5 },
					{ x: 15, y: 25, r: 8 },
					{ x: 7, y: 10, r: 6 },
					{ x: 12, y: 18, r: 10 },
					{ x: 20, y: 30, r: 7 },
				],
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1,
			}],
		},
		options: {
			scales: {
				x: {
					// Bubble charts support only 'linear' scale type for x-axis
					type: 'linear',
					position: 'bottom',
				},
				y: {
					// Bubble charts support only 'linear' scale type for y-axis
					type: 'linear',
					position: 'left',
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createRadarChart() {

	const chartOptions = {
		type: 'radar',
		data: {
			labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History'],
			datasets: [
				{
					label: 'Student A',
					data: [85, 90, 75, 80, 70, 85],
					fill: true,
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					borderColor: 'rgba(54, 162, 235, 1)',
					pointBackgroundColor: 'rgba(54, 162, 235, 1)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 1,
				},
				{
					label: 'Student B',
					data: [70, 85, 80, 75, 85, 90],
					fill: true,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					pointBackgroundColor: 'rgba(255, 99, 132, 1)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				r: {
					suggestedMin: 0,
					suggestedMax: 100,
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createPolarAreaChart() {

	const chartOptions = {
		type: 'polarArea',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: 'Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.5)',
					'rgba(54, 162, 235, 0.5)',
					'rgba(255, 206, 86, 0.5)',
					'rgba(75, 192, 192, 0.5)',
					'rgba(153, 102, 255, 0.5)',
					'rgba(255, 159, 64, 0.5)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			}],
		},
		options: {
			scales: {
				r: {
					suggestedMin: 0,
					suggestedMax: 20,
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createCustomBarChart() {

	const chartOptions = {
		type: 'bar',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: 'Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.8)',
					'rgba(54, 162, 235, 0.8)',
					'rgba(255, 206, 86, 0.8)',
					'rgba(75, 192, 192, 0.8)',
					'rgba(153, 102, 255, 0.8)',
					'rgba(255, 159, 64, 0.8)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 2,
			}],
		},
		options: {
			plugins: {
				legend: {
					display: true,
					labels: {
						color: 'rgb(255, 99, 132)',
						font: {
							size: 16,
							family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
						},
					},
				},
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					titleFont: {
						size: 18,
					},
					bodyFont: {
						size: 14,
					},
					callbacks: {
						label: context => `${context.dataset.label}: ${context.raw} votes`,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						color: 'rgba(54, 162, 235, 1)',
						font: {
							size: 14,
						},
					},
				},
				y: {
					ticks: {
						color: 'rgba(54, 162, 235, 1)',
						font: {
							size: 14,
						},
					},
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createCustomLineChart() {

	const chartOptions = {
		type: 'line',
		data: {
			labels: ['January', 'February', 'March', 'April', 'May', 'June'],
			datasets: [{
				label: 'Sales',
				data: [30, 45, 60, 35, 50, 40],
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 2,
				fill: false,
			}],
		},
		options: {
			plugins: {
				legend: {
					display: true,
					position: 'top',
					labels: {
						font: {
							size: 14,
						},
					},
				},
				tooltip: {
					enabled: true,
					callbacks: {
						label: tooltipItem => `Sales: $${tooltipItem.raw}`,
					},
				},
			},
		},
	};

	createChart({ chartOptions });
}

function createInteractiveChart() {

	const chartOptions = {
		type: 'line',
		data: {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
			datasets: [
				{
					label: "Sales 1",
					data: [1, 2, 4, 1, 2, 3, 4, 8, 3, 2],
					borderColor: "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)"
				},
				{
					label: "Sales 2",
					data: [2, 3, 1, 3, 6, 3, 2, 2, 4, 5],
					borderColor: "rgb(53, 162, 235)",
					backgroundColor: "rgba(53, 162, 235, 0.5)"
				},
			],
		},
		options: {
			plugins: {
				legend: {
					position: "top",
				},
				zoom: {
					pan: {
						enabled: true,
						mode: 'x',
					},
					zoom: {
						wheel: {
							enabled: true,
						},
						pinch: {
							enabled: true,
						},
						mode: 'x',
					},
				},
			},
		},
	};

	createChart({ chartOptions });
}
