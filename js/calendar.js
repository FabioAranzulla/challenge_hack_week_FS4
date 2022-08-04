const load = document.querySelector("#spinner");
let listaeventi = [];
let eventipercentuale = [];

async function draw() {
  try {
    const response = await fetch(
      `https://api.spaceflightnewsapi.net/v3/articles?_limit=-1`
    );
    const element = await response.json();
    // console.log(element);}
    element.forEach((element) => {
      listaeventi.push({
        title: element.title,
        start: element.updatedAt,
        url: element.url,
        prova: element.newsSite,
      });
    });
  } catch (e) {
    console.log(e);
  } finally {
    load.style.display = "none";

    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      initialDate: "2022-07-07",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      events: listaeventi,
      eventClick: function (event) {
        if (event.event.url) {
          event.jsEvent.preventDefault();
          window.open(event.event.url, "_blank");
        }
      },
    });

    calendar.render();
  }
}

draw();
