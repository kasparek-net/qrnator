(function () {
  try {
    var l = localStorage.getItem("qrnator-lang");
    if (l === "cs" || l === "en") document.documentElement.lang = l;
  } catch (e) {}
})();
