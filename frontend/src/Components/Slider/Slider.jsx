import { useState } from "../../../react_lite/createDOM"
import "./Slider.css"

const Slider = ({children, width, height, onSubmit, onCancel, submitButtonLabel}) => {

    if(!submitButtonLabel){
        submitButtonLabel = "Submit"
    }

    // console.log(children)
    const slideCount = children.length
    const [activeSlide, setActiveSlide] = useState(0)

    const previousHandler = (e) => {
        e.preventDefault()
        setActiveSlide(prev => {
            if(prev > 0){
                return prev - 1
            }else{
                return prev
            }
        })
    }

    const nextHandler = (e) => {
        e.preventDefault()
        setActiveSlide(prev => {
            if(prev < slideCount - 1){
                return prev + 1
            }else{
                return prev
            }
        })
    }

    return ( 
        <div className="slider" style={`width:${width ? width : "inherit"}; height:${height ? height : "inherit"};`}>
            <div className="content">
                {
                    children.map((slide ,index)=>{

                        const c1 = "slide active";
                        const c2 = "slide";

                        return (
                          <div className={index === activeSlide ? c1 : c2} >
                            {[slide]}
                          </div>
                        )
                    })
                }
            </div>
            <div className="controls">
                <button className="icon-button" onClick={previousHandler} disabled={activeSlide === 0}>Previous</button>
                {activeSlide !== slideCount - 1 && (<button className="icon-button" onClick={nextHandler}>Next</button>)}
                {activeSlide === slideCount - 1 && onSubmit && (<button className="icon-button submit-button" onClick={onSubmit}>{submitButtonLabel}</button>)}
                {onCancel && (<button className="icon-button" onClick={onCancel}>Cancel</button>)}

            </div>
        </div>
     );
}
 
export default Slider;