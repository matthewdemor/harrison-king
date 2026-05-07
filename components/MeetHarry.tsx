export function MeetHarry() {
  return (
    <section className="relative z-[2]">
      <div
        className="tilt-left max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-red text-stroke-ink mb-5 text-center"
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            transform: "rotate(-1deg)",
          }}
        >
          Meet Harry
        </h2>
        <p
          className="text-center mb-6"
          style={{ fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)" }}
        >
          Harry is six. Harry is awesome. He goes <strong>fast</strong> on his bike,
          does <strong>tricks</strong> that would scare most adults, and could probably
          out-swim a fish if you challenged him to it.
        </p>
        <div
          className="text-white max-w-[600px] mx-auto text-center font-display p-5 border-[4px] border-ink rounded-[20px]"
          style={{
            background:
              "linear-gradient(90deg, #002E5D 0%, #002E5D 50%, white 50%, white 100%)",
            transform: "rotate(-1deg)",
            boxShadow: "var(--shadow-ink-md)",
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            textShadow: "2px 2px 0 #2D3142",
          }}
        >
          GO{" "}
          <span style={{ color: "#002E5D", textShadow: "2px 2px 0 white" }}>
            COUGARS!
          </span>{" "}
          🏈
        </div>
      </div>
    </section>
  );
}
