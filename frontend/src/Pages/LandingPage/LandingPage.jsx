import "./LandingPage.css"
import Link from "../../Router/Link";
import heroImage from "../../Assets/hero/hero_small.jpg"
import forum from "../../Assets/features/forum.jpg"
import events from "../../Assets/features/events.jpg"
import groupMeeting from "../../Assets/features/group_meeting.jpg"
import PersonalFolder from "../../Assets/features/personal_folder.jpg"
import Navbar from "../../Components/Navbar/Navbar";
import { useLayoutEffect } from "../../../react_lite/createDOM";

const LandingPage = () => {


    useLayoutEffect((element)=>{
        // window.addEventListener('scroll', function() {
        //     // Get all image containers within the description boxes
        //     const parallaxImages = document.querySelectorAll('.description-box .img-container img');
          
        //     // Loop through each image and apply the parallax effect with automatic speed assignment
        //     parallaxImages.forEach((parallax, index) => {
        //       const scrollPosition = window.scrollY;
          
        //       // Automatically assign speed based on the index (you can adjust the multiplier as needed)
        //       const speed = 0.2; // Example: first element speed = 0.2, second = 0.4, etc.
          
        //       // Apply the parallax effect with the calculated speed
        //       parallax.style.transform = `translate(-50%, ${scrollPosition * speed}px)`;
        //     });
        // });
    })

    return ( 
        <div className="landing-page">
            <Navbar />
            <div className="hero cont">
                <div className="box">
                    <div className="left">
                        {/* <h1>LEARNET</h1> */}
                        <h2><span>Seamlessly Manage Studies, Social Groups, and Resources</span><br /><span>All in One Place</span></h2>
                        {/* <p>Explore and share knowledge</p> */}
                        {/* <p>with a global network of learners. Start Your Journey</p> */}
                        <Link className="icon-button cta" to="/signup" label="Get started" />
                    </div>
                    <div className="right">
                        <img src={heroImage} alt="hero" />
                    </div>
                </div>
            </div>
            <section className="about cont">
                <div className="box">
                    <h2>About Us</h2>
                    <div className="container">
                        <div>
                            Welcome to LearNet, a comprehensive platform designed exclusively for university students to enhance their learning experiences, connect with peers, and manage their academic life seamlessly.
                            Our mission is to bridge the gap between education and technology by providing an integrated platform that supports collaborative learning, personal organization, and community engagement. At LearNet, we believe in empowering students with tools that simplify their academic journey and encourage knowledge sharing.
                        </div>                 
                        <br />
                        <div>We aim to create a dynamic and inclusive digital ecosystem where university students can:</div>
                        <ul>
                            <li>Learn effectively through personalized content and resources.</li>
                            <li>Connect with peers, mentors, and academic communities.</li>
                            <li>Grow academically and professionally with innovative tools.</li>

                        </ul>
                    </div>
                </div>
            </section>
            <section className="features cont">
                <div className="box">
                    <h2>Features</h2>
                    <div className="features-container">
                        <div className="description-box">
                            <div className="img-container" data-speed="0.001">
                                <img src={forum} alt="collaborate" decoding="async"/>
                            </div>
                            <div className="text">
                                <div className="title">Personal Folder</div>
                                <div className="description">A dedicated space for users to organize and access their educational resources.</div>
                            </div>
                        </div>
                        <div className="description-box">
                            <div className="img-container" data-speed="0.15">
                                <img src={events} alt="collaborate" decoding="async"/>
                            </div>
                            <div className="text">
                                <div className="title">Forum</div>
                                <div className="description">A knowledge-sharing hub where users can post questions, answer queries, and discuss topics.</div>
                            </div>
                        </div>
                        <div className="description-box">
                            <div className="img-container" data-speed="0.2">
                                <img src={groupMeeting} alt="collaborate" decoding="async"/>
                            </div>
                            <div className="text">
                                <div className="title">Chat</div>
                                <div className="description">Facilitate seamless communication through various chat modes tailored for individual, group, and community interactions.</div>
                            </div>
                        </div>
                        <div className="description-box">
                            <div className="img-container" data-speed="0.3">
                                <img src={groupMeeting} alt="collaborate" decoding="async"/>
                            </div>
                            <div className="text">
                                <div className="title">Blogs</div>
                                <div className="description">Empower users to share knowledge, insights, and stories through personalized blog posts.</div>
                            </div>
                        </div>
                        <div className="description-box">
                            <div className="img-container" data-speed="0.4">
                                <img src={PersonalFolder} alt="collaborate" decoding="async"/>
                            </div>
                            <div className="text">
                                <div className="title">Personal Schedule</div>
                                <div className="description">An integrated scheduling tool to manage daily activities, events, and deadlines efficiently.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="cont how-it-works">
                <div className="box">
                    <h2>How it works</h2>
                    <div className="container">
                        <div className="step">
                            <div className="title">
                                Step 1: Sign Up and Create Your Account
                            </div>
                            <ul className="content">
                                <li className="sub-step">
                                    Begin your journey by signing up to our system. To ensure a secure and university-focused environment, we require the following details:
                                </li>
                                <li className="sub-step">
                                    Full Name: Your official name for identification purposes.
                                </li>
                                <li className="sub-step">
                                    University Email: Used for verification to confirm you are a university student.
                                </li>
                                <li className="sub-step">
                                    Phone Number: For contact and notification purposes.
                                </li>
                                <li className="sub-step">
                                    University ID Card Number: A unique identifier verified by our moderators.
                                </li>
                                <li className="sub-step">
                                    University ID Card Image: Upload a clear image of your ID for manual verification.
                                </li>
                                <li className="sub-step">
                                    Strong Password: Set a password to ensure account security.
                                </li>
                                <li className="sub-step">
                                    Agreement to Terms: You must read and agree to our Terms of Service and Privacy Policy before proceeding.
                                </li>
                                <li className="sub-step">
                                    Once all the required fields are filled, click the Continue button.
                                </li>
                            </ul>
                        </div>
                        <div className="step">
                            <div className="title">
                                Step 2: Email Verification
                            </div>
                            <ul className="content">
                                <li className="sub-step">
                                    After submitting your details, you will be redirected to the Email Verification Section.
                                </li>
                                <li className="sub-step">
                                    Check your university email inbox for a verification link or code sent by our system.
                                </li>
                                <li className="sub-step">
                                    Complete this step by clicking the link or entering the code to confirm your email address.
                                </li>
                            </ul>
                        </div>
                        <div className="step">
                            <div className="title">
                                Step 3: Access the System
                            </div>
                            <ul className="content">
                                <li className="sub-step">
                                    Upon successful email verification, you will be redirected to the Home Page of the system.
                                </li>
                                <li className="sub-step">
                                    <ul className="content">
                                        <li>From here, you can:</li>
                                        <li className="sub-step">Explore Features like Chat, Personal Folders, Blogs, and Forums.</li>
                                        <li className="sub-step">Manage Your Schedule with notifications and event tools.</li>
                                        <li className="sub-step">Join Communities to connect with fellow university students.</li>
                                    </ul>
                                    
                                    
                                </li>
                            </ul>
                        </div>
                        <div className="call">
                            Start Your Journey Today!
                            By following these simple steps, you’ll unlock a world of features tailored for students to learn, connect, and grow.
                            Sign up now to become part of an engaged learning community!
                        </div>
                    </div>
                </div>
            </section>
            <div class="footer">  
                <div className="footer-body">
                    <div class="footer-section">  
                        <h4>Quick Links</h4>  
                        <ul>  
                        <li><a href="/notes">Notes</a></li>  
                        <li><a href="/files">Files</a></li>  
                        <li><a href="/events">Events</a></li>  
                        <li><a href="/communities">Communities</a></li>  
                        </ul>  
                    </div>  

                    <div class="footer-section">  
                        <h4>Support</h4>  
                        <ul>  
                        <li><a href="/faq">FAQ</a></li>  
                        <li><a href="/contact">Contact Us</a></li>  
                        <li><a href="/copyright-guidelines">Copyright Guidelines</a></li>  
                        </ul>  
                    </div>  

                    <div class="footer-section">  
                        <h4>Legal</h4>  
                        <ul>  
                        <li><a href="/privacy-policy">Privacy Policy</a></li>  
                        <li><a href="/terms">Terms of Service</a></li>  
                        </ul>  
                    </div>  

                    <div class="footer-section">  
                        <h4>Connect With Us</h4>  
                        <div class="social-icons">  
                        <a href="#"><i class="fab fa-facebook"></i></a>  
                        <a href="#"><i class="fab fa-twitter"></i></a>  
                        <a href="#"><i class="fab fa-linkedin"></i></a>  
                        </div>  
                        <p>📧 contact@learnet.com</p>  
                        <p>📞 +1 (555) 123-4567</p>  
                    </div>  
                </div>
                <div class="footer-bottom">  
                    <p>© 2025 Learnet. Designed for students, by students.</p>  
                </div>  
            </div>  
            {/* <footer className="footer cont">
                <div className="box">
                    <Link to="/about-us" label="About us" />
                    <Link to="/privacy-policy" label="Privacy Policy" />
                    <Link to="/terms-of-services" label="Terms of Service" />
                    <Link to="/contact-us" label="Contact Us" />
                    <Link to="/user/home" label="Home" />
                    <Link to="/user/forum" label="Forum" />
                </div>
            </footer> */}
        </div>
    );
}

export default LandingPage;