import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "About · portal.voyage",
  description:
    "About portal.voyage: how 30 cities are ranked across cost, career, people, and hard constraints, who maintains it, and where its curated data ends in practice.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InfoPage
      marker="ABOUT THE PROJECT"
      title="A calmer way to choose where to live."
      intro="portal.voyage is an independent decision-support project for people comparing where on Earth they could build a life. It turns a sprawling location choice into a ranking you can inspect, challenge, and reweight."
    >
      <section>
        <h2>What the tool does</h2>
        <p>
          The public decision tool ranks 30 cities across cost of living, career upside, and
          people or Schelling-point fit. A visitor can set a monthly budget, choose a field,
          add people they admire, move the three weights, and apply hard filters for visa
          openness, working language, climate, and time zone. Those inputs re-rank the same
          curated city dataset in the browser; they are not a promise that any destination
          will suit every person.
        </p>
        <p>
          The globe is an interface to that city data, not a live map service. The optional
          location action finds the nearest tracked city. City detail and comparison views
          explain the score so the result can start a real investigation rather than end one.
        </p>
      </section>

      <section>
        <h2>Who maintains it</h2>
        <p>
          portal.voyage is built and maintained by Adam Pangelinan, who also publishes as
          Adam Pang. The project&apos;s public source and scoring model are available in the
          <a href="https://github.com/adamtpang/portal.voyage"> portal.voyage GitHub repository</a>.
          The site is hosted on Vercel and has no application database or account system.
        </p>
      </section>

      <section>
        <h2>Where its authority ends</h2>
        <p>
          Costs, career strengths, visa openness, city scenes, and notable-person locations
          are curated and approximate. They can become incomplete or out of date. People
          marked unverified are public-reporting signals, never confirmed addresses, and
          proximity to a scene does not create access to it. portal.voyage is not a booking
          service, immigration adviser, job marketplace, or guarantee of relocation outcomes.
        </p>
        <p>
          Use the ranking to narrow the world, then verify current visa rules, costs, safety,
          work conditions, and community fit with authoritative sources and an in-person
          sampling trip before making a consequential move.
        </p>
      </section>
    </InfoPage>
  );
}
