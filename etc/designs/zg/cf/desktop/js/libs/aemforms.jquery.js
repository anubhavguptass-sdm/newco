//AEM forms dependant on jquery registered to operate
if (typeof Cog !== "undefined" && window.enableJq && typeof window.$ === "undefined") {
    window.jQuery = Cog.jQuery();
    window.$ = Cog.jQuery();
}
