const load = document.querySelector("#spinner");
//const load2 = document.querySelector('#container-load');
let datafilter = [];
let month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Dicember",
];

async function chart() {
  try {
    const response = await fetch(
      "https://api.spaceflightnewsapi.net/v3/articles?_limit=-1"
    );
    const data = await response.json();
    console.log(data);
    datafilter = data;
  } catch (err) {
    console.log(err);
  } finally {
    load.style.display = "none";
    //load2.style.display = 'none';

    let arrMonth = [];
    let nameSite = [];
    for (let i of datafilter) {
      arrMonth.push(Number(i.publishedAt.slice(5, 7)));
      nameSite.push(i.newsSite);
    }
    console.log(arrMonth);
    let objMonth = arrMonth.reduce(function (a, b) {
      if (b in a) {
        a[b]++;
      } else {
        a[b] = 1;
      }
      return a;
    }, {});
    console.log(objMonth);

    let objSite = nameSite.reduce(function (a, b) {
      if (b in a) {
        a[b]++;
      } else {
        a[b] = 1;
      }
      return a;
    }, {});
    console.log(nameSite);
    console.log(objSite);
    let y = Object.values(objMonth);
    let x = Object.keys(objMonth);

    let filter = Object.entries(objSite); //.map(entry => entry[1]);
    let filterMax = [];
    filterMin = [];
    let filter2 = filter.forEach((el) => {
      if (el[1] > 200) {
        filterMax.push(el);
      } else {
        filterMin.push(el);
      }
    });
    let filterOther = [];
    filterMin.forEach((el) => {
      filterOther.push(el[1]);
    });
    let filterOther2 = filterOther.reduce((a, b) => a + b, 0);
    let filterOther3 = ["Other"];
    filterOther3.push(filterOther2);
    filterMax.push(filterOther3);
    let filterObj = Object.fromEntries(filterMax);
    console.log(objSite);
    console.log(filterMax);
    console.log(filterOther3);

    let y2 = Object.values(filterObj);
    let x2 = Object.keys(filterObj);
    console.log(y);

    //bar chart
    const ctx = document.getElementById("canvas").getContext("2d");
    let myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: month,
        datasets: [
          {
            label: "Articles per month",
            backgroundColor: "#2e896c",
            data: y,
          },
        ],
      },
      options: {
        indexAxis: "y",
        y: {
          beginAtZero: true,
        },
      },
    });

    //pie charts
    const ctx2 = document.getElementById("myChart").getContext("2d");
    const myChart2 = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: x2,
        datasets: [
          {
            data: y2,
            label: "# of Votes",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(127, 128, 130, 0.2)",
              "rgba(194, 189, 236, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(127, 128, 130, 1)",
              "rgba(194, 189, 236, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            enabled: false,
          },
          datalabels: {
            formatter: (value, context) => {
              const datapoints = context.chart.data.datasets[0].data;
              const name = context.chart.data.labels;
              console.log(name, datapoints);
              function totalSum(total, datapoint) {
                return total + datapoint;
              }
              const totalvalue = datapoints.reduce(totalSum, 0);
              const percentageValue = ((value / totalvalue) * 100).toFixed(1);
              const display = [`${percentageValue}%`];
              return display;
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    let siteList = [];
    datafilter.forEach((element) => {
      if (!siteList.includes(element.newsSite)) {
        siteList.push(element.newsSite);
        const tag = document.createElement("option");
        document.querySelector(".dropdown-content").appendChild(tag);
        tag.innerHTML = element.newsSite;
        tag.setAttribute("value", element.newsSite);
      }
    });

    let testSelect = document.querySelector(".dropdown-content");
    testSelect.addEventListener("change", select);
    function select() {
      let datfilter2 = [];
      datafilter.forEach((el) => {
        if (el.newsSite == testSelect.value) {
          datfilter2.push(el);
        } else if (testSelect.value == "qualsiasi") {
          datfilter2.push(el);
        }
      });
      console.log(datfilter2);

      let arrMonth = [];
      let nameSite = [];
      for (let i of datfilter2) {
        arrMonth.push(Number(i.publishedAt.slice(5, 7)));
        nameSite.push(i.newsSite);
      }
      let objMonth = arrMonth.reduce(function (a, b) {
        if (b in a) {
          a[b]++;
        } else {
          a[b] = 1;
        }
        return a;
      }, {});
      console.log(objMonth);

      let objSite = nameSite.reduce(function (a, b) {
        if (b in a) {
          a[b]++;
        } else {
          a[b] = 1;
        }
        return a;
      }, {});
      console.log(objSite);
      let y = Object.values(objMonth);
      let x = Object.keys(objMonth);
      console.log(y);

      myChart.data.labels = month;
      myChart.data.datasets[0].data = y;
      myChart.update();
    }
  }
}

chart();
