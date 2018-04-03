//by johnerfx (MIT Licensed)
function checkTicker() {
  var ticker = new XMLHttpRequest();
	ticker.open("GET", "https://api.coinmarketcap.com/v1/ticker/", true);
	ticker.onreadystatechange = function() {
	if (ticker.readyState == 4 && ticker.status == 200) {
		var jsonresponse=JSON.parse(ticker.responseText);
		for (i=0;i<jsonresponse.length;i++) {
			if (jsonresponse[i]['id']=='part') {
				//chrome.extension.getBackgroundPage().console.log(window.navigator.language);
				var part_btc=jsonresponse[i]['price_btc'];
				var part_usd=jsonresponse[i]['price_usd'];
				var part_percent1h=jsonresponse[i]['percent_change_1h'];
				var part_percent24h=jsonresponse[i]['percent_change_24h'];
				var part_percent7d=jsonresponse[i]['percent_change_7d'];
				var part_marketcap=jsonresponse[i]['market_cap_usd'];
				var part_volume=jsonresponse[i]['24h_volume_usd'];
			}
		}
		chrome.browserAction.setBadgeText({text: parseFloat(part_usd).toFixed(1)});
		var lines=["PART price ticker (price taken from 'www.coinmarketcap.com')\n"];
    var options = { style: 'currency', currency: 'USD'};
		lines.push("\n");
		lines.push("PART "+FixIfNotNull(part_btc,8)+"BTC\n");
		lines.push("PART "+FixIfNotNull(part_usd,4)+"$\n");
		lines.push("PART Marketcap "+Number(part_marketcap).toLocaleString(window.navigator.language,options)+"\n");
		lines.push("PART 24h change "+FixIfNotNull(part_percent24h,2)+"%\n");
		lines.push("PART 24h Volume "+Number(part_volume).toLocaleString(window.navigator.language,options)+"\n");
		lines.push("\n");
		lines.push(Date());
		var title_lines="";
		for (j=0;j<lines.length;j++) {
			title_lines=title_lines+lines[j];
		}
		chrome.browserAction.setTitle({title:title_lines});
		}
	}
ticker.send();
}
function FixIfNotNull(variable,decimals) {
	//Function passess variable toFixed only if it is not null (edge case)
	//then returns fixed_var as string
	var fixed_var="UNAVAILABLE";
	if (variable) {
		fixed_var=parseFloat(variable).toFixed(decimals);
	}
	return fixed_var.toString()
}
chrome.browserAction.onClicked.addListener(function(activeTab)
    {
      var newURL = "http://coinmarketcap.com/currencies/part/";
      chrome.tabs.create({ url: newURL });
    });
window.setInterval(checkTicker, 240000); //4 minutes
checkTicker();
