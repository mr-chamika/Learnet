import { useEffect, useState } from "../../../react_lite/createDOM";

const OTPExpirationTimer = ({resetValue, duration, onExpire }) => {
  
  const [timeLeft, setTimeLeft] = useState(0);


  useEffect(()=>{
    setTimeLeft(duration)
  }, [resetValue])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if(prevTime > 0){
          return prevTime - 1
        }else{
          return prevTime
        }
    })
    }, 1000)

    return () => clearInterval(timer) // Clean up timer
  }, [])

  useEffect(()=>{
    if (timeLeft <= 0) {
        onExpire && onExpire() // Notify parent when OTP expires
        return;
      }
  }, [])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const time = formatTime(timeLeft)

  return (
    <div>
        <div>
            {timeLeft > 0 && (<p><span>OTP expires in: </span>{time}</p>)}
        </div>
        <div>
            {timeLeft <= 0 && (<p className="error">OTP has expired!</p>)}
        </div>
    </div>
  );
};

export default OTPExpirationTimer;
