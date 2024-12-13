<div id="myCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2000">
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-bs-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-bs-slide-to="1"></li>
    <li data-target="#myCarousel" data-bs-slide-to="2"></li>
  </ol>

  <div class="carousel-inner">
    <div class="carousel-item active" style="background-color: #769898;">
      <div class="carousel-content">
        <h1>Welcome</h1>
      </div>
    </div>
    <div class="carousel-item" style="background-color: #d9dbe7;">
      <div class="carousel-content">
        <h2> Create post about your favorite books and coffee!</h2>
      </div>
    </div>
    <div class="carousel-item" style="background-color: #d4df91;">
      <div class="carousel-content">
        <h2> Find books clubs and events nearby you</h2>
      </div>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
<section class="featured">
  <div class="featured-books">
    <h2>Featured Books</h2>
    <!-- Grid of book posts -->
  </div>
  <div class="featured-coffee">
    <h2>Featured Coffee</h2>
    <!-- Grid of coffee posts -->
  </div>
</section>


  
<style>
  
  .carousel-inner {
    margin: 0;
    padding: 0;
  }

  .carousel-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
  }

  .carousel-indicators {
    list-style: none;
  }
  h2{
    align-content: center;
    font-family: Georgia, 'Times New Roman', Times, serif;
  }
  h1{
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 40;
  }
  
  .featured {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

.featured-books, .featured-coffee {
  width: 50%;
}

.featured h2 {
  text-align: center;
  margin-bottom: 20px;
}

</style>