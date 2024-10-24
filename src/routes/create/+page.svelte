<script>
    let bookTitle = '';
    let coffeeShop = '';
    let description = '';


    function updateDescription(event) {
    description = event.target.value; // Update the description on input
  }
</script>
  <div class ="form-container">
    <h2>Create your Post</h2>
  <form>
    <div>
      <label for="bookTitle">Book Title:</label>
      <input 
        type="text" 
        id="bookTitle" 
        bind:value={bookTitle} 
        placeholder="Enter the book title" 
      />
    </div>
  
    <div>
      <label for="coffeeShop">Coffee Shop:</label>
      <input 
        type="text" 
        id="coffeeShop" 
        bind:value={coffeeShop} 
        placeholder="Enter the coffee shop name" 
      />
    </div>
  
    <div>
        <label for="description">Description:</label>
        <textarea 
          id="description" 
          on:input={updateDescription} 
          placeholder="Write something about the book and coffee experience">
          {description} 
        </textarea>
      </div>
    <button type="submit">Create Post</button>
  </form>
</div>
  
<style>
    .form-container {
      background-color: pink;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
      max-width: 400px;
      margin: 0 auto;
      text-align: center;
    }
  
    form {
      display: flex;
      flex-direction: column;
    }
  
    div {
      margin-bottom: 15px;
    }
  
    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-top: 5px;
    }
  
    button {
      padding: 10px;
      background-color:black;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    button:hover {
      background-color: grey;
    }
  
    h2 {
      margin-bottom: 20px;
      font-family: Arial, sans-serif;
    }
  </style>