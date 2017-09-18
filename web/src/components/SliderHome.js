/*
  @author Félix Fuin
  Copyright Nokia 2017. All rights reserved.
 */

import React, {Component} from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router-dom'
import '../css/slick-theme.min.css';
import '../css/slick.min.css';
import '../css/sliderHome.css';

export default class SliderHome extends Component {
  render () {
    let dragging = false;
    let settings = {
      dots: true,
      infinite: true,
      autoplaySpeed: 3000,
      autoplay: true,
      slidesToScroll: 1,
      pauseOnHover: true,
      swipeToSlide: true,
      arrow: false,
      beforeChange: () => dragging = true,
      afterChange: () => dragging = false
    };
    const slides = this.props.data.carousel.map((slide, index) => {
      const img = <div><img src={this.props.data.url + "/" + slide.img} alt=''/></div>
      let link = slide.id ? (
        <Link onClick={(e)=> dragging && e.preventDefault()} to={'item/' + slide.id}>
          { img }
        </Link>
      ) : slide.url ? (
        <a href={slide.url} target='_blank'>
          { img }
        </a>
      ) : (
        <div>
          { img }
        </div>
      ); // slide.html to display Simple popup (cf. mobile Simple.js)
      return (
        <div key={index} data-rel="lightcase">
          { link }
        </div>
      );
    });

    return (
      <div className="slider">
        <Slider {...settings}>
          { slides }
        </Slider>
      </div>
    );
  }
}
