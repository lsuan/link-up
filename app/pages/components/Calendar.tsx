import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
function Calendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const daysInMonth = (month: number, year: number) => {
    return 32 - new Date(year, month, 32).getDate();
  }
  const setCalendar = () => {
    const year = today.getFullYear();
    const table = document.querySelector(".calendar-body");

    let firstDay = (new Date(year, month)).getDay();
    let date = 1;
    for (let i = 0; i < 6; i++) {
      // creates a table row
      let row = document.createElement("div");
      row.classList.add("grid", "grid-cols-7", "gap-3");

      //creating individual cells, filing them up with data.
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          let cell = document.createElement("div");
          let cellText = document.createTextNode("");
          cell.appendChild(cellText);
          cell.classList.add("py-2");
          row.appendChild(cell);
        }
        else if (date > daysInMonth(month, year)) {
          break;
        }
        else {
          let cell = document.createElement("div");
          let cellText = document.createTextNode(date.toString());
          cell.appendChild(cellText);
          cell.classList.add("py-2");
          row.appendChild(cell);
          date++;
        }
      }

      if (table) {
        table.appendChild(row); // appending each row into calendar body.
      }
    }
  }

  useEffect( () => {
    setCalendar();
  }, []);

  return (
    <>
      <div className="text-xl text-beige">
        <FontAwesomeIcon icon={faCaretLeft} />
        { monthNames[month] }
        <FontAwesomeIcon icon={faCaretRight} />
      </div>
      <div className="calendar rounded-md bg-lavendar text-center p-3 w-fit">
        <div className="header grid grid-cols-7 gap-3">
          <div className="weekday px-2">
            Sun
          </div>
          <div className="weekday px-2">
            Mon
          </div>
          <div className="weekday px-2">
            Tue
          </div>
          <div className="weekday px-2">
            Wed
          </div>
          <div className="weekday px-2">
            Thu
          </div>
          <div className="weekday px-2">
            Fri
          </div>
          <div className="weekday px-2">
            Sat
          </div>
        </div>
        <div className="calendar-body">
        </div>
      </div>
    </>
  );
}

export default Calendar;