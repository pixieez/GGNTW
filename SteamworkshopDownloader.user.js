// ==UserScript==
// @name        SteamworkshopDownloader
// @namespace   .js Scripts
// @match        *://steamcommunity.com/workshop/filedetails/?id=*
// @match        *://steamcommunity.com/sharedfiles/filedetails/?id=*
// @version     1.0
// @author      https://github.com/pixieez
// @include     *steamcommunity.com/sharedfiles/filedetails/?id=*
// @include     *steamcommunity.com/workshop/filedetails/?id=*
// @grant       GM_xmlhttpRequest
// @icon        https://raw.githubusercontent.com/pixieez/GGNTW/main/icon.png
// @description Downloads Steam Workshop items that really works, replacing the deprecated or free space left from steamworkshop.download
// @downloadURL https://github.com/pixieez/GGNTW/raw/main/SteamworkshopDownloader.user.js
// @updateURL https://github.com/pixieez/GGNTW/raw/main/SteamworkshopDownloader.user.js
// @license     GPL-3.0
// ==/UserScript==
 
// Changelog:
// 2023-11-25: added loading overlay
 
var patt = new RegExp("[0-9]{2,15}");
var id = patt.exec(document.URL)[0];
var baseUrl = "https://steamcommunity.com/sharedfiles/filedetails/?id="
 
if (document.URL.indexOf("steamcommunity.com") != -1) {
    if (document.URL.indexOf("workshop") != -1 || document.URL.indexOf("filedetails") != -1) {
        if(!id)
          alert("CANNOT GET ID!")
 
        addMeta();
        addWorkshopBtn(id);
    }
}
 
function addMeta() {
  var meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  var allowedUrls = "https://api.ggntw.com https://api.ggntw.com/steam.request"
 
  if (meta) {
    meta.content += " " + allowedUrls;
  } else {
    meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "connect-src 'self' " + allowedUrls;
    document.getElementsByTagName('head')[0].appendChild(meta);
  }
}
 
function SBS_NW(url) {
    console.log("DOWNLOADING: "+url)
    GM_xmlhttpRequest({
        anonymous: true,
        method: "POST",
        url: "https://api.ggntw.com/steam.request",
        data: JSON.stringify({url}),
        headers: {
            "Content-Type": "application/json",
            "User-Agent":"insomnia/2023.5.8"
        },
        onprogress: () => {},
        responseType: "json",
        onload: response => {
          console.log("success!", {response})
          window.open(response.response.url,"_blank")
 
          // Remove the loading popup when done
          var loadingPopupToRemove = document.getElementById('dwn_loading');
          loadingPopupToRemove.parentNode.removeChild(loadingPopupToRemove);
 
        },
        onerror: reponse => {
            // Remove the loading popup when done
            var loadingPopupToRemove = document.getElementById('dwn_loading');
            loadingPopupToRemove.parentNode.removeChild(loadingPopupToRemove);
            alert('error')
        }
    });
}
function addWorkshopBtn(id) {
    var element = document.getElementById("AddToCollectionBtn");
    var button = document.createElement('span');
    button.setAttribute('class', 'general_btn share tooltip');
 
    button.innerHTML = '<span id="SUBS_TO_ITEM"><span>ดาวน์โหลด🔥</span></span>';
    button.onclick = function() {
        // Create a loading popup
        var loadingPopup = document.createElement('div');
        loadingPopup.setAttribute("id","dwn_loading");
        loadingPopup.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;');
        loadingPopup.innerHTML = '<span style="color: white; font-size: 2em;">Downloading...</span>';
        document.body.appendChild(loadingPopup);
 
        SBS_NW(baseUrl+id);
 
    }
 
    if (element.nextSibling) {
        element.parentNode.insertBefore(button, element.nextSibling);
    } else {
        element.parentNode.appendChild(button);
    }
    document.querySelectorAll(".game_area_purchase_game")[0].getElementsByTagName('h1')[0].setAttribute('style', 'width: 300px;');
}
