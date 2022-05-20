(function (cf) {
    var url = {};

    url.util = {};
    url.util.getPagePathWithoutSelector = getPagePathWithoutSelector;

    url.servlets = {};
    url.servlets.mockServlet = getServletPath;
    url.servlets.get = {};

    url.servlets.get.TOKEN = function () {
        return cf.url.servlets.mockServlet(".token.json");
    }

    url.servlets.get.CHANGE_LOGIN_EMAIL = function () {
        return cf.url.servlets.mockServlet(".changeloginemail.json");
    }

    url.servlets.get.CRM_SEARCH = function () {
        return cf.url.servlets.mockServlet(".crmsearch.json");
    }

    url.servlets.get.CRM_VALIDATE = function () {
        return cf.url.servlets.mockServlet(".crmvalidate.json");
    }

    url.servlets.get.HARD_DELETE = function () {
        return cf.url.servlets.mockServlet(".hardDelete.html");
    }

    url.servlets.get.SOFT_DELETE = function () {
        return cf.url.servlets.mockServlet(".softDelete.html");
    }

    url.servlets.get.LOOKUPVALIDATE = function () {
        return cf.url.servlets.mockServlet(".lookupvalidate.json");
    }

    url.servlets.get.PROFILE_UPDATE = function () {
        return cf.url.servlets.mockServlet(".gigyaprofileupdate.json");
    }

    url.servlets.get.PUT_CONSENT = function () {
        return cf.url.servlets.mockServlet(".putconsent.json");
    }

    url.servlets.get.PUT_DCR = function () {
        return cf.url.servlets.mockServlet(".putdcr.json");
    }

    url.servlets.get.SUBSCRIPTION = function () {
        return cf.url.servlets.mockServlet(".subscriptiondata.json");
    }

    url.servlets.get.TRACKACTIVITY = function () {
        return cf.url.servlets.mockServlet(".trackactivity.json");
    }

    url.servlets.get.PROXY = function (provider) {
        return provider.startsWith("/") ? cf.url.servlets.mockServlet(".proxy.json") + provider : cf.url.servlets.mockServlet(".proxy.json") + "/" + provider;
    }

    url.servlets.get.GIGYA_PHONE_UPDATE = function () {
        return cf.url.servlets.mockServlet(".gigyaupdatephone.json");
    }

    url.servlets.get.EMAIL_LOOKUP = function () {
        return cf.url.servlets.mockServlet(".emaillookup.json");
    }

    url.servlets.get.UID_LOOKUP = function () {
        return cf.url.servlets.mockServlet(".uidlookup.json");
    }

    url.servlets.get.GET_CONSENT = function () {
        return cf.url.servlets.mockServlet(".getconsent.json");
    }

    url.servlets.get.PDF_GENERATION = function () {
        return cf.url.servlets.mockServlet(".generate.pdf");
    }

    function getPagePathWithoutSelector() {
        return window.location.pathname.split('.')[0];
    }

    function getServletPath(servlet) {
        return cf.url.util.getPagePathWithoutSelector() + servlet;
    }

    cf.url = url;

})(window.cf);