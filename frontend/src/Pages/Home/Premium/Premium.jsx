// import "./Premium.css";
// import PremiumCard from "../../../Components/PremiumCard/PremiumCard";
import "./SubscriptionPlans.css";
import { useContext, useEffect, useState } from "../../../../react_lite/createDOM";
import PopupBox, { openPopup } from "../../../Components/PopupBox/PopupBox";
import PayHereCheckout from "./Payment";
import { UserContext } from "../../../Contexts/UserContext";

// const Premium = () => {

//     return (

//         <div className="premium-page">

//             <div className="head">

//                 <h1 className="head-up">Be Premium Today !!!!!! </h1>


//             </div>

//             <div className="packages">

//                 <PremiumCard className="gold"

//                     title="Gold"
//                     price={5000}
//                     color="#ffd900ae"
//                     features={["Additional 1TB Personal Storage", "Unlimited Members & Groups", "Create communities"]}

//                 />

//                 <PremiumCard className="silver"

//                     title="Silver"
//                     price={3000}
//                     color="#c0c0c074"
//                     features={["Additional 0.1TB Personal Storage", "Additional 50 Group Members", "Additional 3 groups"]}

//                 />

//                 <PremiumCard className="bronze"

//                     title="Bronze"
//                     price={1000}
//                     color="#8325259f"
//                     features={["Additional 5 Group Members", "Invite multiple friends once", "Additional 1 group"]}

//                 />

//             </div>

//             <div className="p-bottom">

//                 <h1 className="up">Get Premium , </h1>
//                 <h1 className="next">Get More Features . </h1>

//             </div>

//         </div>

//     );

// }

// export default Premium;

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showPopup, setShowPopup] = useState(false)

  const {user} = useContext(UserContext)

//   const plans = {
//     free: {
//       name: "Free",
//       price: 0,
//       features: ["Basic features", "Limited storage", "Community support"],
//       cta: "Get Started"
//     },
//     basic: {
//       name: "Basic",
//       price: billingCycle === "monthly" ? 9.99 : 99.99,
//       features: ["All free features", "More storage", "Email support", "Basic analytics"],
//       cta: currentPlan === "basic" ? "Current Plan" : "Upgrade"
//     },
//     pro: {
//       name: "Professional",
//       price: billingCycle === "monthly" ? 19.99 : 199.99,
//       features: ["All basic features", "Priority support", "Advanced analytics", "API access"],
//       cta: currentPlan === "pro" ? "Current Plan" : "Upgrade"
//     },
//     enterprise: {
//       name: "Enterprise",
//       price: billingCycle === "monthly" ? 49.99 : 499.99,
//       features: ["All pro features", "Dedicated account manager", "Custom integrations", "24/7 support"],
//       cta: currentPlan === "enterprise" ? "Current Plan" : "Contact Sales"
//     }
//   };

    const [plans, setPlans] = useState(null)
    useEffect(()=>{
        fetch("http://localhost:8080/payment/get-plans", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("splans : ", data)
            if(!data.error){
                setPlans(data)
            }
        })
    }, [user])

    if(!plans){
        return (
            <div className="center-aligned-message-container">
                Loading...
            </div>
        );
    }

  const handleSubscribe = (planName) => {
    setIsLoading(true);
    console.log("selected plan : ", planName, plans[planName])
    setSelectedPlan(plans[planName]);
    setShowPopup(true)
    // openPopup("premium-pay")
    // Simulate API call
    // setTimeout(() => {
    //   setCurrentPlan(plan);
    //   setIsLoading(false);
    //   alert(`Successfully ${plan === "free" ? "downgraded" : "subscribed"} to ${plans[plan].name} plan!`);
    // }, 1500);
  };

  const handleCancel = (e) => {
    setIsLoading(false);
    setSelectedPlan(plans[currentPlan]);
    setShowPopup(false)
  }

  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly");
  };

  return (
    <div className="subscription-container">
      <h2>Choose Your Plan</h2>
      <p className="subtitle">Select the plan that"s right for you</p>
      
      <div className="billing-toggle">
        <span className={billingCycle === "monthly" ? "active" : ""}>Monthly</span>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={billingCycle === "yearly"}
            onChange={toggleBillingCycle}
          />
          <span className="slider round"></span>
        </label>
        <span className={billingCycle === "yearly" ? "active" : ""}>Yearly (Save 20%)</span>
      </div>

    { showPopup && (
        <PopupBox className="premium-pay-popup" key="1" show={showPopup} bgClickHandler={handleCancel}>
            <PayHereCheckout plan={selectedPlan} isMonthly={billingCycle == "monthly" ? true : false}/>  
        </PopupBox>
    )}
      
      <div className="plans-grid">
        {Object.entries(plans).map(([key, plan]) => {
            return (
                <div 
                    key={key} 
                    className={`plan-card ${currentPlan === key ? "current" : ""} ${selectedPlan === key ? "selected" : ""}`}
                >
                    <div>
                        <h3>{plan.name}</h3>
                        {
                            billingCycle === "monthly" ? (
                                <div className="price">
                                    <span>Rs.{plan.monthlyPrice.toFixed(2)}</span>
                                    <span>/mo</span>
                                </div>
                            ):(
                                <div className="price">
                                    <span>Rs.{plan.yearlyPrice.toFixed(2)}</span>
                                    <span>/yr</span>
                                </div>
                            )
                        }
                        <ul className="features">
                        {plan.features.map((feature, index) => {
                            return (<li key={index}>{feature}</li>)
                        })}
                        </ul>
                    </div>
                        <button
                        className={`action-button ${currentPlan === key ? "current" : ""}`}
                        onClick={() => handleSubscribe(key)}
                        disabled={currentPlan === key || isLoading}
                    >
                        {isLoading && selectedPlan === key ? (
                            <span className="loader"></span>
                        ) : (
                            <span>
                                {currentPlan === key ? 
                                    (
                                        <span>Active</span>
                                    ):(
                                        <span>Upgrade</span>
                                    )
                                }
                            </span>
                        )}
                    </button>
                    {currentPlan === key && (<div className="current-badge">Current Plan</div>)}
                </div>
            )
        })}
      </div>
      
      <div className="subscription-footer">
        <p>Need help choosing? <a href="/contact">Contact our sales team</a></p>
        <p>All plans come with a 30-day money-back guarantee</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;