import "./Calendar.css"

const CalenderRow = ({}) => {

    const calenderRow = Array(7).fill(0)

    return ( 
        <div className="calender-day">
          {
            calenderRow.map((cell, i)=>{
                return (
                    <div key={i} className="task">
                        {0}
                    </div>
                )
            })
          }
          
        </div>
     );
}

export default CalenderRow