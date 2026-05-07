export function WhyCool() {
  return (
    <section className="relative z-[2]">
      <div
        className="tilt-left max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-sky-deep text-stroke-ink mb-5 text-center"
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            transform: "rotate(-1deg)",
          }}
        >
          Why Harry is Cool
        </h2>
        <p className="text-center" style={{ fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)" }}>
          Harry rides his bike <em>so fast</em> the wind has trouble keeping up.
          He can shoot hoops, throw a spiral, and hit a baseball. He&apos;ll race you
          to the deep end and beat you. Ask him about his favorite team — but only
          if you have a few minutes, because he&apos;s got a lot to say. 💙
        </p>
      </div>
    </section>
  );
}
