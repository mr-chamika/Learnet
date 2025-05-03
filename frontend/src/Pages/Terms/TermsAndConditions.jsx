import Navbar from "../../Components/Navbar/Navbar";
import Link from "../../Router/Link";
import "./TermsAndServices.css"

const TermsAndServices = () => {
  return (
    <div className="terms-privacy">
      <Navbar />
      <div class="container">
          <header>
              <h1>Terms of Service</h1>
              <p>Effective from: February 17, 2025</p>
          </header>
          <section>
              <h2>1. Introduction</h2>
              <p>Welcome to LearNet! These Terms of Service ("Terms") govern your use of our platform, which includes features such as Feed, Friends, Chat (Private, Group, Communities), Blog, Forum, and Schedule (Tasks, Events). By registering, accessing, or using our platform, you agree to comply with and be bound by these Terms. If you are using the platform on behalf of an organization, you affirm that you have the authority to bind that organization to these Terms. If you do not agree to these Terms, please refrain from using our services.</p>
          </section>
          <section>
              <h2>2. User Accounts</h2>
              <ul>
                  <li><strong>Registration:</strong> To access certain features, you must create an account by providing accurate and complete information.</li>
                  <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</li>
              </ul>
          </section>
          <section>
              <h2>3. User Conduct</h2>
              <p>You agree to use LearNet responsibly and not to:</p>
              <ul>
                  <li>Post or share content that is unlawful, harmful, or offensive.</li>
                  <li>Harass, threaten, or impersonate others.</li>
                  <li>Engage in activities that could harm or disrupt the platform.</li>
              </ul>
          </section>
          <section>
              <h2>4. Content Ownership and Licenses</h2>
              <ul>
                  <li><strong>Your Content:</strong> You retain ownership of content you create and share. By posting, you grant LearNet a non-exclusive, worldwide license to use, display, and distribute your content within the platform.</li>
                  <li><strong>LearNet Content:</strong> Content provided by LearNet is protected by intellectual property laws. You may not use it without permission.</li>
              </ul>
          </section>
          <section>
              <h2>5. Privacy</h2>
              <p>Your privacy is important to us. Our <Link to="/privacy-policy">Privacy Policy</Link> explains how we collect, use, and protect your information. By using LearNet, you consent to our data practices.</p>
          </section>
          <section>
              <h2>6. Termination</h2>
              <p>We reserve the right to suspend or terminate your account if you violate these Terms or engage in conduct that harms LearNet or its users.</p>
          </section>
          <section>
              <h2>7. Disclaimers and Limitation of Liability</h2>
              <p>LearNet is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.</p>
          </section>
          <section>
              <h2>8. Changes to Terms</h2>
              <p>We may update these Terms periodically. We will notify you of significant changes, and your continued use of LearNet constitutes acceptance of the updated Terms.</p>
          </section>
          <section>
              <h2>9. Contact Us</h2>
              <p>For questions or concerns about these Terms, please contact us at <a className="link" href="mailto:support@learnet.com">support@learnet.com</a>.</p>
          </section>
      </div>
    </div>
  );
};

export default TermsAndServices;


{/* <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h1>Terms and Conditions of Service</h1>
      <p><strong>Effective Date:</strong> [Insert Date]</p>
      <p><strong>Last Updated:</strong> [Insert Date]</p>
      <p>
        Welcome to [Your System Name]! By accessing or using our platform, you
        agree to comply with and be bound by these Terms and Conditions of
        Service. If you do not agree with these terms, please do not use our
        services.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By registering, accessing, or using our platform, you agree to these
        Terms and Conditions. If you are using the platform on behalf of an
        organization, you affirm that you have the authority to bind that
        organization to these terms.
      </p>

      <h2>2. Description of Services</h2>
      <p>
        Our platform provides functionalities for creating, managing, and
        sharing notes, videos, and links. Features include folder hierarchies,
        collaboration options, and educational tools. Additional features may
        be added or modified at our discretion.
      </p>

      <h2>3. User Responsibilities</h2>
      <ul>
        <li>
          <strong>Account Security:</strong> You are responsible for maintaining
          the confidentiality of your account and password.
        </li>
        <li>
          <strong>Prohibited Actions:</strong> You agree not to use our platform
          for illegal activities, upload malicious software, or infringe on the
          rights of others.
        </li>
        <li>
          <strong>Content Ownership:</strong> You retain ownership of your
          content but grant us a non-exclusive license to host and display it
          for platform functionality.
        </li>
      </ul>

      <h2>4. Fees and Payments</h2>
      <p>
        Certain features may require payment. By opting for such features, you
        agree to pay the applicable fees. All payments are non-refundable
        unless explicitly stated.
      </p>

      <h2>5. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your account at any time
        for violations of these terms.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        All rights, titles, and interests in our platform, including trademarks,
        logos, and software, belong to us or our licensors.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        We are not liable for indirect, incidental, or consequential damages
        arising from your use of our services.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We may update these terms at any time. We will notify users of
        significant changes.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These terms are governed by the laws of [Your Country/State].
      </p>
    </div> */}