import Nav from "@/components/layout/Nav";
import Scene from "@/components/layout/Scene";
import TunnelIntro from "@/components/sections/Intro/TunnelIntro";
import Hero from "@/components/sections/Hero/Hero";
import About from "@/components/sections/About/About";
import Journey from "@/components/sections/Journey/LightJourney";
import DesignStack from "@/components/sections/Stack/DesignStack";
import Work from "@/components/sections/Work/Work";
import Experience from "@/components/sections/Experience/Experience";
import Certifications from "@/components/sections/Certifications/Certifications";
import Connect from "@/components/sections/Connect/Connect";

/*
 * THE STACK.
 *
 * Every frame is a Scene: a runway that owns scroll distance, holding a
 * sticky full-screen stage. Scenes are painted in ascending order, so the
 * next one rises from the bottom of the viewport and COVERS the one before
 * it — the previous frame stays put behind it rather than scrolling away.
 *
 * Scene sequence:
 *   00 Intro (Three.js Tunnel) -> Home (Hero) -> About -> Journey ->
 *   Design Stack -> Work -> Experience -> Credentials -> Connect
 *
 * Connect is last and deliberately NOT a Scene: it is taller than the
 * viewport and ends the page, rising over credentials directly, then flowing
 * naturally into the footer.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Scene order={1} runway={2.3} id="intro" keepOnMobile>
          <TunnelIntro />
        </Scene>

        <Scene order={2} id="hero">
          <Hero />
        </Scene>

        <Scene order={3} runway={1.5} id="about">
          <About />
        </Scene>

        <Scene order={4} runway={4} id="journey" keepOnMobile>
          <Journey />
        </Scene>

        <Scene order={5} id="stack">
          <DesignStack />
        </Scene>

        <Scene order={6} runway={5} id="work">
          <Work />
        </Scene>

        <Scene order={7} runway={3} id="experience">
          <Experience />
        </Scene>

        <Scene order={8} runway={2.5} id="credentials">
          <Certifications />
        </Scene>

        {/* the closing frame rises over credentials, then flows to the footer */}
        <div className="finalFrame">
          <Connect />
        </div>
      </main>
    </>
  );
}
