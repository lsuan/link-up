import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
function Calendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
  const daysInMonth = (month: number, year: number) => {
    return 32 - new Date(year, month, 32).getDate();
  }
  
  const setCalendar = () => {
    const table = document.querySelector(".calendar-body");
    table?.replaceChildren("");

    let firstDay = (new Date(year, month)).getDay();
    let date = 1;
    for (let i = 0; i < 6; i++) {
      // creates a table row
      let row = document.createElement("div");
      row.classList.add("grid", "grid-cols-7");

      //creating individual cells, filing them up with data.
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          let cell = document.createElement("div");
          let cellText = document.createTextNode("");
          cell.appendChild(cellText);
          cell.classList.add("cell", "p-1", "m-1", "rounded-md");
          row.appendChild(cell);
        }
        else if (date > daysInMonth(month, year)) {
          break;
        }
        else {
          let cell = document.createElement("div");
          let cellText = document.createTextNode(date.toString());
          cell.appendChild(cellText);
          cell.classList.add(`cell-${date}`, "p-1", "m-1", "rounded-md");
          if (today.getDate() === date && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add("bg-blue-300/75");
          }
          cell.addEventListener("mouseup", onDateSelect);
          row.appendChild(cell);
          date++;
        }
      }

      table?.appendChild(row); // appending each row into calendar body.
    }
  }

  const onDateSelect = () => {
    const selected = window.getSelection();
    const dateRange = selected?.getRangeAt(0);
    const startDate = dateRange?.startContainer.textContent;
    const endDate = dateRange?.endContainer.textContent;
    
    for (let i = Number(startDate); i <= Number(endDate); i++) {
      const date = `${month+1}/${i}/${year}`;

      if (!selectedDates.includes(date)) {
        setSelectedDates((arr) => [...arr, date]);
        addHighlight(i);
      } else {
        removeHighlight(i);
        setSelectedDates((arr) => arr.filter(d => d !== date));
      }
    }
  }
  
  const addHighlight = (day: number) => {
    document.querySelector(`.cell-${day}`)?.classList.add("bg-rose-200");
  }

  const removeHighlight = (day: number) => {
    document.querySelector(`.cell-${day}`)?.classList.remove("bg-rose-200");
  }

  const incrementMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear( (newYear) => { return newYear + 1 });
    } else {
      setMonth((newMonth) => { return newMonth + 1 });
    }
    console.log(selectedDates);
  }

  const decrementMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear( (newYear) => { return newYear - 1 });
    } else {
      setMonth((newMonth) => { return newMonth - 1 });
    }

    // TODO: add highlight back on cells;
  }

  useEffect( () => {
    setCalendar();
  }, [month, year]);

  return (
    <section className="w-fit">
      <div className="text-xl text-center text-beige">
        <div className="flex justify-center items-center">
          {
            (today < new Date(year, month)) ? (
              <FontAwesomeIcon 
                icon={faCaretLeft}
                onClick={decrementMonth}
                className="mr-3 text-2xl text-indigo-400/75 hover:text-indigo-500/75 cursor-pointer"/>
            ) : (
              <div className="pr-3 mr-3"/>
            )
          }
          <div className="w-40">
            { `${monthNames[month]} ${year}` }
          </div>
          <FontAwesomeIcon
            icon={faCaretRight}
            onClick={incrementMonth}
            className="ml-3 text-2xl text-indigo-400/75 hover:text-indigo-500/75 cursor-pointer"/>
        </div>
      </div>
      <div className="calendar bg-blue-400/75 rounded-md text-center p-3 w-fit">
        <div className="header grid grid-cols-7 gap-3 pb-2">
          <div className="weekday">
            Sun
          </div>
          <div className="weekday">
            Mon
          </div>
          <div className="weekday">
            Tue
          </div>
          <div className="weekday">
            Wed
          </div>
          <div className="weekday">
            Thu
          </div>
          <div className="weekday">
            Fri
          </div>
          <div className="weekday">
            Sat
          </div>
        </div>
        <div className="calendar-body" />
      </div>
    </section>
  );
}

export default Calendar;