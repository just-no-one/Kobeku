var shoppingCart = (function() {
  cart = [];
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null)
  {
    loadCart();
  }
  //post the cart into PHP
  function postCart(){
    var data = {};
    for(var len = sessionStorage.length, i = 0; i < len; i++) {
        var key =  sessionStorage.key(i);
        data[key] = sessionStorage.getItem(key);
    }

  console.log(data);

  //From this point you can post the `data` to your server side
  $.post("./isipesanan.php",
    {
      data1 : data
    },
    function(response,status){
      alert("respons server" + response);
      alert("status server"+status);
  });
  }

//trigger order now
 $("#order-now").click(postCart);
 
  var obj = {};
  obj.addItemToCart = function(name, price, count) {
    for (var item in cart) 
    {
      if (cart[item].name === name) 
      {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  }
  obj.setCountForItem = function(name, count) {
    for (var i in cart)
    {
      if (cart[i].name === name)
      {
        cart[i].count = count;
        break;
      }
    }
  };
  obj.removeItemFromCart = function(name) {
    for (var item in cart)
    {
      if (cart[item].name === name) 
      {
        cart[item].count --;
        if (cart[item].count === 0) 
        {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  }
  obj.removeItemFromCartAll = function(name) {
    for (var item in cart)
    {
      if (cart[item].name === name) 
      {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }
  obj.totalCount = function() {
    var totalCount = 0;
    for (var item in cart) 
    {
      totalCount += cart[item].count;
    }
    return totalCount;
  }
  obj.totalCart = function() {
    var totalCart = 0;
    for (var item in cart)
    {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }
  obj.listCart = function() {
    var cartCopy = [];
    for (i in cart)
    {
      item = cart[i];
      itemCopy = {};
      for (p in item)
      {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }
  return obj;
})();

$('.add-to-cart').click(function(event) {
  event.preventDefault();
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});
$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for (var i in cartArray) 
  {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td>(" + cartArray[i].price + ")</td>"
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = " 
      + "<td>" + cartArray[i].total + "</td>" 
      +  "</tr>";
  }
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

displayCart();