import React from 'react';
import styled from 'styled-components';

const SearchInput = () => {
  return (
    <StyledWrapper>
      <div>
        <div id="poda">
          <div className="glow" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="white" />
          <div className="border" />
          <div id="main">
            <input className="input" name="text" type="text" placeholder="Search..." />
            <div id="pink-mask" />
            <div id="search-icon">
              <svg className="feather feather-search" fill="none" height={24} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
                <circle cx={11} cy={11} r={8} stroke="url(#search)" />
                <line x1={22} x2="16.65" y1={22} y2="16.65" stroke="url(#searchl)" />
                <defs>
                  <linearGradient id="search" gradientTransform="rotate(50)">
                    <stop offset="0%" stopColor="#f8e7f8" />
                    <stop offset="50%" stopColor="#b6a9b7" />
                  </linearGradient>
                  <linearGradient id="searchl">
                    <stop offset="0%" stopColor="#b6a9b7" />
                    <stop offset="50%" stopColor="#837484" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
  /* Make the search component span wider while centered */
  width: 100%;
  max-width: 1000px; /* wider than before */
  margin-inline: auto;
  .white,
  .border,
  .darkBorderBg,
  .glow {
    max-height: 70px;
    max-width: 100%;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: -1;
    border-radius: 10px; /* match input */
    filter: blur(3px);
  }

  /* original layered borders enabled; only positioning has been fixed above */

  .input {
    background-color: #060010; /* Dark theme background */
    color: #ffffff; /* White text for dark theme */
    border: none;
    width: 100%;
    height: 56px;
    border-radius: 10px;
    padding-inline: 59px;
    font-size: 18px;
    box-sizing: border-box;
  }

  #poda {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 56px; /* match input height */
    border-radius: 10px; /* ensure consistent rounding */
  }

  .input::placeholder {
    color: #ffffff; /* Brighter placeholder */
    opacity: 0.85;
  }

  .input:focus {
    outline: none;
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 100px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, #3a2e20);
    top: 18px;
    left: 70px;
  }

  #pink-mask {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: #9945FF; /* Purple glow matching theme */
    top: 10px;
    left: 5px;
    filter: blur(20px);
    opacity: 0.8;
    transition: all 2s;
  }

  #main:hover > #pink-mask {
    opacity: 0;
  }

  .white {
    max-height: 63px;
    max-width: 100%;
    border-radius: 10px;
    filter: blur(2px);
  }

  .white::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #9945FF,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #9945FF,
      rgba(0, 0, 0, 0) 58%
    );
    transition: all 2s;
  }

  .border {
    max-height: 59px;
    max-width: 100%;
    border-radius: 10px;
    filter: blur(0.5px);
  }

  .border::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 600px;
    height: 600px;
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #060010,
      #9945FF 5%,
      #060010 14%,
      #060010 50%,
      #9945FF 60%,
      #060010 64%
    );
    transition: all 2s;
  }

  .darkBorderBg {
    max-height: 65px;
    max-width: 100%;
    border-radius: 10px;
  }

  .darkBorderBg::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #9945FF,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #9945FF,
      rgba(0, 0, 0, 0) 60%
    );
    transition: all 2s;
  }

  #poda:hover > .darkBorderBg::before,
  #poda:focus-within > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(262deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  #poda:hover > .glow::before,
  #poda:focus-within > .glow::before {
    transform: translate(-50%, -50%) rotate(240deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  #poda:hover > .white::before,
  #poda:focus-within > .white::before {
    transform: translate(-50%, -50%) rotate(263deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  #poda:hover > .border::before,
  #poda:focus-within > .border::before {
    transform: translate(-50%, -50%) rotate(250deg);
    transition: all 4s; /* Added transition for focus-within */
  }

  .glow {
    overflow: hidden;
    filter: blur(30px);
    opacity: 0.4;
    max-height: 130px;
    max-width: 100%;
  }

  .glow::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 999px;
    height: 999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #000,
      #9945FF 5%,
      #000 38%,
      #000 50%,
      #9945FF 60%,
      #000 87%
    );
    transition: all 2s;
  }

  

  #main {
    position: relative;
    font-family: "Inter", sans-serif;
    width: 100%;
    height: 56px; /* match input height */
    display: flex;
    align-items: center;
  }

  #search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #9945FF;
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
`;

export default SearchInput;
