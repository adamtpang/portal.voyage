import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Privacy · portal.voyage",
  description:
    "How portal.voyage handles location permission, in-browser inputs, Vercel Analytics, Unsplash images, Stripe checkout, storage, cookies, and links today.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      marker="PRIVACY"
      title="Your build stays in your browser."
      intro="portal.voyage is a static, public decision tool without user accounts or an application database. Most choices you make in the tool exist only in the current browser tab. This page describes the actual exceptions and third parties in the current product."
    >
      <section>
        <h2>Inputs and storage</h2>
        <p>
          Your budget, career field, weights, hard constraints, admired people, custom people,
          comparison list, and pasted pokedex.life export are held in temporary browser memory.
          The portal application does not send those values to its own server and does not save
          them in a portal.voyage database. Reloading or closing the page clears that working
          state. There is no account, authentication profile, server-side history, or booking
          record in this repository.
        </p>
        <p>
          The page reads an optional <code>theme</code> preference from browser local storage
          and otherwise defaults to dark mode. The current interface does not write that
          preference. The initial portal response does not set an application cookie, and the
          analytics integration is not configured to enable its optional cookie mode.
        </p>
      </section>

      <section>
        <h2>Location and globe behavior</h2>
        <p>
          portal.voyage asks the browser for location only after you activate “Find me.” If you
          allow it, the browser supplies latitude and longitude to code running in the page.
          That code compares the coordinates with the 30 static city coordinates and displays
          the nearest tracked city within 300 kilometres. The portal application does not send
          those coordinates to its server, save them, or attach them to analytics events. You
          can deny the permission and continue using every manual ranking and globe control.
        </p>
        <p>
          The interactive globe is rendered with Three.js from the bundled city data. It does
          not request map tiles, directions, or place data from Google Maps, Mapbox, or another
          map provider.
        </p>
      </section>

      <section>
        <h2>Hosting and analytics</h2>
        <p>
          Vercel hosts portal.voyage. Like other web hosts, Vercel can process request metadata
          such as an IP address, user agent, requested path, referrer, and timestamp in network
          or security logs. The site also loads Vercel Web Analytics. Its current script sends
          cookie-less pageview data to a same-origin <code>/_vercel/insights</code> endpoint;
          the payload includes the viewed URL and timestamp and can include a referrer. The
          application does not define custom analytics events for budgets, people, filters, or
          location coordinates.
        </p>
      </section>

      <section>
        <h2>Images and optional third-party actions</h2>
        <ul>
          <li>
            City photographs load directly from <strong>images.unsplash.com</strong>. Unsplash
            therefore receives the ordinary request information needed to return each image.
            Photo-credit links also lead to Unsplash when you choose them.
          </li>
          <li>
            “Fetch live from pokedex.life” makes a browser request to the public
            <code> pokedex.life/api/people</code> endpoint only after you activate that button.
            The portal sends no account credential or local ranking input with that request.
          </li>
          <li>
            The founding-license link opens a Stripe-hosted Payment Link. If you continue there,
            Stripe—not the portal application—collects and processes checkout, contact, and
            payment information under Stripe&apos;s own terms and privacy practices.
          </li>
          <li>
            Links to Adam Pangelinan&apos;s site, email application, GitHub, and other external
            destinations transfer you away from portal.voyage and are governed by those
            services.
          </li>
        </ul>
      </section>

      <section>
        <h2>Choices and questions</h2>
        <p>
          You can use the ranking without location permission, admired-person entries, a live
          import, an account, or a purchase. Browser controls can clear local site data and
          restrict analytics or image requests. If you have a privacy question or want to ask
          what operator-accessible records can be located or removed, use the
          <Link href="/contact"> contact page</Link>. Do not include payment-card data or other
          sensitive documents in that request.
        </p>
      </section>
    </InfoPage>
  );
}
