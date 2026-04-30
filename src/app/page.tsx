import { CtaStrip } from "@/components/site/cta-strip";
import { FeaturedGrid } from "@/components/site/featured-grid";
import { Hero } from "@/components/site/hero";
import { IntentBands } from "@/components/site/intent-bands";
import { Reviews } from "@/components/site/reviews";
import { TradeInBand } from "@/components/site/trade-in-band";
import { WhyPeel } from "@/components/site/why-peel";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedGrid />
      <WhyPeel />
      <TradeInBand />
      <IntentBands />
      <Reviews />
      <CtaStrip />
    </>
  );
}
