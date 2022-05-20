"use strict";

(function ($, document) {
  "use strict";

  var api = {};
  var cookieName;

  api.onRegister = function (elements) {
    var $addtobasket = elements.$scope;
    cookieName = Cog.component.webshop.cookieName;
    $addtobasket.find('.btn-cart').click(function (e) {
      e.preventDefault();
      api.addCart($(this).parents('.add-to-basket-container'));
    });
  };

  api.addCart = function (addProduct) {
    var jsonValue;
    var productMaximum = addProduct.attr('data-max-product');
    var itemCode = addProduct.attr('data-item-code');
    var itemPath = addProduct.attr('data-item-path');
    var itemType = addProduct.attr('data-item-type');
    var saveValue = Cog.component.webshop.readWebshopCookie();
    var count;

    if (addProduct.find('.add-to-basket-quantity select').length > 0) {
      count = parseInt(addProduct.find('.add-to-basket-quantity select').val());
    } else {
      count = 1;
    }

    if (count > 0) {
      var productJson = '{"count":' + count + ',"type":"' + itemType + '","max":' + productMaximum + ',"path":"' + itemPath + '"}';

      if (saveValue != null && saveValue !== "null" && saveValue != false) {
        jsonValue = JSON.parse(saveValue);
        var json = JSON.parse(productJson);

        if (jsonValue[itemCode]) {
          var cookieItemCount = parseInt(jsonValue[itemCode].count);
          json.count = cookieItemCount + count;
        }

        jsonValue[itemCode] = json;
      } else {
        jsonValue = JSON.parse('{"' + itemCode + '":' + productJson + '}');
      }

      Cog.component.webshop.createWebshopCookie(jsonValue);
    }

    Cog.component.webshop.updateTotalCount();
  };

  Cog.registerComponent({
    name: "addtobasket",
    api: api,
    selector: '.addtobasket'
  });
})(Cog.jQuery());

Cog.component.webshop = function ($, document) {
  "use strict";

  var api = {};
  var searchProd;
  api.cookieName = "webshop";

  api.onRegister = function (elements) {
    if ($('.webshop-order-history').length > 0) {
      api.orderHistory();
    }

    if ($('.webshop-cart').length > 0) {
      api.updateCart();
      api.getValidProds();
      api.bindRemoveClick();
    }

    if ($('.webshop-cart-count').length > 0) {
      var totalCount = api.updateTotalCount();
      api.updateCount(totalCount);
    }
  };

  api.createWebshopCookie = function (jsonValue) {
    Cog.Cookie.create(api.cookieName, encodeURI(window.btoa(JSON.stringify(jsonValue))));
  };

  api.readWebshopCookie = function () {
    var cookieValue = Cog.Cookie.read(api.cookieName);

    if (cookieValue != null) {
      return window.atob(decodeURI(cookieValue));
    } else {
      return false;
    }
  };

  api.orderHistory = function () {
    $('.webshop-order-history .order-history-empty').addClass("is-hidden");
    $.ajax({
      type: 'GET',
      url: window.location.pathname.split('.')[0] + '.orderHistory.json',
      dataType: 'json',
      async: false,
      success: function success(data) {
        $('.webshop-order-history .order-history-loading').addClass("is-hidden");

        if (data.length === 0) {
          $('.webshop-order-history .order-history-empty').removeClass("is-hidden");
        } else {
          $('.webshop-order-history .content').append('<div class=\'orderList\' ></div>');
          var productHeader = $('.ws-oh-ph').text();
          var qtyHeader = $('.ws-oh-qh').text();
          var orderTimeHeader = $('.ws-oh-odh').text();
          var statusHeader = $('.ws-oh-sh').text();
          var promotionalPath = $('.ws-oh-pcp').text();
          $('.orderList').prepend('<div class="order-header"><div class="productDescription">' + productHeader + '</div><div class="SampleCount">' + qtyHeader + '</div><div class="OrderDate">' + orderTimeHeader + '</div><div class="OrderStatus">' + statusHeader + '</div></div>');
          $.each(data, function (key, item) {
            var sampleCount = '<div class=\'SampleCount\'>' + item.Product_qty + '</div>';
            var orderDate = '<div class=\'OrderDate\'>' + item.Order_Date + '</div>';
            var orderStatus = '<div class=\'OrderStatus\'>' + item.Order_Status + '</div>';
            var itemDescription = '';
            $.ajax({
              type: 'GET',
              url: promotionalPath + '/' + item.Product_ID + '.html',
              dataType: 'html',
              async: false,
              success: function success(promoContent) {
                var parse = $($.parseHTML(promoContent));
                var dataRecommendation = $(parse).find('.richText').html();
                itemDescription = '<div class=\'productDescription\'>' + dataRecommendation + '</div>';
              }
            });
            var output = itemDescription + sampleCount + orderDate + orderStatus;
            $('.webshop-order-history .content div.orderList').append('<div class=\'itemOrderList\'>' + output + '</div>');
          });
        }
      }
    });
  };

  api.updateCart = function () {
    $('.webshop-cart .cart-empty').addClass("is-hidden");
    var loadValue = Cog.component.webshop.readWebshopCookie();
    var qtyText = $('.ws-uc-qt').text();
    var removeText = $('.ws-uc-rm').text();
    var totalCount = 0;

    if (loadValue == "null" || loadValue == "{}") {
      $('.webshop-cart .cart-loading').addClass("is-hidden");
      $('.webshop-cart .cart-empty').removeClass("is-hidden");
    } else {
      $('.webshop-cart .cart-loading').addClass("is-hidden");
      var loadOutput = $('.webshop-cart .content').html('');
      var loadJson = JSON.parse(loadValue);

      _.forEach(loadJson, function (product, productId) {
        var productStatus = 'cartRecord status';
        totalCount = totalCount + parseInt(product.count);
        var itemRowHTML = '<div id="' + productId + '" class="' + productStatus + '" data-product-name=' + productId + ' data-product-max=' + product.max + '>' + '<div class="add-to-basket-description"></div>' + '<div class="add-to-basket-wrapper"><div><div class="add-to-basket-quantity"><label for="item' + productId + '">' + qtyText + '</label>' + api.createSelectBox(parseInt(product.count), 0, parseInt(product.max), 1, productId) + '</div>' + '<div class="add-to-basket-btn"><a class="add-to-basket-remove" title="remove" href="#">' + removeText + '</a></div></div></div></div>';
        loadOutput.append(itemRowHTML);
        var description = loadOutput.find('.add-to-basket-description').last();
        var selectBox = loadOutput.find('select').last();
        var removeButton = loadOutput.find('a.add-to-basket-remove').last();
        api.fillContent(product.path + '.html', description);
        selectBox.change(function (e, v) {
          api.updateProductCount(productId, $(this).val());
          api.updateTotalCount();
        });
        removeButton.click(function () {
          api.removeProduct(productId);
          api.updateTotalCount();
        });
      });
    }

    api.updateCount(totalCount);
  };

  api.createSelectBox = function (selectedVal, start, maxLength, steps, productId) {
    var unitsText = $('.ws-csb-ut').text();
    var selectBox = '<select id=item' + productId + '>';

    for (var i = start; i <= maxLength; i += steps) {
      var selected = selectedVal == i ? 'selected' : '';
      selectBox = selectBox + '<option ' + selected + ' value="' + i + '">' + i + ' ' + unitsText + '</option>';
    }

    selectBox = selectBox + '</select>';
    return selectBox;
  };

  api.fillContent = function (url, container) {
    $.get(url).done(function (data) {
      var parse = $($.parseHTML(data));
      var dataRecommendation = $(parse).find('.richText').html();
      container.html(dataRecommendation);
    });
  };

  api.updateProductCount = function (productId, count) {
    var currentCookie = Cog.component.webshop.readWebshopCookie();

    if (currentCookie) {
      var currentJson = JSON.parse(currentCookie);

      if (count == 0) {
        $("#" + productId).remove();
        api.removeProduct(productId);
      } else {
        currentJson[productId].count = parseInt(count);
        Cog.component.webshop.createWebshopCookie(currentJson);
      }
    }
  };

  api.updateTotalCount = function () {
    var currentCookie = Cog.component.webshop.readWebshopCookie();
    var totalCount = 0;

    if (currentCookie) {
      var currentJson = JSON.parse(currentCookie);

      _.forEach(currentJson, function (product, productId) {
        totalCount = totalCount + parseInt(product.count);
      });
    }

    api.updateCount(totalCount);
  };

  api.updateCount = function (count) {
    $('.webshop-cart-count p b').html(count);
  };

  api.removeProduct = function (productId) {
    var currentCookie = Cog.component.webshop.readWebshopCookie();

    if (currentCookie) {
      var currentJson = JSON.parse(currentCookie);
      delete currentJson[productId];
      Cog.component.webshop.createWebshopCookie(currentJson);
    }
  };

  api.bindRemoveClick = function () {
    $('.add-to-basket-remove').click(function (e) {
      e.preventDefault();
      var productId = $(this).parents('div.status:eq(0)').attr('id');
      $(this).parents('div.status:eq(0)').remove();
      api.removeProduct(productId);
    });
  };

  api.getValidProds = function () {
    $.get(window.location.pathname.split('.')[0] + '.webshopProducts.json', function (data) {
      searchProd = data;

      if (typeof data.error == 'undefined') {
        api.removeInvalidP();
      } else if (data.error == 'Non-Personalized') {
        api.removeInvalidNP();
      }
    }).fail(function (data) {});
  };

  api.removeInvalidP = function () {
    $('.webshop-cart div.cartRecord').each(function () {
      var selectedVal = 0;
      var $this = $(this);
      var productStatus = '';
      var id = $this.attr('id');
      var qtyText = $('.ws-uc-qt').text();

      try {
        var sampleCount = _.result(_.find(searchProd, function (product) {
          return product.Product_ID == $this.attr('id');
        }), 'Product_Qty');

        sampleCount = parseInt(sampleCount);
        var loadValue = Cog.component.webshop.readWebshopCookie();
        var loadJson = JSON.parse(loadValue);

        _.forEach(loadJson, function (product, productId) {
          if (productId == id) {
            selectedVal = parseInt(product.count);
          }
        });

        if (sampleCount == undefined || isNaN(sampleCount) || sampleCount <= 0) {
          var productUnavailable = $('.ws-ri-pu').text();
          $this.addClass('inActiveProduct');
          $this.find('select').attr('disabled', true);
          $this.find('.add-to-basket-wrapper').append('<div class="webshop-error">' + productUnavailable + '</div>');
          api.removeProduct($this.attr('id'));
          api.updateTotalCount();
        } else if (selectedVal == sampleCount) {
          $this.find('.add-to-basket-quantity').html('<label for="item' + id + '">' + qtyText + '</label>' + api.createSelectBox(selectedVal, 0, sampleCount, 1, id));
          $this.find('select').change(function () {
            api.updateProductCount(id, $(this).val());
            api.updateTotalCount();
          });
        } else if (selectedVal < sampleCount) {
          $this.find('.add-to-basket-quantity').html('<label for="item' + id + '">' + qtyText + '</label>' + api.createSelectBox(selectedVal, 0, sampleCount, 1, id));
          $this.find('select').change(function () {
            api.updateProductCount(id, $(this).val());
            api.updateTotalCount();
          });
        } else if (selectedVal > sampleCount) {
          var orderLimit = $('.ws-ri-ol').text();
          $this.find('.add-to-basket-quantity').html('<label for="item' + id + '">' + qtyText + '</label>' + api.createSelectBox(sampleCount, 0, sampleCount, 1, id));
          $this.find('.add-to-basket-wrapper').append('<div class="webshop-error">' + orderLimit + '</div>');
          api.updateProductCount(id, sampleCount);
          api.updateTotalCount();
          $this.find('select').change(function () {
            api.updateProductCount(id, $(this).val());
            api.updateTotalCount();
          });
        }
      } catch (err) {}
    });
  };

  api.removeInvalidNP = function () {
    $('.webshop-cart div.cartRecord').each(function () {
      var $this = $(this);
      var productStatus = '';
      var selectedVal = 0;
      var qtyText = $('.ws-uc-qt').text();
      var id = $this.attr('id');

      try {
        var loadValue = Cog.component.webshop.readWebshopCookie();
        var loadJson = JSON.parse(loadValue);

        _.forEach(loadJson, function (product, productId) {
          if (productId == id) {
            selectedVal = parseInt(product.count);
          }
        });

        var maxAllowed = parseInt($this.data('product-max'));

        if (selectedVal <= maxAllowed) {
          $this.find('.add-to-basket-quantity').html('<label for="item' + id + '">' + qtyText + '</label>' + api.createSelectBox(selectedVal, 0, maxAllowed, 1, id));
          $this.find('select').change(function () {
            api.updateProductCount(id, $(this).val());
            api.updateTotalCount();
          });
        } else if (selectedVal > maxAllowed) {
          var orderLimit = $('.ws-ri-ol').text();
          $this.find('.add-to-basket-quantity').html('<label for="item' + id + '">' + qtyText + '</label>' + api.createSelectBox(maxAllowed, 0, maxAllowed, 1, id));
          $this.find('.add-to-basket-wrapper').append('<div class="webshop-error">' + orderLimit + '</div>');
          api.updateProductCount(id, maxAllowed);
          api.updateTotalCount();
          $this.find('select').change(function () {
            api.updateProductCount(id, $(this).val());
            api.updateTotalCount();
          });
        }
      } catch (err) {}
    });
  };

  Cog.registerComponent({
    name: "webshop",
    api: api,
    selector: '.webshop'
  });
  return api;
}(Cog.jQuery());