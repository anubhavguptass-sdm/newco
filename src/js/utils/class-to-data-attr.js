(function($) {
  /*
   ** USE THIS TO CONVERT CLASSES, THAT USES SPECIFIC NAME CONVENTION, TO ELEMENT'S DATA ATTRIBUTES:
   ** specify data attribute name with the class data-attr-name-{{your-data-attr-name}}
   ** specify data-attribute value as data-attr-value-{{your-data-attr-name}}-{{your-value}}
   */
  $(document).ready(e => {
    $('[class*="data-attr-"]').each((ind, el) => {
      let t = $(el),
        cls = t.attr('class'),
        classs = $(cls.split(' '));

      classs.each((i, className) => {
        let matched = className.match(/data\-attr\-name\-([^ ]+)/gi),
          isDataAttrClass = Array.isArray(matched),
          name,
          re,
          value;

        if (isDataAttrClass) {
          name = matched[0].replace('data-attr-name-', '');
          re = new RegExp(`data\-attr\-value\-${name}\-([^ ]+)`, 'ig');
          value = cls
            .match(re)[0]
            .replace(`data-attr-value-${name}-`, '')
            .replace(/__/gim, ' '); // double underscore represents a space
          t.attr(`data-${name}`, value);
        }
      });

      t.attr({
        class: cls.replace(/data\-attr[^ ]+/gi, '').replace(/\s{2,}/gi, '') //remove data-attr-classes
      });
    });
  });
})(Cog.jQuery());
