var headArea = document.getElementsByClassName('head')[1];
var htmlArea = document.getElementsByClassName('html')[0];
var cssArea = document.getElementsByClassName('css')[0];
var jsArea = document.getElementsByClassName('js')[0];
var resultHtml = document.getElementById('result').attributes.getNamedItem('srcdoc');
var consDiv = document.getElementById("console");
var closeTag = '<\/';
var webconsole = '';
var jq = '';
var befHead = '<!DOCTYPE html><html><head>';
var befCss = '<style type="text/css">';
var aftCss = closeTag + 'style>';
var befHtml = '<title>result title' + closeTag + 'title>' + closeTag + 'head><body>';
var befJs = '<script>';
var aftJs = closeTag + 'script>' + closeTag + 'body>' + closeTag + 'html>';
resultHtml.value = 'test'

//MAIN function
function run() {
	resultHtml.value = befHead + webconsole + headArea.value + befCss + cssArea.value + aftCss + befHtml + htmlArea.value + jq + befJs + jsArea.value + aftJs;
	//console.log(headArea.value);
};
function reset() {
	htmlArea.value = htmlArea.textContent;
	cssArea.value = cssArea.textContent;
	jsArea.value = jsArea.textContent;
	consDiv.textContent = "";
	run();
}
function save() {
	var fullpage = new Blob([resultHtml.value], { type: 'text/html' });
	var pageUrl = URL.createObjectURL(fullpage);
	document.getElementById('save').href = pageUrl;
	document.getElementById('save').download = 'index.html';
};
function wcons() {
	webconsole = (this.checked ? '<script>console.log=function(text){var cons=window.parent.document.getElementById("console");cons.innerHTML="<p></p>"+cons.innerHTML;cons.firstElementChild.textContent=text;}' + closeTag + 'script>' : '');
	run()
};
function jquer() {
	jq = (this.checked ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js">' + closeTag + 'script>' : '');
	run()
};
function showhead() {
	document.getElementsByClassName('textarea')[1].style.cssText = (this.checked ? 'z-index:-1' : 'z-index:0');
	run()
};
//Event Handlers
htmlArea.addEventListener("input", run);
cssArea.addEventListener("input", run);
jsArea.addEventListener("input", run);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('save').addEventListener('click', save);
document.getElementById("webconsole").addEventListener('change', wcons);
document.getElementById("jquery").addEventListener('change', jquer);
document.getElementById("showhead").addEventListener('change', showhead);
//Initialize
wcons.call(document.getElementById("webconsole")); //includes call to run()