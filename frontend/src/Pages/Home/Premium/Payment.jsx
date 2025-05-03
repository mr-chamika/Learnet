import { useContext, useState } from "../../../../react_lite/createDOM";
import { UserContext } from "../../../Contexts/UserContext";
import "./Payment.css"

const PayHereCheckout = ({plan, isMonthly}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useContext(UserContext)

  const merchantId = 1230134

  // Default order details
  const defaultOrder = {
    first_name: 'Gishan',
    last_name: 'Maduranga',
    email: 'gishanmaduranga33@gmail.com',
    phone: '04567897891',
    address: 'Ambalangoda',
    city: 'Ambalangoda',
    country: 'Sri Lanka',
    // order_id: `order_${Date.now()}`,
    items: 'Order Payment',
    currency: 'LKR',
    // amount: 9.99,
    renewal: isMonthly ? "monthly" : "yearly",
    duration: 'Forever',
  };

  const [formData, setFormData] = useState(defaultOrder);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log("make payment")
    // try {
      // In a real application, you would call your backend API here
      // to get the hash value instead of generating it client-side

      fetch("http://localhost:8080/payment/create-order",{
        method: "POST",
        headers: {
            authorization: `bearer ${user.token}`
        },
        body: JSON.stringify({
            planId: plan._id,
            isMonthly: formData.renewal === "monthly" ? true : false
        })
      })
      .then(res=>res.json())
      .then(data=>{
        if(!data.error){
            const hash = data.hash
            const order = data.order
            console.log("order hash: ", order, hash)
            // const hash = await generateClientSideHash(); // For demo only
        
            // Create a hidden form and submit it
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://sandbox.payhere.lk/pay/checkout';
    
            // Add all required parameters
            const params = {
            merchant_id: merchantId,
            return_url: `${window.location.origin}/payment-success`,
            cancel_url: `${window.location.origin}/payment-cancelled`,
            notify_url: `${window.location.origin}/api/payhere-notify`,
            ...formData,
            recurrence: formData.renewal === "monthly" ? "1 Month" : "1 Year",
            order_id: order._id,
            amount: order.price,
            hash
            };

            delete formData.renewal

            console.log("params : ", params)
    
            // Add all parameters as hidden inputs
            Object.entries(params).forEach(([key, value]) => {
            // if (value) { // Only add non-empty values
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            // }
            });
    
            console.log("form : ", form)
            document.body.appendChild(form);
            form.submit();
        }
      })

    // } catch (err) {
    //   setError('Failed to initialize payment. Please try again.');
    //   console.error('Payment initialization error:', err);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="payhere-checkout">
      <h2>Payment Details</h2>
      
      {error && (<div className="error-message">{error}</div>)}

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-column">
            <div className="form-row">
            <div className="form-group">
                <label>First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required={true}
                />
            </div>
            <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required={true}
                />
            </div>
            </div>

            <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required={true}
            />
            </div>

            <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required={true}
            />
            </div>

            <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required={true}
            />
            </div>

            <div className="form-row">
            <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required={true}
                />
            </div>
            <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} required={true}
                />
            </div>
            </div>

            <div className="form-group">
            <label>Order Description</label>
            <input disabled={true} type="text" name="items" value={`${plan.name} plan payment`} onChange={handleChange} required={true}
            />
            </div>
        </div>
        <div className="form-column">
            <div className="form-row">
            <div className="form-group">
                <label>Amount ({formData.currency})</label>
                <input disabled={true} type="number" name="amount" value={`${formData.renewal === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}`} onChange={handleChange} min="0" step="0.01" required={true}
                />
            </div>
            <div className="form-group">
                <label>Currency</label>
                <select disabled={true} name="currency" value={formData.currency} onChange={handleChange} required={true}>
                    <option value="LKR">LKR (Sri Lankan Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                </select>
            </div>
            </div>

            <div className="recurring-fields">
            <h3>Recurring Payment</h3>
            <div className="form-row">
                <div className="form-group">
                <label>Renewal</label>
                {/* <input disabled={true} type="text" name="renewal" value={isMonthly ? "1 Month" : "1 Year"} onChange={handleChange} placeholder="e.g., 1 Month" />*/}
                <select name="renewal" value={formData.renewal} onChange={handleChange} required={true}>
                    <option selected={formData.renewal === "monthly"} value="monthly">Monthly</option>
                    <option selected={formData.renewal === "yearly"} value="yearly">Yearly</option>
                </select>
                </div>
                <div className="form-group">
                <label>Duration</label>
                <input disabled={true} type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 1 Year or Forever"
                />
                </div>
            </div>
            <div className="message">
                You will be charged every 
                {formData.renewal === "monthly" ? 
                    (
                        <b>month. </b>
                    ):(
                        <b>year. </b>
                    )
                }
                You can cancel the subscription anytime. You'll retain access until the end of your current billing period. No further charges will apply once canceled.
            </div>
            </div>
            {isLoading ? (
                <button type="submit" onClick={e=>e.stopPropagation()} disabled={isLoading} className="pay-now-btn">
                    Processing...
                </button>
            ):(
                <button type="submit" onClick={e=>e.stopPropagation()} disabled={isLoading} className="pay-now-btn">
                    Proceed to PayHere
                </button>
            )}
        </div>
        
      </form>
    </div>
  );
};

export default PayHereCheckout;