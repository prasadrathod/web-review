const webReview = require("./main");
const fs = require("fs");
// webReview.ss('https://www.google.com/');
// webReview.lh("https://www.google.com/", ["accessibility", "performance"]);
// webReview.lh("https://www.google.com/");

module.exports.exec = (
  urlList = [
    {
      url: "https://github.com",
      resolution: [
        "480x320", 
        "1024x768", 
        "iphone 5s",
        "iphone 7 plus",
        "1024x768",
        "1280x1024"
      ],
      category: ["accessibility", "performance"],
    },
  ]
) => {
  //right now URL is just string
  //TODO : Check the type of URL, if string then below code, if list i.e multiple URLs then handle that
  // Resolution will be a list of list in that case or Better have a dictionary and iterate over that
  return (() => {
    console.log("Running...")
    var auditState = webReview.auditState;
    auditState.registerListener(() => {
      if (auditState.url === -1) return;
      if (auditState.url === urlList.length) {
        auditState.url = -1;
        return;
      }
      webReview.lh(
        urlList[auditState.url].url,
        urlList[auditState.url].category
      );
    });

    for (const key in urlList) {
      const urlObj = urlList[key];
      var dir = new URL(urlObj.url).hostname;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      webReview.ss(urlObj.url, urlObj.resolution);
    }
    //begin auditing
    if (auditState.url === -1) auditState.url = 0;

    console.log("Done!")
    return true;
  })();
};
