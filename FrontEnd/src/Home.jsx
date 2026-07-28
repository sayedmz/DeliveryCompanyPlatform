import React from "react";
import { Link } from "react-router-dom";
import "./css/home.css";

export default function Home() {
  return (
    <div className="landing delivery" lang="en" dir="ltr">
      {/* Header */}
      <header className="landing__header">
        <div className="container header__bar">
          <div className="brand">
            <div className="logo" aria-hidden="true" />
            <span className="brand__name">SwiftDrop</span>
          </div>
          <nav className="nav">
            <a className="nav__link" href="#services">
              Services
            </a>
            <a className="nav__link" href="#pricing">
              Pricing
            </a>
            <a className="nav__link" href="#coverage">
              Coverage
            </a>
            <a className="nav__link" href="#contact">
              Contact
            </a>
            <Link className="nav__ghost" to="/login">
              Sign in
            </Link>
            <Link className="nav__cta" to="/register">
              Create account
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__text fade-in">
            <h1>
              Deliver anything. <span className="accent">Anywhere.</span> Right
              on time.
            </h1>
            <p>
              SwiftDrop connects customers and couriers in minutes. Track live,
              pay securely, and get your orders delivered fast—with care.
            </p>
            <div className="hero__cta">
              <Link className="btn btn--primary" to="">
                Start free
              </Link>
              <Link className="btn btn--ghost" to="">
                I already have an account
              </Link>
            </div>
            <div className="hero__meta">
              No credit card needed • Cancel anytime
            </div>
            <div className="hero__badges">
              <span>ETA updates</span>
              <span>Live tracking</span>
              <span>Upfront pricing</span>
            </div>
          </div>
          <div className="hero__art float-up" aria-hidden="true">
            <div className="art">
              <div className="parcel" />
              <div className="pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Services / Features */}
      <section id="services" className="features">
        <div className="container">
          <h2>Why choose SwiftDrop?</h2>
          <div className="features__grid">
            <div className="card lift">
              <div className="card__icon">⚡</div>
              <h3>Fast pickups</h3>
              <p>
                Pickups in under 30 minutes in core zones during peak hours.
              </p>
            </div>
            <div className="card lift">
              <div className="card__icon">🛰️</div>
              <h3>Live tracking</h3>
              <p>
                Follow your courier in real time and share the link with
                recipients.
              </p>
            </div>
            <div className="card lift">
              <div className="card__icon">🔒</div>
              <h3>Secure & insured</h3>
              <p>
                Every delivery is insured and handled with verified couriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing (reuses .features styles) */}
      <section id="pricing" className="features">
        <div className="container">
          <h2>Simple pricing</h2>
          <div className="features__grid">
            <div className="card lift">
              <h3>On-Demand</h3>
              <p>From $5 + distance</p>
              <p>Pay per delivery with upfront ETAs.</p>
              <Link className="btn btn--primary" to="">
                Start now
              </Link>
            </div>
            <div className="card lift">
              <h3>Business</h3>
              <p>Custom rates</p>
              <p>Volume discounts and scheduled routes.</p>
              <Link className="btn btn--primary" to="">
                Talk to sales
              </Link>
            </div>
            <div className="card lift">
              <h3>Enterprise</h3>
              <p>SLAs & support</p>
              <p>Priority support and advanced reporting.</p>
              <Link className="btn btn--primary" to="">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Split */}
      <section className="split">
        <div className="container split__grid">
          <div className="split__media" aria-hidden="true">
            <div className="screenshot shimmer" />
          </div>
          <div className="split__text">
            <h2>Built for businesses, loved by people</h2>
            <p>
              Whether you ship once a week or hundreds of orders a day,
              SwiftDrop scales with you. Set delivery windows, manage addresses,
              and automate notifications.
            </p>
            <ul className="list">
              <li>Same-day and scheduled delivery</li>
              <li>Multi-stop routes with optimized ETAs</li>
              <li>Proof of delivery with photo & signature</li>
            </ul>
            <Link className="btn btn--primary" to="">
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="social">
        <div className="container">
          <h2>Trusted by thousands</h2>
          <div className="testimonials">
            <blockquote className="quote lift">
              <p>“Reliable and quick—our customers love the live tracking.”</p>
              <footer>— Ranya, bakery owner</footer>
            </blockquote>
            <blockquote className="quote lift">
              <p>“We slashed delivery times without increasing costs.”</p>
              <footer>— Tarek, pharmacy manager</footer>
            </blockquote>
            <blockquote className="quote lift">
              <p>“Great support and accurate ETAs, even on busy days.”</p>
              <footer>— Lina, flower shop</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Coverage (reuses split look to match CSS without new classes) */}
      <section id="coverage" className="split">
        <div className="container split__grid">
          <div className="split__text">
            <h2>Coverage areas</h2>
            <p>
              We operate across major city districts with continuous expansion.
              Enter your pickup and drop-off to see availability and ETAs.
            </p>
            <ul className="list">
              <li>Core zones: under 30-minute pickups</li>
              <li>Suburbs: scheduled same-day slots</li>
              <li>Nationwide partners for intercity shipping</li>
            </ul>
          </div>
          <div className="split__media" aria-hidden="true">
            <div className="screenshot" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="logo small" aria-hidden="true" />
            <span>SwiftDrop</span>
          </div>
          <div className="footer__links">
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#coverage">Coverage</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <div className="footer__cta">
            <Link className="btn btn--primary" to="/register">
              Create free account
            </Link>
          </div>
        </div>
        <div className="subfooter">
          © {new Date().getFullYear()} SwiftDrop Inc.
        </div>
      </footer>
    </div>
  );
}
