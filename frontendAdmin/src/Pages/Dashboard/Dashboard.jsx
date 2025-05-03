import { useEffect, useLayoutEffect, useRef, useState } from "../../../../frontend/react_lite/createDOM";
import Card from "../../Components/Card/Card";
import "./Dashboard.css"
import Chart from "chart.js/auto";

const Dashboard = () => {

    // useLayoutEffect((element)=>{ 
    //     // Get the canvas and its context
    //     const canvas = element.querySelector('#userGrowthChart');
    //     // Get the canvas and its context
    //     // const canvas = document.getElementById('userGrowthChart');
    //     const ctx = canvas.getContext('2d');

    //     // Sample data for user growth
    //     const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    //     const userCounts = [50, 100, 200, 350, 500, 700, 1000];

    //     // Chart dimensions
    //     const padding = 50;
    //     const chartWidth = canvas.width - padding * 2;
    //     const chartHeight = canvas.height - padding * 2;

    //     // Scaling factors
    //     const maxUsers = Math.max(...userCounts);
    //     const yScale = chartHeight / maxUsers;
    //     const xScale = chartWidth / (days.length - 1);

    //     // Draw Axes
    //     function drawAxes() {
    //         ctx.strokeStyle = '#333';
    //         ctx.lineWidth = 2;

    //         // Y-axis
    //         ctx.beginPath();
    //         ctx.moveTo(padding, padding);
    //         ctx.lineTo(padding, canvas.height - padding);
    //         ctx.stroke();

    //         // X-axis
    //         ctx.beginPath();
    //         ctx.moveTo(padding, canvas.height - padding);
    //         ctx.lineTo(canvas.width - padding, canvas.height - padding);
    //         ctx.stroke();
    //     }

    //     // Plot the data
    //     function plotData() {
    //         ctx.strokeStyle = "#045";
    //         ctx.lineWidth = 2;
    //         ctx.beginPath();

    //         userCounts.forEach((count, index) => {
    //             const x = padding + index * xScale;
    //             const y = canvas.height - padding - count * yScale;

    //             if (index === 0) {
    //                 ctx.moveTo(x, y);
    //             } else {
    //                 ctx.lineTo(x, y);
    //             }
    //         });

    //         ctx.stroke();
    //     }

    //     // Add points
    //     function addPoints() {
    //         ctx.fillStyle = 'red';
    //         userCounts.forEach((count, index) => {
    //             const x = padding + index * xScale;
    //             const y = canvas.height - padding - count * yScale;

    //             ctx.beginPath();
    //             ctx.arc(x, y, 4, 0, Math.PI * 2);
    //             ctx.fill();
    //         });
    //     }

    //     // Add labels
    //     function addLabels() {
    //         ctx.fillStyle = '#333';
    //         ctx.font = '12px Arial';

    //         // X-axis labels
    //         days.forEach((day, index) => {
    //             const x = padding + index * xScale;
    //             const y = canvas.height - padding + 20;
    //             ctx.textAlign = 'center';
    //             ctx.fillText(day, x, y);
    //         });

    //         // Y-axis labels
    //         const yTicks = 5;
    //         for (let i = 0; i <= yTicks; i++) {
    //             const yValue = (maxUsers / yTicks) * i;
    //             const x = padding - 10;
    //             const y = canvas.height - padding - yValue * yScale;

    //             ctx.textAlign = 'right';
    //             ctx.fillText(Math.round(yValue), x, y);
    //         }
    //     }

    //     // Draw the chart
    //     function drawChart() {
    //         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    //         drawAxes();
    //         plotData();
    //         addPoints();
    //         addLabels();
    //     }

    //     // Call the function to draw the chart
    //     drawChart();


    // })

    // TODO ==================
    
    // users : total, premium, suspended, moderators, admins, number_of_reports_received
    // chat :
    //      private : total_number, number_of_reports_received, storage_used, total_number vs time graph
    //      groups : total_number, deactivated_number, number_of_reports_received, storage_used, total_number vs time graph
    //      communities : total_number, deactivated_number, number_of_reports_received, storage_used, total_number vs time graph
    // forum : 
    //      Questions : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    //      Answers : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    //      Comments : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    // files :
    //      images : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    //      videos : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    //      pdfs : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    //      other : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    // notes : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    // blogs : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    // links : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph
    // events : total_number, removed, number_of_reports_received, storage_used, total_number vs time graph

    // =======================

    // return (
    //     <div>
    //         <App2 />
    //     </div>
    // );
    
    const [selectedPeriod, setSelectedPeriod] = useState("weekly");
    const chartRefs = useRef();
  
    // Sample Data for Different Metrics
    const analyticsData = {
      weekly: {
        user: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [100, 150, 200, 180, 250, 300, 350] },
        chat: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [50, 80, 120, 110, 150, 180, 200] },
        forum: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [20, 40, 60, 55, 70, 90, 120] },
        file: { labels: ["Images", "Videos", "PDFs", "Other"], data: [200, 100, 50, 30] },
      },
      monthly: {
        user: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [800, 1000, 1200, 1500] },
        chat: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [300, 500, 700, 900] },
        forum: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [150, 180, 220, 300] },
        file: { labels: ["Images", "Videos", "PDFs", "Other"], data: [900, 400, 200, 120] },
      },
    };
  
	const storageData = {
		labels: ["Images", "Videos", "PDFs", "ZIP Files", "Other"],
		data: [500, 300, 200, 150, 100], // Example storage usage in MB
		colors: ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"], // Colors for segments
	  };

    // Create Charts
    useEffect(() => {
        setTimeout(()=>{
          // const ctxIds = ["userChart", "chatChart", "forumChart", "fileChart"];
          const ctxIds = ["userChart", "chatChart"];
          ctxIds.forEach((id) => {
  
          if(!chartRefs.current){
              chartRefs.current = {}
          }
  
            if (chartRefs.current[id]) {
              chartRefs.current[id].destroy(); // Destroy existing chart
            }
            const ctx = document.getElementById(id).getContext("2d");
      
            const type = id === "fileChart" ? "bar" : "line"; // Bar chart for files, others are line charts
            chartRefs.current[id] = new Chart(ctx, {
              type: type,
              data: {
                labels: analyticsData[selectedPeriod][id.replace("Chart", "")].labels,
                datasets: [
                  {
                    label: id.includes("file") ? "Uploads" : "Active Count",
                    data: analyticsData[selectedPeriod][id.replace("Chart", "")].data,
                    borderColor: "blue",
                  //   backgroundColor: id.includes("file") ? "rgba(255, 99, 132, 0.5)" : "rgba(0, 0, 255, 0.2)",
                  //   fill: true,
                    tension: 0.4 // Smooth curve   
                  },
                  {
                    label: id.includes("file") ? "Uploads" : "Active Count",
                    data: analyticsData[selectedPeriod]["chat"].data,
                    borderColor: "red",
                  //   backgroundColor: id.includes("file") ? "rgba(255, 99, 132, 0.5)" : "rgba(255, 238, 0, 0.2)",
                  //   fill: true,
                    tension: 0.4 // Smooth curve   
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  x: { title: { display: true, text: "Time Period" } },
                  y: { title: { display: true, text: "Count" }, beginAtZero: true },
                },
              },
            });
          });
      }, 1000)
    }, [selectedPeriod]);

	const chartInstance = useRef(null)

	useEffect(() => {
		setTimeout(() => {
			if (chartInstance.current) {
			  chartInstance.current.destroy(); // Destroy previous chart to avoid duplication
			}
		
			const ctx = document.getElementById("storageChart").getContext("2d");
			// const ctx = chartRef.current.getContext("2d");
		
			chartInstance.current = new Chart(ctx, {
			  type: "doughnut", // Doughnut chart (Pie chart with a hole)
			  data: {
				labels: storageData.labels,
				datasets: [
				  {
					data: storageData.data,
					backgroundColor: storageData.colors,
					hoverOffset: 10, // Slight animation effect on hover
				  },
				],
			  },
			  options: {
				responsive: true,
				maintainAspectRatio: false, // Allows manual height/width adjustments
				plugins: {
				  legend: {
					position: "right",
				  },
				  tooltip: {
					callbacks: {
					  label: (tooltipItem) => {
						const value = storageData.data[tooltipItem.dataIndex];
						return `${storageData.labels[tooltipItem.dataIndex]}: ${value} MB`;
					  },
					},
				  },
				},
			  },
			});
		}, 1000);
	  }, [selectedPeriod]);

	  const revenueData = {
		weekly: {
		  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		  data: [500, 700, 900, 1100, 1300, 1500, 1800],
		},
		monthly: {
		  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		  data: [4000, 5200, 6100, 7000, 8000, 9000, 11000, 13000, 15000, 17000, 20000, 25000],
		},
		yearly: {
		  labels: ["2020", "2021", "2022", "2023", "2024"],
		  data: [50000, 65000, 80000, 95000, 120000],
		},
	  };
	
	  const revenueChartInstance = useRef(null)

	  useEffect(() => {
		setTimeout(()=>{
			if (revenueChartInstance.current) {
			revenueChartInstance.current.destroy();
			}
		
			const ctx = document.getElementById("revenueChart").getContext("2d");
		
			revenueChartInstance.current = new Chart(ctx, {
			type: "bar",
			data: {
				labels: revenueData[selectedPeriod].labels,
				datasets: [
				{
					label: "Revenue ($)",
					data: revenueData[selectedPeriod].data,
					backgroundColor: "rgba(54, 162, 235, 0.7)", // Blue
					borderColor: "rgba(54, 162, 235, 1)",
					borderWidth: 1,
				},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false, // Allows manual height/width adjustments
				scales: {
				y: {
					beginAtZero: true,
					title: { display: true, text: "Revenue ($)" },
				},
				x: { title: { display: true, text: "Time Period" } },
				},
				plugins: {
				legend: { display: true, position: "top" },
				tooltip: {
					callbacks: {
					label: (tooltipItem) => `$${tooltipItem.raw.toLocaleString()}`, // Format in $
					},
				},
				},
			},
			});
		}, 1000)
	  }, [selectedPeriod]);

    return ( 
        <div className="dashboard">
            <h1>
                Dashboard
            </h1>
			<div className="dashboard-top">
				<div className="form">
					<div className="form-dropdown">
						<label for="">Range</label>
						<select onChange={(e) => setSelectedPeriod(e.target.value)} value={selectedPeriod}>
							<option value="weekly" selected={selectedPeriod === "weekly" ? true : false}>Weekly</option>
							<option value="monthly" selected={selectedPeriod === "monthly" ? true : false}>Monthly</option>
						</select>
					</div>
				</div>
			</div>
            <div className="dashboard-bottom">
                <div className="section user-section">
				<div className="section-title">Users</div>
                    <div className="section-top">
                        <div className="card">
                            <div className="value">177.1K</div>
                            <div className="title">Total users</div>
                            <div className="increase">23% from previous 7 days</div>
                        </div>
                        <div className="card">
                            <div className="value">65.1K</div>
                            <div className="title">Premium users</div>
                            <div className="increase">10% from previous 7 days</div>
                        </div>
                        <div className="card">
                            <div className="value">1K</div>
                            <div className="title">Suspended users</div>
                            <div className="increase">0.1% from previous 7 days</div>
                        </div>
                    </div>
                    <div className="user-section-chart">
                        <canvas id="userChart"></canvas>
                    </div>
                </div>
                <div className="section user-section">
					<div className="section-title">Chats</div>
                    <div className="section-top">
                        <div className="card">
                            <div className="value">177.1K</div>
                            <div className="title">Private chats</div>
                            <div className="increase">23% from previous 7 days</div>
                        </div>
                        <div className="card">
                            <div className="value">65.1K</div>
                            <div className="title">Groups</div>
                            <div className="increase">10% from previous 7 days</div>
                        </div>
                        <div className="card">
                            <div className="value">1K</div>
                            <div className="title">Communities</div>
                            <div className="increase">0.1% from previous 7 days</div>
                        </div>
                    </div>
                    <div className="user-section-chart">
                        <canvas id="chatChart"></canvas>
                    </div>
                </div>
				<div className="section">
					<div className="section-title">
						Storage usage
					</div>
					<div className="user-section-chart">
						<canvas id="storageChart"></canvas>
					</div>
				</div>
				<div className="section">
					<div className="section-title">
						Revenue
					</div>
					<div className="user-section-chart">
						<canvas id="revenueChart"></canvas>
					</div>
				</div>
                <div className="section">
                    <div className="section-top">
                        <div className="card-2">
                            <div className="title">Forum</div>
                            <div className="key-value">
                                <div className="key">Questions</div>
                                <div className="value">100K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Answers</div>
                                <div className="value">250K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Comments</div>
                                <div className="value">500K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Storage usage</div>
                                <div className="value">50GB</div>
                            </div>
                        </div>
                        <div className="card-2">
                            <div className="title">Blogs</div>
                            <div className="key-value">
                                <div className="key">Blogs</div>
                                <div className="value">100K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Comments</div>
                                <div className="value">250K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Storage usage</div>
                                <div className="value">50GB</div>
                            </div>
                        </div>
                        <div className="card-2">
                            <div className="title">Notes</div>
                            <div className="key-value">
                                <div className="key">Notes</div>
                                <div className="value">100K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Forks</div>
                                <div className="value">250K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Storage usage</div>
                                <div className="value">50GB</div>
                            </div>
                        </div>
                        <div className="card-2">
                            <div className="title">Files</div>
                            <div className="key-value">
                                <div className="key">Videos</div>
                                <div className="value">100K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Images</div>
                                <div className="value">250K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Pdfs</div>
                                <div className="value">250K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Other</div>
                                <div className="value">250K</div>
                            </div>
                            <div className="key-value">
                                <div className="key">Storage usage</div>
                                <div className="value">50GB</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <span>
                Total number of users(active, inactive, pending)
                Number of content creations
                Charts
            </span> */}
            {/* <div className="card-section">
                <h2>Users</h2>
                <div className="card-container">
                    <Card key="1" title="Total Users" count={100}/>
                    <Card key="2" title="Active Users" count={100}/>
                    <Card key="3" title="Pending Users" count={100}/>
                </div>
            </div>
            <div className="card-section">
                <h2>Con</h2>
                <div className="card-container">
                    <Card key="1" title="Total Users" count={100}/>
                    <Card key="2" title="Active Users" count={100}/>
                    <Card key="3" title="Pending Users" count={100}/>
                </div>
            </div> */}
            {/* <div className="charts">
                <canvas id="userGrowthChart" width="800" height="500" style="border:1px solid #ccc;"></canvas>
            </div> */}
            {/* <App2 /> */}
        </div>
     );
}

// function App() {
//   const [selectedPeriod, setSelectedPeriod] = useState("7d"); // Default: Last 7 Days
//   const chartRef = useRef(null); // Store chart instance

//   // Sample Data for Different Periods
//   const userTrends = {
//     "7d": { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [100, 150, 200, 220, 300, 400, 500] },
//     "30d": { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [600, 800, 900, 1200] },
//     "6m": { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], data: [3000, 4500, 5200, 5800, 6200, 7000] },
//     "1y": { labels: ["Q1", "Q2", "Q3", "Q4"], data: [10000, 12000, 15000, 17000] },
//   };

//   useEffect(() => {
//     setTimeout(() => {
//         if (chartRef.current) {
//           chartRef.current.destroy(); // Destroy previous chart instance
//         }
    
//         const ctx = document.getElementById("userTrendChart").getContext("2d");
    
//         chartRef.current = new Chart(ctx, {
//           type: "line",
//           data: {
//             labels: userTrends[selectedPeriod].labels,
//             datasets: [
//               {
//                 label: "Active Users",
//                 data: userTrends[selectedPeriod].data,
//                 borderColor: "blue",
//                 backgroundColor: "rgba(0, 0, 255, 0.2)",
//                 fill: true,
//               },
//               {
//                 label: "Active Users",
//                 data: userTrends["1y"].data,
//                 borderColor: "yellow",
//                 backgroundColor: "rgba(199, 136, 0, 0.2)",
//                 fill: true,
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             scales: {
//               x: { title: { display: true, text: "Time Period" } },
//               y: { title: { display: true, text: "Number of Users" }, beginAtZero: true },
//             },
//           },
//         });
//     }, 0);
//   }, [selectedPeriod]);

//   return (
//     <div className="dashboard" style={{ textAlign: "center", padding: "20px" }}>
//         <div className="user-section">
//             <h2>User Trend Graph</h2>
//             <select onChange={(e) => setSelectedPeriod(e.target.value)} value={selectedPeriod}>
//                 <option selected={selectedPeriod == "7d" ? true : false} value="7d">Last 7 Days</option>
//                 <option selected={selectedPeriod == "30d" ? true : false} value="30d">Last 30 Days</option>
//                 <option selected={selectedPeriod == "6m" ? true : false} value="6m">Last 6 Months</option>
//                 <option selected={selectedPeriod == "1y" ? true : false} value="1y">Last Year</option>
//             </select>
//             <canvas id="userTrendChart" style={{ maxWidth: "600px", marginTop: "20px" }}></canvas>
//         </div>    
//         <div className="storage-section">
//             <h2>Storage usage</h2>
//             <select onChange={(e) => setSelectedPeriod(e.target.value)} value={selectedPeriod}>
//                 <option selected={selectedPeriod == "7d" ? true : false} value="7d">Last 7 Days</option>
//                 <option selected={selectedPeriod == "30d" ? true : false} value="30d">Last 30 Days</option>
//                 <option selected={selectedPeriod == "6m" ? true : false} value="6m">Last 6 Months</option>
//                 <option selected={selectedPeriod == "1y" ? true : false} value="1y">Last Year</option>
//             </select>
//             <canvas id="userTrendChart" style={{ maxWidth: "600px", marginTop: "20px" }}></canvas>
//         </div> 
//         <div className="reports-section">
//             <h2>Reports received</h2>

//         </div>
//     </div>
//   );
// }

function App2() {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const chartRefs = useRef();

  // Sample Data for Different Metrics
  const analyticsData = {
    weekly: {
      user: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [100, 150, 200, 180, 250, 300, 350] },
      chat: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [50, 80, 120, 110, 150, 180, 200] },
      forum: { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data: [20, 40, 60, 55, 70, 90, 120] },
      file: { labels: ["Images", "Videos", "PDFs", "Other"], data: [200, 100, 50, 30] },
    },
    monthly: {
      user: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [800, 1000, 1200, 1500] },
      chat: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [300, 500, 700, 900] },
      forum: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], data: [150, 180, 220, 300] },
      file: { labels: ["Images", "Videos", "PDFs", "Other"], data: [900, 400, 200, 120] },
    },
  };

  // Create Charts
  useEffect(() => {
      setTimeout(()=>{
        // const ctxIds = ["userChart", "chatChart", "forumChart", "fileChart"];
        const ctxIds = ["userChart", "chatChart"];
        ctxIds.forEach((id) => {

        if(!chartRefs.current){
            chartRefs.current = {}
        }

          if (chartRefs.current[id]) {
            chartRefs.current[id].destroy(); // Destroy existing chart
          }
          const ctx = document.getElementById(id).getContext("2d");
    
          const type = id === "fileChart" ? "bar" : "line"; // Bar chart for files, others are line charts
          chartRefs.current[id] = new Chart(ctx, {
            type: type,
            data: {
              labels: analyticsData[selectedPeriod][id.replace("Chart", "")].labels,
              datasets: [
                {
                  label: id.includes("file") ? "Uploads" : "Active Count",
                  data: analyticsData[selectedPeriod][id.replace("Chart", "")].data,
                  borderColor: "blue",
                //   backgroundColor: id.includes("file") ? "rgba(255, 99, 132, 0.5)" : "rgba(0, 0, 255, 0.2)",
                //   fill: true,
                  tension: 0.4 // Smooth curve   
                },
                {
                  label: id.includes("file") ? "Uploads" : "Active Count",
                  data: analyticsData[selectedPeriod]["chat"].data,
                  borderColor: "red",
                //   backgroundColor: id.includes("file") ? "rgba(255, 99, 132, 0.5)" : "rgba(255, 238, 0, 0.2)",
                //   fill: true,
                  tension: 0.4 // Smooth curve   
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                x: { title: { display: true, text: "Time Period" } },
                y: { title: { display: true, text: "Count" }, beginAtZero: true },
              },
            },
          });
        });
    }, 300)
  }, [selectedPeriod]);

  return (
    <div className="p-6 dashboard">
      {/* <h1 className="text-2xl font-bold text-center mb-4">Admin Dashboard</h1> */}

      {/* Timeframe Selector */}
      <div className="flex justify-center mb-6">
        <select className="p-2 border rounded" onChange={(e) => setSelectedPeriod(e.target.value)} value={selectedPeriod}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Dashboard Cards & Graphs */}
      <div className="grid grid-cols-2 gap-6 card-container">
        {/* Users Overview */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">User Trends</h2>
          <canvas id="userChart"></canvas>
        </div>

        {/* Chat Analytics */}
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Chat Engagement</h2>
          <canvas id="chatChart"></canvas>
        </div> */}

        {/* Forum Analytics */}
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Forum Discussions</h2>
          <canvas id="forumChart"></canvas>
        </div> */}

        {/* File Management */}
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">File Uploads</h2>
          <canvas id="fileChart"></canvas>
        </div> */}
      </div>
    </div>
  );
}

 
export default Dashboard;