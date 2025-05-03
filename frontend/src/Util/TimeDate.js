export function getTimeDate(timestamp, timeFormat = "HH-MM"){
    const dateObj = new Date(timestamp)
    const isoString = dateObj.toISOString()
    // console.log("isoString: ", isoString)
    const [date, t] = isoString.split("T")
    let time
    switch(timeFormat){
        case "HH":
            time = t.sclie(0, 2)
            break
        case "HH-MM":
            time = t.slice(0, 5)
            break
        case "HH-MM-SS":
            time = t.slice(0, 8)
            break
        default: 
            time = t.slice(0, 8)
    }
    return [date, time]
}

export function getDate(timestamp){
    const dateObj = new Date(timestamp)
    const date = dateObj.toDateString()
    const today = new Date(Date.now())
    let formattedDate = ""
    if(today.getFullYear() == dateObj.getFullYear()){
        formattedDate = date.slice(3, 11)
    }else{
        formattedDate = dateObj.getFullYear() + " " + date.slice(3, 11)
    }
    return formattedDate
}