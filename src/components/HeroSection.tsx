import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="hero academy-hero" aria-labelledby="academy-hero-title">
      <div className="academy-hero__grid">
        <div className="hero-copy academy-hero__copy">
          <p className="eyebrow academy-hero__eyebrow"><span aria-hidden="true" /> NARTSTUDIO CREATIVE ACADEMY</p>
          <h1 className="academy-hero__title" id="academy-hero-title">
            Learn the craft<br />by <em>making.</em>
          </h1>
          <p className="lede academy-hero__lede">
            Turn the ideas in your head into work you can share. Build real skills in illustration, storytelling and design—one practical project at a time.
          </p>
          <div className="hero-actions academy-hero__actions">
            <Link className="button-primary" href="/courses">Explore the courses <span aria-hidden="true">↗</span></Link>
            <Link className="button-secondary" href="/sign-up">Join the Academy</Link>
          </div>
          <ul className="academy-hero__proof" aria-label="Academy highlights">
            <li><span aria-hidden="true">01</span>10 free mini-courses</li>
            <li><span aria-hidden="true">02</span>Learn at your own pace</li>
            <li><span aria-hidden="true">03</span>For every kind of creative</li>
          </ul>
        </div>

        <aside className="academy-hero__visual" aria-label="Your next creative project starts here">
          <div className="academy-hero__visual-top">
            <span>YOUR CREATIVE PRACTICE</span>
            <span>FIELD NOTES · 001</span>
          </div>
          <img src="/academy-art.svg" alt="" />
          <div className="academy-hero__visual-caption">
            <span>START WITH AN IDEA</span>
            <strong>Make it real.</strong>
          </div>
          <span className="academy-hero__orbit" aria-hidden="true">MAKE<br />SOMETHING</span>
        </aside>
      </div>
    </section>
  )
}
