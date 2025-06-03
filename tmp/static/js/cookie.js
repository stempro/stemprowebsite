window.onload = function() {
    if (document.cookie.indexOf("cookiesAccepted=true") !== -1) {
        // Hide the banner if cookies were accepted
        document.getElementById('cookieBanner').style.display = 'none';
    } else if (document.cookie.indexOf("cookiesAccepted=false") === -1) {
        // Show the banner if no choice has been made yet
        document.getElementById('cookieBanner').style.display = 'flex';
    }
}

function acceptCookies() {
    // Set a cookie to indicate the user has accepted
    document.cookie = "cookiesAccepted=true; path=/; max-age=" + 60*60*24*30; // 30 days
    // Hide the banner
    document.getElementById("cookieBanner").style.display = "none";
}

function rejectCookies() {
    // Set a cookie to indicate the user has rejected
    document.cookie = "cookiesAccepted=false; path=/; max-age=" + 60*60*24*30; // 30 days
    // Hide the banner
    document.getElementById("cookieBanner").style.display = "none";
}
