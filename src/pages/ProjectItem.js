import React, { Fragment, memo } from 'react';
import styled, { css, useTheme } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { rgba, sectionPadding } from 'utils/style';
import { RouterButton, LinkButton } from 'components/Button';
import ProgressiveImage from 'components/ProgressiveImage';
import Divider from 'components/Divider';
import { useWindowSize } from 'hooks';
import Svg from 'components/Svg';
import phone from 'assets/phone.png';
import phoneLarge from 'assets/phone-large.png';
import phonePlaceholder from 'assets/phone-placeholder.png';
import { reflow } from 'utils/transition';

function ProjectItem(props) {
  const {
    id, visible, sectionRef, index, title, description, imageSrc, imageAlt, imageType,
    imagePlaceholder, buttonText, buttonLink, buttonTo, alternate, ...rest
  } = props;

  const { width } = useWindowSize();
  const { mobile, tablet, desktop } = useTheme();
  const titleId = `${id}-title`;
  const isMobile = width <= tablet;

  const renderDetails = (status) => (
    <ProjectItemDetails>
      <ProjectItemIndex aria-hidden>
        <Divider
          notchWidth="64px"
          notchHeight="8px"
          collapsed={status !== 'entered'}
          collapseDelay={1000}
        />
        <ProjectItemIndexNumber status={status}>{index}</ProjectItemIndexNumber>
      </ProjectItemIndex>
      <ProjectItemTitle id={titleId} status={status}>{title}</ProjectItemTitle>
      <ProjectItemDescription status={status}>{description}</ProjectItemDescription>
      <ProjectItemButton status={status}>
        {buttonLink &&
          <LinkButton
            iconHoverShift
            href={buttonLink}
            target="_blank"
            iconRight="arrowRight"
          >
            {buttonText}
          </LinkButton>
        }
        {buttonTo &&
          <RouterButton
            iconHoverShift
            to={buttonTo}
            iconRight="arrowRight"
          >
            {buttonText}
          </RouterButton>
        }
      </ProjectItemButton>
    </ProjectItemDetails>
  );

  const renderPreview = (status) => (
    <ProjectItemPreview>
      {imageType === 'laptop' &&
        <ProjectItemPreviewContentLaptop>
          <ProjectItemImageLaptop
            status={status}
            srcSet={imageSrc[0]}
            alt={imageAlt[0]}
            placeholder={imagePlaceholder[0]}
            sizes={`(max-width: ${mobile}px) 300px,(max-width: ${tablet}px) 420px,(max-width: ${desktop}px) 860px, 900px`}
          />
          <ProjectItemImageLaptopSvg status={status} icon="projects" />
        </ProjectItemPreviewContentLaptop>
      }
      {imageType === 'phone' &&
        <ProjectItemPreviewContentPhone>
          <ProjectItemPhoneImageSvg status={status} icon="projects" />
          {imageSrc && imageSrc.map((src, index) => (
            <ProjectItemPhone first={index === 0} status={status} key={`img_${index}`}>
              <ProjectItemPhoneFrame
                srcSet={`${phone} 414w, ${phoneLarge} 828w`}
                sizes={`(max-width: ${tablet}px) 248px, 414px`}
                alt=""
                role="presentation"
                placeholder={phonePlaceholder}
              />
              <ProjectItemPhoneImage
                srcSet={imageSrc[index]}
                alt={imageAlt[index]}
                placeholder={imagePlaceholder[index]}
                sizes={`(max-width: ${tablet}px) 152px, 254px`}
              />
            </ProjectItemPhone>
          ))}
        </ProjectItemPreviewContentPhone>
      }
    </ProjectItemPreview>
  );

  return (
    <ProjectItemSection
      aria-labelledby={titleId}
      index={index}
      ref={sectionRef}
      id={id}
      alternate={alternate}
      tabIndex={-1}
      {...rest}
    >
      <ProjectItemContent>
        <Transition
          in={visible}
          timeout={0}
          onEnter={reflow}
        >
          {status => (
            <Fragment>
              {!alternate && !isMobile &&
                <Fragment>
                  {renderDetails(status)}
                  {renderPreview(status)}
                </Fragment>
              }
              {(alternate || isMobile) &&
                <Fragment>
                  {renderPreview(status)}
                  {renderDetails(status)}
                </Fragment>
              }
            </Fragment>
          )}
        </Transition>
      </ProjectItemContent>
    </ProjectItemSection>
  );
};

const ProjectItemContent = styled.div`
  width: 100%;
  max-width: ${props => props.theme.maxWidthLaptop}px;
  align-items: center;
  justify-content: center;
  display: grid;
  grid-template-columns: 43% 55%;
  grid-column-gap: 2%;

  @media (min-width: ${props => props.theme.desktop}px) {
    max-width: ${props => props.theme.maxWidthDesktop}px;
  }

  @media (max-width: 1245px) {
    grid-template-columns: 50% 50%;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-template-columns: 100%;
    flex-direction: column-reverse;
    height: auto;
  }
`;

const ProjectItemDetails = styled.div`
  flex: 0 0 410px;
  max-width: 410px;
  z-index: 1;
  position: relative;

  @media (max-width: ${props => props.theme.tablet}px) {
    flex: 0 0 auto;
    max-width: 410px;
    grid-row: 2;
    grid-column: 1;
    justify-self: center;
  }
`;

const ProjectItemSection = styled.section`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  padding-right: 80px;
  padding-bottom: 40px;
  padding-left: 220px;
  margin-top: ${props => props.index === '01' ? '0' : '120px'};
  margin-bottom: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  ${sectionPadding}

  @media (min-width: ${props => props.theme.desktop}px) {
    margin-bottom: 0;
    margin-top: 0;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    height: auto;
    margin-top: ${props => props.index === '01' ? '0' : '60px'};
    margin-bottom: 60px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    padding-bottom: 100px;
    margin-bottom: 0;
    overflow-x: hidden;
  }

  ${props => props.alternate && css`
    ${ProjectItemContent} {
      grid-template-columns: 55% 40%;

      @media (max-width: ${props => props.theme.tablet}px) {
        grid-template-columns: 100%;
      }
    }
  `}
`;

const ProjectItemPreview = styled.div`
  flex: 0 1 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-self: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const ProjectItemPreviewContentPhone = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
`;

const ProjectItemPreviewContentLaptop = styled.div`
  position: relative;

  @media (max-width: ${props => props.theme.tablet}px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ProjectItemIndex = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 90px 1fr;
  grid-gap: 12px;
  align-items: center;
  margin-bottom: 32px;
`;

const ProjectItemIndexNumber = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colorPrimary};
  transform: translateX(-10px);
  opacity: 0;
  transition-property: transform, opacity;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
  transition-duration: 0.4s;
  transition-delay: 1.3s;

  ${props => props.status === 'entered' && css`
    transform: translateX(0);
    opacity: 1;
  `}
`;

const ProjectItemTitle = styled.h2`
  font-size: 42px;
  font-weight: 500;
  line-height: 1.2;
  margin: 0;
  margin-bottom: 16px;
  padding: 0;
  color: ${props => props.theme.colorTitle};
  transition-property: transform, opacity;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
  transition-duration: 0.8s;
  transition-delay: 0.4s;
  transform: translate3d(0, 40px, 0);
  opacity: 0;

  ${props => props.status === 'entered' && css`
    transform: translate3d(0, 0, 0);
    opacity: 1;
  `}

  @media (max-width: 1245px) {
    font-size: 36px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 28px;
  }
`;

const ProjectItemDescription = styled.p`
  font-size: 18px;
  line-height: 1.4;
  color: ${props => rgba(props.theme.colorText, 0.8)};
  font-weight: ${props => props.theme.id === 'light' ? 500 : 300};
  margin-bottom: 38px;
  transition-property: transform, opacity;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
  transition-duration: 0.8s;
  transition-delay: 0.6s;
  transform: translate3d(0, 40px, 0);
  opacity: 0;

  ${props => props.status === 'entered' && css`
    transform: translate3d(0, 0, 0);
    opacity: 1;
  `}

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 16px;
  }
`;

const ProjectItemButton = styled.div`
  transition-property: transform, opacity;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
  transition-duration: 0.8s;
  transition-delay: 0.8s;
  transform: translate3d(0, 40px, 0);
  opacity: 0;

  ${props => props.status === 'entered' && css`
    transform: translate3d(0, 0, 0);
    opacity: 1;
  `}
`;

const ProjectItemImageLaptop = styled(ProgressiveImage)`
  width: 862px;
  height: 531px;
  transition-property: transform, opacity;
  transition-duration: 1s;
  transition-delay: 0.4s;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
  transform: translate3d(40px, 0, 0);
  opacity: 0;
  position: relative;
  right: -140px;

  ${props => props.status === 'entered' && css`
    transform: translate3d(0, 0, 0);
    opacity: 1;
  `}

  ${props => props.theme.id === 'light' && css`
    z-index: 1;
  `}

  @media(min-width: 1440px) {
    width: 880px;
    height: 542px;
  }

  @media(max-width: 1245px) {
    width: 761px;
    height: 491px;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    width: 420px;
    height: 258px;
    margin-bottom: 120px;
    right: 0;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    width: 336px;
    height: 206px;
    margin-bottom: 60px;
  }
`;

const ProjectItemSvg = styled(Svg)`
  opacity: ${props => props.status === 'entered' ? 1 : 0};
  transition: opacity 0.4s ease 0.6s;
  fill: ${props => props.theme.colorTitle};

  ${props => props.theme.id === 'light' && css`
    opacity: ${props => props.status === 'entered' ? 0.4 : 0};
  `}
`;

const ProjectItemImageLaptopSvg = styled(ProjectItemSvg)`
  position: absolute;
  bottom: ${props => props.theme.id === 'light' ? -60 : -40}px;
  right: -200px;
  width: 600px;

  @media (max-width: ${props => props.theme.tablet}px) {
    width: 400px;
    right: 0;
    bottom: ${props => props.theme.id === 'light' ? 50 : 64}px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    width: 260px;
    bottom: ${props => props.theme.id === 'light' ? -10 : 10}px;
  }
`;

const ProjectItemPhone = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition-duration: 1s;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
  transition-property: transform, opacity;
  width: 100%;
  max-width: 100%;
  flex: 1 0 100%;

  ${props => props.first ? css`
    left: calc(50% - 140px);
    top: -120px;
    transform: translate3d(0, 80px, 0);
    transition-delay: 0s;

    @media (max-width: ${props => props.theme.tablet}px) {
      left: calc(50% - 48px);
      top: -60px;
    }
  `: css`
    left: calc(-50% + 20px);
    top: 120px;
    transform: translate3d(0, 80px, 0);
    transition-delay: 0.2s;

    @media (max-width: ${props => props.theme.tablet}px) {
      left: calc(-50% + 40px);
      top: 60px;
    }
  `}

  ${props => props.status === 'entered' && css`
    transform: translate3d(0, 0, 0);
    opacity: 1;
  `}
`;

const ProjectItemPhoneFrame = styled(ProgressiveImage)`
  position: absolute;
  width: 414px;
  height: 721px;

  @media (max-width: ${props => props.theme.tablet}px) {
    width: 248px;
    height: 431px;
  }
`;

const ProjectItemPhoneImage = styled(ProgressiveImage)`
  box-shadow: 0 0 0 2px #1C1C1C;
  position: relative;
  top: -14px;
  width: 254px;
  height: 452px;

  img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    box-shadow: 0 0 0 1px #1C1C1C;
    width: 152px;
    height: 270px;
    top: -9px;
  }
`;

const ProjectItemPhoneImageSvg = styled(ProjectItemSvg)`
  position: absolute;
  transform: translateY(260px);
  width: 600px;

  @media (max-width: ${props => props.theme.tablet}px) {
    width: 400px;
    transform: translateY(180px);
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    width: 320px;
    transform: translateY(160px);
  }
`;

export default memo(ProjectItem);
