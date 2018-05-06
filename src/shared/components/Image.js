import React from "react";
import styled, { css } from "styled-components";
import Carousel from "nuka-carousel";

let Img = styled.img`
  position: center;
`;

let DivCarrousel = styled.div`
  position: relative;
  height: 40%;

  & .slider {
    width: 85% !important;
  }

  & .slider-control-bottomcenter ul {
    top: 60px !important;
  }

  & .slider-control-bottomcenter ul li button {
    font-size: 50px !important;
    color: white !important;
  }

  & .slider-control-centerright button {
    display: none !important;
  }
  & .slider-control-centerleft button {
    display: none !important;
  }
`;

let P = styled.div`
  position: center;
  color: white;
  font-size: 12pt;
  margin-left: 15%;
  width: 100%;
`;
let DivParagraph = styled.div`
  position: center;
  width: 80%;
  margin-left: 5%;
`;

class Image extends React.Component {
  render() {
    return (
      <DivCarrousel>
        <Carousel>{this.renderImage(this.props.imageList)}</Carousel>
      </DivCarrousel>
    );
  }

  renderImage = images => {
    return images.map((photo, index) => (
      <DivParagraph key={index}>
        <Img src={photo.link} />
        <P>{photo.text}</P>
      </DivParagraph>
    ));
  };
}

export default Image;