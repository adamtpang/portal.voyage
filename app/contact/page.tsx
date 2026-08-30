import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Contact · portal.voyage",
  description:
    "Contact portal.voyage for product questions, accessibility help, privacy requests, or data corrections through Adam Pangelinan's public channels today.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InfoPage
      marker="CONTACT"
      title="Questions, corrections, and access help."
      intro="portal.voyage does not use a contact form or support account. The project uses the same public contact channel its maintainer already publishes."
    >
      <section>
        <h2>Email</h2>
        <p>
          For a city-data correction, product question, accessibility problem, or privacy
          request, email Adam Pangelinan at
          <a href="mailto:adamtpang@gmail.com?subject=portal.voyage"> adamtpang@gmail.com</a>.
          Include the page or city involved and enough non-sensitive detail to reproduce the
          issue. Do not email passport scans, payment-card details, precise home coordinates,
          or other confidential information.
        </p>
        <p>
          This is a direct email path, not a ticketing system, and the site does not promise a
          response time. Opening the link uses your own email application; portal.voyage does
          not send a message for you.
        </p>
      </section>

      <section>
        <h2>Project and source context</h2>
        <p>
          The scoring code, static datasets, and current implementation are published in the
          <a href="https://github.com/adamtpang/portal.voyage"> public GitHub repository</a>.
          Adam&apos;s existing public profile and other published contact links are available at
          <a href="https://adampang.com"> adampang.com</a>. Those external services apply
          their own terms and privacy practices when you choose to visit them.
        </p>
      </section>

      <section>
        <h2>What this channel cannot do</h2>
        <p>
          Contacting the project does not create legal, immigration, travel-booking, real
          estate, or employment representation. portal.voyage cannot file a visa, book a
          trip, guarantee entry to a country, or confirm that a public figure lives at a
          particular address. For those decisions, use the relevant government, professional,
          or service provider directly.
        </p>
      </section>
    </InfoPage>
  );
}
