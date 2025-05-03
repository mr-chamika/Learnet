//import CalenderRow from "./calenderRow";
import { useContext, useEffect, useState } from "../../../../react_lite/createDOM";
//import Calender from "./Calendar";
import './Calendar.css';
import Link  from "../../../Router/Link.jsx";
import {format} from "../../Schedule/utils/dateUtil.js"     
import { UserContext } from "../../../Contexts/UserContext.jsx";
import { SelectedTaskContext } from "../../../Contexts/SelectedTaskContext.jsx";


const WEEKDAYS = ["Sun", "Mon","Tue", "Wed","Thu", "Fri","Sat"];

const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay(); // Get first day (0 = Sunday, 1 = Monday, etc.)
  const totalDays = new Date(year, month + 1, 0).getDate(); // Get total days in the month

  const daysArray = [];

  // Fill empty slots before the first day
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null); // Empty spots for previous month
  }

  // Fill days of the month
  let j = 0
  for (let i = 1; i <= totalDays; i++) {
    if(daysArray.length > 34){
      daysArray[j++] = i
    }else{
      daysArray.push(i);
    }
  }

  // Fill empty slots after the last day to complete the last row
  const remainingSlots = 7 - (daysArray.length % 7);
  if (remainingSlots < 7) { // If the row is incomplete, fill it
    for (let i = 0; i < remainingSlots; i++) {
      daysArray.push(null); // Empty spots for next month
    }
  }

  return daysArray;
};

const Task = ({ task }) => {

// const startsAt = task.startsAt.split(" ")
// const endsAt = task.endsAt.split(" ")

  return (
    <div className="task-new">
      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>
      {/* <div className="task-date-time">
        Starts at : 📅 {startsAt[0]} ⏰ {startsAt[1]}
      </div>
      <div className="task-date-time">
        Ends at : 📅 {endsAt[0]} ⏰ {endsAt[1]}
      </div> */}
	  <div className="task-date-time">
		{task.date}
		</div>
	  {/* <div className="task-buttons">
		<button className="icon-button">Edit</button>
		<button className="icon-button">Remove</button>
	  </div> */}
    </div>
  );
};

// const tasks = {
// 	10: {
// 		taskCount: 5,
// 		tasks: [
// 			{ title: "Study React", description: "Go through React hooks and lifecycle", startsAt: "2025-03-10 10:00 AM", endsAt: "2025-03-10 10:00 AM"},
// 			{ title: "Complete Assignment", description: "Finish the database project", startsAt: "2025-03-12 2:00 PM", endsAt: "2025-03-12 2:00 PM"},
// 			{ title: "Gym Session", description: "Leg day workout", startsAt: "2025-03-13 6:00 PM", endsAt: "2025-03-13 6:00 PM"},
// 			{ title: "Meeting with Mentor", description: "Discuss career roadmap", startsAt: "2025-03-15 3:30 PM", endsAt: "2025-03-15 3:30 PM"},
// 			{ title: "Study React", description: "Go through React hooks and lifecycle", startsAt: "2025-03-10 10:00 AM", endsAt: "2025-03-10 10:00 AM"},
// 			{ title: "Complete Assignment", description: "Finish the database project", startsAt: "2025-03-12 2:00 PM", endsAt: "2025-03-12 2:00 PM"},
// 			{ title: "Gym Session", description: "Leg day workout", startsAt: "2025-03-13 6:00 PM", endsAt: "2025-03-13 6:00 PM"},
// 			{ title: "Meeting with Mentor", description: "Discuss career roadmap", startsAt: "2025-03-15 3:30 PM", endsAt: "2025-03-15 3:30 PM"},
// 			{ title: "Study React", description: "Go through React hooks and lifecycle", startsAt: "2025-03-10 10:00 AM", endsAt: "2025-03-10 10:00 AM"},
// 			{ title: "Complete Assignment", description: "Finish the database project", startsAt: "2025-03-12 2:00 PM", endsAt: "2025-03-12 2:00 PM"},
// 			{ title: "Gym Session", description: "Leg day workout", startsAt: "2025-03-13 6:00 PM", endsAt: "2025-03-13 6:00 PM"},
// 		],
// 		details: {
// 			Tasks: 3,
// 			Events: 2
// 		}
// 	},
// 	20: {
// 		taskCount: 1,
// 		tasks: [
// 			{ title: "Meeting with Mentor", description: "Discuss career roadmap", startsAt: "2025-03-15 3:30 PM", endsAt: "2025-03-15 3:30 PM"},
// 			{ title: "Study React", description: "Go through React hooks and lifecycle", startsAt: "2025-03-10 10:00 AM", endsAt: "2025-03-10 10:00 AM"},
// 			{ title: "Complete Assignment", description: "Finish the database project", startsAt: "2025-03-12 2:00 PM", endsAt: "2025-03-12 2:00 PM"},
// 			{ title: "Gym Session", description: "Leg day workout", startsAt: "2025-03-13 6:00 PM", endsAt: "2025-03-13 6:00 PM"},
// 			{ title: "Meeting with Mentor", description: "Discuss career roadmap", startsAt: "2025-03-15 3:30 PM", endsAt: "2025-03-15 3:30 PM"},
// 			{ title: "Study React", description: "Go through React hooks and lifecycle", startsAt: "2025-03-10 10:00 AM", endsAt: "2025-03-10 10:00 AM"},
// 		],
// 		details: {
// 			Tasks: 0,
// 			Events: 1
// 		}
// 	},
// 	21: {
// 		taskCount: 4,
// 		tasks: [
// 			{ title: "Complete Assignment", description: "Finish the database project", startsAt: "2025-03-12 2:00 PM", endsAt: "2025-03-12 2:00 PM"},
// 			{ title: "Gym Session", description: "Leg day workout", startsAt: "2025-03-13 6:00 PM", endsAt: "2025-03-13 6:00 PM"},
// 			{ title: "Meeting with Mentor", description: "Discuss career roadmap", startsAt: "2025-03-15 3:30 PM", endsAt: "2025-03-15 3:30 PM"},
// 			{ title: "Study React", description: "Go through React hooks and lifecycle", startsAt: "2025-03-10 10:00 AM", endsAt: "2025-03-10 10:00 AM"},
// 			{ title: "Complete Assignment", description: "Finish the database project", startsAt: "2025-03-12 2:00 PM", endsAt: "2025-03-12 2:00 PM"},
// 			{ title: "Gym Session", description: "Leg day workout", startsAt: "2025-03-13 6:00 PM", endsAt: "2025-03-13 6:00 PM"},
// 			{ title: "Meeting with Mentor", description: "Discuss career roadmap", startsAt: "2025-03-15 3:30 PM", endsAt: "2025-03-15 3:30 PM"},
// 		],
// 		details: {
// 			Tasks: 2,
// 			Events: 2
// 		}
// 	}
// }

const CalenderComponent = () => {
  const now = new Date();
  // const year = now.getFullYear();
  // const [month, setMonth] = useState(now.getMonth());
  let {tasks: t, events: e} = useContext(SelectedTaskContext);
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState({ month: now.getMonth(), year: now.getFullYear() });
  const month = date.month
  const year = date.year
	const updateTasks = (t, e, month, year) => {
		const updatedTasks = {}
		t.forEach((task) => {
			const d = new Date(task.date).getDate();
			if(new Date(task.date).getMonth() === month && new Date(task.date).getFullYear() === year){
				if(updatedTasks[d]) {
					updatedTasks[d].taskCount += 1;
					updatedTasks[d].tasks.push(task);
					updatedTasks[d].details.Tasks += 1
				}else{
					updatedTasks[d] = {
						taskCount: 1,
						tasks: [task],
						details: {
							Tasks: 1,
							Events: 0
						}
					}
				}
			}
		})
		e.forEach((event) => {
			const d = new Date(event.date).getDate();
			if(new Date(event.date).getMonth() === month && new Date(event.date).getFullYear() === year){
				if(updatedTasks[d]) {
					updatedTasks[d].taskCount += 1;
					updatedTasks[d].tasks.push(event);
					updatedTasks[d].details.Events += 1
				}else{
					updatedTasks[d] = {
						taskCount: 1,
						tasks: [event],
						details: {
							Tasks: 0,
							Events: 1
						}
					}
				}
			}
		})
		return updatedTasks;
	}

	// const tasks = updateTasks(t);


	useEffect(() => {
		setTasks(updateTasks(t, e, month, year))
	}, [t, e])

  const nextMonth = () => {
    setDate((prev) => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
	  setTasks(updateTasks(t, e, newMonth, newYear))
      return { month: newMonth, year: newYear };
    });
  };

  const prevMonth = () => {
    setDate((prev) => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
	  setTasks(updateTasks(t, e, newMonth, newYear))
      return { month: newMonth, year: newYear };
    });
  };




  console.log("month: ", month)
  const days = getCalendarDays(year, month);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  date.day = 1

  const [selectedDate, setSelectedData] = useState(0)
  const monthString = format(new Date(date.year, date.month), "MMMM");


  return (
    <div className="calendar-component">
      <div className="calendar-container">
        <div className="calendar-title">Calendar</div>
        <div className="calendar-header">
          <div className="nav-month">
            <button className="icon-button small" onClick={prevMonth}>Previous</button>
          </div>
          <div className="month"><div> <h2> <span>{date.year}</span><span>-</span><span>{monthString}</span> </h2> </div></div>   
          <div className="nav-year">
              <button className="icon-button small" onClick={nextMonth}>Next</button>
          </div>
        </div>
	</div>
	<div className="task-list-container">
		<div className="task-list-title">Schedule</div>
		<div className="task-list-buttons">
			<span><Link className="icon-button" to="/user/personal-schedule/create-task" label="Add Task" /></span>
      <span><Link className="icon-button" to="/user/personal-schedule/create-event" label="Add Event" /></span>
		</div>
   
	</div>
	<div className="calendar-container">
        {/* Weekdays Header */}
        {/* <div className="calendar-header">
          
        </div> */}

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {weekDays.map((day) => (
            <div key={day} className="calendar-day">{day}</div>
          ))}
          {days.map((day, index) => (
            <div key={index} className={`calendar-cell ${day ? "filled" : "empty"} ${day === selectedDate ? "active" : ""}`} onClick={()=>setSelectedData(day)}>
              <div>{day}</div>
			  {tasks[day] && tasks[day].taskCount && (<div className="calendar-cell-task-count">{tasks[day].taskCount}</div>)}
			  {tasks[day] && tasks[day].taskCount && (
				<div className="calendar-cell-details">
					{
						Object.keys(tasks[day].details).map(key=>{
							return(
								<div className="item">
									<div className="key">
										{key}
									</div>
									<div>-</div>
									<div className="value">
										{tasks[day].details[key]}
									</div>
								</div>
							)
						})
					}
				</div>
				)}
            </div>
          ))}
        </div>
      </div>
      <div className="task-list-container">
	  {tasks[selectedDate] ? (
		<div className="task-list">
			{tasks[selectedDate].tasks.map((task, index) => (
				<Task key={index} task={task} />
			))}
		</div>
	  ) : (
		<div className="empty-task-list center-aligned-message-container">
			<div className="center-aligned-message">
				No tasks to show
			</div>
		</div>
	  )}
      </div>
    </div>
  );
};

export default  CalenderComponent

