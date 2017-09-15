import React from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router-dom'
import '../css/slick-theme.min.css';
import '../css/slick.min.css';
import '../css/sliderHome.css';
var data;
let dragging = false;
class SliderHome extends React.Component {
  constructor(props) {
    super(props);
    data = props.data;
    // console.log('data', data);
  }
  render () {
    var settings = {
      dots: true,
      infinite: true,
      autoplaySpeed: 3000,
      autoplay: true,
      slidesToScroll: 1,
      pauseOnHover: true,
      swipeToSlide: true,
      arrow: false,
      beforeChange: () => dragging = true,
      afterChange: () => dragging = false,
    };
    const slides = data.carousel.map((slide, index) =>
      <div key={index} data-rel="lightcase">
        <Link onClick={(e)=> dragging && e.preventDefault()} to={"/item/" + slide.id}>
          <div><img src={data.url + "/" + slide.img} /></div>
        </Link>
      </div>
    );
    return (
      <div className="slider">
        <Slider {...settings}>
          {slides}
        </Slider>
      </div>
    );
  }
}
export default SliderHome;