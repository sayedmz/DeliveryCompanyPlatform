import React from "react";
import { Link } from "react-router-dom";
import "./css/home.css";

const WHATSAPP_NUMBER = "96170542232";

export default function Home() {
  const whatsappMessage = encodeURIComponent(
    "Hello, I would like to inquire about the delivery service.",
  );

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="south-home" lang="ar" dir="rtl">
      {/* Header */}
      <header className="south-header">
        <div className="south-container south-nav">
          <Link className="south-brand" to="/">
            <span className="south-logo">د</span>

            <span className="south-brand-text">
              <strong>دليفيري الجنوب</strong>
              <small>خدمة توصيل</small>
            </span>
          </Link>

          <nav className="south-auth" aria-label="روابط الحساب">
            <Link className="south-login" to="/login">
              تسجيل الدخول
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="south-hero">
          <div className="south-container south-hero-grid">
            <div className="south-hero-content">
              <span className="south-eyebrow">توصيل سريع في جنوب لبنان</span>

              <h1>
                طلباتك بتوصل
                <span> بسرعة وسعر مناسب.</span>
              </h1>

              <p>
                منستلم طلبك ومنوصّله بأمان ضمن مناطق الجنوب، بخدمة واضحة وتواصل
                مباشر.
              </p>

              <div className="south-hero-actions">
                <a
                  className="south-whatsapp-button"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="whatsapp-icon" aria-hidden="true">
                    ☎
                  </span>
                  تواصل معنا على واتساب
                </a>
              </div>

              <a
                className="south-phone"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              ></a>

              <div className="south-benefits">
                <span>أسعار مناسبة</span>
                <span>توصيل موثوق</span>
                <span>تغطية مناطق الجنوب</span>
              </div>
            </div>

            {/* Visual card */}
            <div className="south-visual" aria-label="خدمة توصيل في جنوب لبنان">
              <div className="delivery-card">
                <div className="delivery-card-top">
                  <span className="delivery-status">جاري التوصيل</span>

                  <span className="delivery-number">#70542232</span>
                </div>

                <div className="delivery-package">
                  <span aria-hidden="true">📦</span>
                </div>

                <div className="delivery-route">
                  <div className="route-point">
                    <span className="route-dot start" />

                    <div>
                      <small>الاستلام</small>
                    </div>
                  </div>

                  <span className="route-line" />

                  <div className="route-point">
                    <span className="route-dot end" />

                    <div>
                      <small>التوصيل</small>
                    </div>
                  </div>
                </div>

                <div className="delivery-footer">
                  <span>توصيل آمن وسريع</span>
                  <strong>دليفيري الجنوب</strong>
                </div>
              </div>

              <div className="visual-circle circle-one" />
              <div className="visual-circle circle-two" />
            </div>
          </div>
        </section>

        {/* Short services */}
        <section className="south-services">
          <div className="south-container">
            <div className="south-section-heading">
              <span>كيف منشتغل؟</span>
              <h2>ثلاث خطوات وطلبك بيوصل</h2>
            </div>

            <div className="south-services-grid">
              <article className="south-service-card">
                <span className="service-number">01</span>
                <h3>تواصل معنا</h3>
                <p>ابعتلنا تفاصيل الطلب ومكان الاستلام.</p>
              </article>

              <article className="south-service-card">
                <span className="service-number">02</span>
                <h3>منستلم الطلب</h3>
                <p>السائق بيستلم الطلب من المكان المحدد.</p>
              </article>

              <article className="south-service-card">
                <span className="service-number">03</span>
                <h3>منوصّله بأمان</h3>
                <p>منوصل الطلب ونتأكد من إتمام التسليم.</p>
              </article>
            </div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="south-contact">
          <div className="south-container">
            <div className="south-contact-box">
              <div>
                <span className="contact-label">جاهز ترسل طلبك؟</span>

                <h2>نحنا جاهزين نوصلّه.</h2>
              </div>

              <a
                className="south-whatsapp-button contact-button"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="south-footer">
        <div className="south-container south-footer-content">
          <div className="south-footer-brand">
            <span className="south-logo small">د</span>

            <span>
              <strong>دليفيري الجنوب</strong>
              <small>طلباتك بتوصل معنا</small>
            </span>
          </div>

          <div className="south-footer-links">
            <Link to="/login">تسجيل الدخول</Link>
          </div>

          <p>© {new Date().getFullYear()} دليفيري الجنوب</p>
        </div>
      </footer>
    </div>
  );
}
