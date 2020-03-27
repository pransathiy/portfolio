import React, { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { Helmet } from "react-helmet-async";
import Intro from "pages/Intro";
import ProjectItem from "pages/ProjectItem";
import Profile from "pages/Profile";
import Footer from "components/Footer";
import { usePrefersReducedMotion, useRouteTransition } from "hooks";
import netflixLivePNG from "assets/netflix-live.png";
import netflixLiveLargePNG from "assets/netflix-live-large.png";
import sprProjectPlaceholder from "assets/spr-project-placeholder.png";
import ttcPNG from "assets/ttc.png";
import ttcLargePNG from "assets/ttc-large.png";
import gamestackLoginPlaceholder from "assets/gamestack-login-placeholder.jpg";
import ttcMainPNG from "assets/ttc-main.png";
import ttcMainLargePNG from "assets/ttc-main-large.png";
import gamestackListPlaceholder from "assets/gamestack-list-placeholder.jpg";
import sliceProject from "assets/slice-project.png";
import sliceProjectLarge from "assets/slice-project-large.png";
import sliceProjectPlaceholder from "assets/slice-project-placeholder.png";
import { useLocation } from "react-router-dom";

const disciplines = ["Photographer", "Writer"];

export default function Home() {
  const { status } = useRouteTransition();
  const { hash, state } = useLocation();
  const initHash = useRef(true);
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const details = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const revealSections = [
      intro,
      projectOne,
      projectTwo,
      projectThree,
      details
    ];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: "-100% 0px 0px 0px" }
    );

    revealSections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return function cleanUp() {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  useEffect(() => {
    const hasEntered = status === "entered";
    const supportsNativeSmoothScroll =
      "scrollBehavior" in document.documentElement.style;
    let scrollObserver;
    let scrollTimeout;

    const handleHashchange = (hash, scroll) => {
      clearTimeout(scrollTimeout);
      const hashSections = [intro, projectOne, details];
      const hashString = hash.replace("#", "");
      const element = hashSections.filter(
        item => item.current.id === hashString
      )[0];
      if (!element) return;
      const behavior = scroll && !prefersReducedMotion ? "smooth" : "instant";
      const top = element.current.offsetTop;

      scrollObserver = new IntersectionObserver(
        (entries, observer) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            scrollTimeout = setTimeout(
              () => {
                element.current.focus();
              },
              prefersReducedMotion ? 0 : 400
            );
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: "-20% 0px -20% 0px" }
      );

      scrollObserver.observe(element.current);

      if (supportsNativeSmoothScroll) {
        window.scroll({
          top,
          left: 0,
          behavior
        });
      } else {
        window.scrollTo(0, top);
      }
    };

    if (hash && initHash.current && hasEntered) {
      handleHashchange(hash, false);
      initHash.current = false;
    } else if (!hash && initHash.current && hasEntered) {
      window.scrollTo(0, 0);
      initHash.current = false;
    } else if (hasEntered) {
      handleHashchange(hash, true);
    }

    return () => {
      clearTimeout(scrollTimeout);
      if (scrollObserver) {
        scrollObserver.disconnect();
      }
    };
  }, [hash, state, prefersReducedMotion, status]);

  return (
    <Fragment>
      <Helmet
        title="Pran Sathiy | Designer"
        meta={[
          {
            name: "description",
            content:
              "Portfolio of Pran Sathiy – a digital designer working on web &amp; mobile apps with a focus on motion and user experience design."
          }
        ]}
      />
      <Intro
        id="intro"
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectItem
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index="01"
        title="Netflix LIVE"
        description="Netflix LIVE is a brand new feature that will allow the existing user base enjoy live streaming of Netflix Originals, TV shows, movies, events, all integrated onto the same platform you know and trust."
        buttonText="Checkout Netflix LIVE"
        buttonTo="/projects/netflix-live"
        imageSrc={useMemo(
          () => [`${netflixLivePNG} 980w, ${netflixLiveLargePNG} 1376w`],
          []
        )}
        imageAlt={useMemo(() => ["Netflix LIVE prototype"], [])}
        imagePlaceholder={useMemo(() => [sprProjectPlaceholder], [])}
        imageType="laptop"
      />
      <ProjectItem
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index="02"
        title="TTC Route"
        description="A better way to plan your commute."
        buttonText="Checkout TTC Route"
        buttonTo="/projects/ttc-route"
        imageSrc={useMemo(
          () => [
            `${ttcPNG} 254w, ${ttcLargePNG} 508w`,
            `${ttcMainPNG} 254w, ${ttcMainLargePNG} 508w`
          ],
          []
        )}
        imageAlt={useMemo(
          () => ["App login screen", "List of games being tracked"],
          []
        )}
        imagePlaceholder={useMemo(
          () => [gamestackLoginPlaceholder, gamestackListPlaceholder],
          []
        )}
        imageType="phone"
      />
      <ProjectItem
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index="03"
        title="Biomedical image collaboration"
        description="Increasing the amount of collaboration in Slice, an app for biomedical imaging"
        buttonText="View Project"
        buttonTo="/projects/slice"
        imageSrc={useMemo(
          () => [`${sliceProject} 980w, ${sliceProjectLarge} 1376w`],
          []
        )}
        imageAlt={useMemo(
          () => ["Annotating a biomedical image in the Slice app"],
          []
        )}
        imagePlaceholder={useMemo(() => [sliceProjectPlaceholder], [])}
        imageType="laptop"
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </Fragment>
  );
}
