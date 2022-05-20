(function($) {
  // revtrax component selector
  const rtSelector = '.revtrax-container';
  // revtrax base url
  window.revTraxBasURL = '//irxcm.com/RevTrax/js/rtxiframe.jsp';
  // object storage for coupons that requires registration
  window.rtRegContainers = {};
  // method that initiates display of coupon rtCouponSetupObject:mandatory, uid:optional
  window.revTraxCoupon = function(rtCouponSetupObject, uid) {
    // check if rtCouponSetupObject is valid revTrax setup object
    if (
      typeof rtCouponSetupObject !== 'object' &&
      !rtCouponSetupObject.hasOwnProperty('programId')
    ) {
      // stop execution if not and give message to console
      console.warn('Invalid rtCouponSetupObject');
      return;
    }
    // if uid is set and is not empty set uid string to be appended to revtrax base url
    let uidString =
      arguments.length > 1 && typeof uid === 'string' && uid !== ''
        ? `&uid=${uid}&gigyaID=${uid}`
        : ``;

    // create reference object for rtCouponSetupObject
    let o = rtCouponSetupObject,
      // build revtrax URL
      rtURL = `${window.revTraxBasURL}?parent=${o.parent}&frameId=${o.frameId}&rtxuseqs=true&merchantId=${o.merchantId}&programId=${o.programId}&affiliateId=${o.affiliateid}&channel=${o.channel}&rx_channel=${o.rxChannel}${uidString}`;

    let registerRevTraxURL = `//irxcm.com/RevTrax/util/uidreg`,
      loadRTScript = (o, uid) => {
        // load the coupon loader script
        $.getScript(
          rtURL,
          // on load callback
          (data, textStatus, jqxhr) => {
            // call makeFrame callback with frameId if any
            if (typeof window[o.createFrameCallback] === 'function') {
              window[o.createFrameCallback]();
              // if uid set, remove gygia form
              if (uid) {
                window.removeRegForm();
              }
            } else
              console.warn(`window.${o.createFrameCallback} doesn't exist!`); // warn user about missing method
          }
        );
      };
    loadRTScript(o, uid);
  };
  // gygia form removal method
  window.removeRegForm = function() {
    $('.gigyaraas.component').remove();
  };
  // on dom ready
  $(document).ready(e => {
    // check for gygia UID in local storage
    let localUID = window.localStorage.getItem('gygiaUID');
    // iterate over each revTrax component
    $(rtSelector).each((ind, el) => {
      // set reference to revTrax component element
      let rtContainer = $(el);
      // get id
      let id = rtContainer.attr('id');
      // store revTrax component setup
      let rtSetup = {
        frameId: ind, // represent index or number or id of each revtrax call
        createFrameCallback: `makeFrame${ind}`, // represents callback method called after script is loaded
        affiliateid: rtContainer.attr('data-affiliate-id'),
        programId: rtContainer.attr('data-program-id'),
        registrationNeeded: rtContainer.attr('data-reg') === 'true',
        rxChannel: rtContainer.attr('data-rx-channel'),
        channel: rtContainer.attr('data-channel'),
        parent: id, // represents id of revtrax container div
        merchantId: rtContainer.attr('data-merchant-id')
      };
      // if rtSetup with same or duplicate id already in rtRegContainers stop execution and warn user
      if (window.rtRegContainers.hasOwnProperty(id)) {
        console.warn(
          `BP RevTrax Container Duplicate ID: ${id}. Please specify unique ID!`
        );
        return;
      }
      // check if registration is needed or if localUID is set
      if (rtSetup.registrationNeeded && localUID === null) {
        // store trSetup in rtRegContainers with unique ID and skip the rest
        window.rtRegContainers[id] = rtSetup;
        return;
      }
      // if local gygia UID found remove gygia form
      if (localUID !== null) {
        window.removeRegForm();
      }
      // if no registration for revTrax coupon needed initiate display of coupon
      window.revTraxCoupon(rtSetup, localUID);
    });
  });
})(Cog.jQuery());
