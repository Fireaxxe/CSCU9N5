var $body = $("body");
var chars = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "!",
  "$",
  "^",
  "&",
  "#",
  "7",
  "9",
  "2",
  "1"
];

var strongPasswords = [
  "helloworld123",
  "stronKpassword1",
  "123456",
  "qwerty",
  "letMeIn",
  "MyPassword",
  "Op£nSus@me",
  "whatpassword",
  "System.out.print('password');"
];

var colors = ["#FF530D", "#FF0DFF", "#0DFF45", "9D0CE8", "E8290C", "blue"];

// username inputs
$body.on("click", ".field-input input", function () {
  $(".field-input").removeClass("active");
  $(this)
    .parent()
    .addClass("active");
});

$body.on("keydown", ".field-username input", function (e) {
  var key = e.keyCode || e.charCode;
  var span = $(this)
    .parent()
    .children("span");
  var message = $(".field-username .message");
  message.addClass("appear");

  $(this).val("");

  var old = span.text();
  var randomElementOfArray = Math.floor(Math.random() * chars.length);
  if (span.text().length < 16) {
    span.append(chars[randomElementOfArray]);
  }

  // remove everything
  if (key == 8 || key == 46) {
    span.text("");
    message.removeClass("appear");
  }
});

// password input
$body.on("keydown", ".field-password input", function (e) {
  var key = e.keyCode || e.charCode;
  var span = $(this)
    .parent()
    .children("span");
  var error = $(".field-password .error");
  error.addClass("appear");

  var randomColorIndex = Math.floor(Math.random() * colors.length);
  var randomColorName = colors[randomColorIndex];
  $(this)
    .parent()
    .children("label")
    .css("color", randomColorName);
  $(this).css("border-color", randomColorName);
  error.css("color", randomColorName);

  var randomPasswordIndex = Math.floor(Math.random() * strongPasswords.length);
  var randomPassword = strongPasswords[randomPasswordIndex];
  span.html(randomPassword);

  // remove everything
  if (key == 8 || key == 46) {
    span.text("");
    error.removeClass("appear");
  }
});

// selectbox
$body.on("change", "#fav_color", function (e) {
  var randomColorIndex = Math.floor(Math.random() * colors.length);
  var randomColor = colors[randomColorIndex];

  $("#currentColor").addClass("appear");
  $("#currentColor").css("background", randomColor);
});

// radios buttons
$body.on("click", ".field-radio input", function (e) {
  e.preventDefault();
  var current = 3;
  $(".field-radio label").removeClass("click");
  $(".field-radio label:nth-of-type(" + current + ")").removeClass("click");
  $(".field-radio label:nth-of-type(" + current + ")").addClass("click");
  $("fieldset .message").addClass("appear");
});

// checkbox
var amazingCount = 0;
$body.on("click", "#amazing", function () {
  amazingCount++;

  if (amazingCount % 2 == 0) {
    $("#amazing-text div").html("I agree, these were not my choices and this form is broken");
    $("#amazing-text").removeClass("checked");
  } else {
    $("#amazing-text div").html("I agree, these were 100% my choices and this form is the BEST");
    $("#amazing-text").addClass("checked");
  }
});

// signup btn
var clickCount = 0;
$body.on("click", ".button", function (e) {
  e.preventDefault();
  clickCount++;

  if (clickCount == 1) {
    $(this).html("Too slow");
    $(this).css("left", "70%");
  }
  if (clickCount == 2) {
    $(this).html("Catch me!");
    $(this).css("bottom", "10%");
    $(this).css("left", "0%");
    $(this).css("font-size", "12px");
  }
  if (clickCount == 3) {
    $(this).html("Ok try one last time");
    $(this).css("bottom", "40%");
    $(this).css("left", "50%");
    $(this).css("width", "300px");
  }

  if (clickCount == 4) {
    $(this).html("404 Form End not found");
    $(this).addClass("broken");
  }
});