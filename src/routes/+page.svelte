<div id="myCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">
    <ol class="carousel-indicators">
      <li data-bs-target="#myCarousel" data-bs-slide-to="0" class="active"></li>
      <li data-bs-target="#myCarousel" data-bs-slide-to="1"></li>
      <li data-bs-target="#myCarousel" data-bs-slide-to="2"></li>
    </ol>
  <div class="carousel-inner " role="listbox">
      <div class="carousel-item active" style="background-color: #ff9999;">
        <div class="carousel-content">
        </div>
      </div>
      <div class="carousel-item" style="background-color: #99ccff;">
        <div class="carousel-content">
        </div>
      </div>
      <div class="carousel-item" style="background-color: #99ff99;">
        <div class="carousel-content">
        </div>
      </div>
    </div>
  </div>
  <a class="carousel-control-left" href="#myCarousel" role="button" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </a>
  <a class="carousel-control-right" href="#myCarousel" role="button" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </a>
  
  <style>
    .carousel-inner {
      height: 500px;
      position: relative;
    }
  
    .carousel-inner{
      position: relative;
    }
  
    .carousel-item {
      align-items: center;
      height: 500px;
      background-color: beige;
    }
    .carousel-indicators{
      list-style: none;
    }
    .carousel-control-left{
      left: 0%;
    }
    .carousel-control-right{
      right: 0;
    }
    .carousel-control-left, .carousel-control-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 5%;
  }
  
  </style>