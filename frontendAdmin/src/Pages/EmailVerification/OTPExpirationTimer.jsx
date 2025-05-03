import { useEffect, useState } from "../../../../frontend/react_lite/createDOM";

const OTPExpirationTimer = ({ timeLeft, setTimeLeft, onExpire }) => {
  

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
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
