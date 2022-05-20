/*
 ** for accessibility options on table component use classes
 ** table for table
 ** table-row for table row
 ** table-rowgroup for table row group
 ** table-columnheader for columnheader
 ** table-cell for table cell
 */

(function($) {
  let touchstartX = 0,
    touchstartY = 0,
    touchendX = 0,
    touchendY = 0,
    handleGesture = tbl => {
      let scrollables = tbl.find('.table-row > .component-content > .content');
      if (touchendX + 40 < touchstartX) {
        //left
        scrollables.each((ind, el) => {
          el.scrollBy(tbl.innerWidth(), 0);
        });
      }

      if (touchendX - 40 > touchstartX) {
        //right
        scrollables.each((ind, el) => {
          el.scrollBy(-tbl.innerWidth(), 0);
        });
      }

      if (touchendY < touchstartY) {
        //up
      }

      if (touchendY > touchstartY) {
        //down
      }

      if (touchendY === touchstartY) {
        // console.log('Tap')
      }
    },
    initTable = table => {
      let rootTable = $(table),
        firstRow = rootTable.find('.table-row:first'),
        items = firstRow.find(
          '>.component-content > .paragraphSystem > *:not(a)'
        ),
        allCells = rootTable.find(
          '.table-row > .component-content > .paragraphSystem > *:not(a)'
        ),
        columnLenght = items.length,
        colspanFound = false;

      items.each((i, e) => {
        let colspanTotal = 0,
          cell = $(e);

        try {
          if (cell.is('[class*=colspan]') && /colspan\d+/gi.test(e.className)) {
            colspanTotal +=
              parseInt(e.className.match(/colspan\d+/gi)[0].match(/\d+/gi)[0]) -
              1;
          }
        } catch (err) {}

        columnLenght += colspanTotal;
      });

      allCells.each((i, e) => {
        let cell = $(e),
          multiplier = 1,
          perc,
          colspan = false;
        try {
          if (cell.is('[class*=colspan]') && /colspan\d+/gi.test(e.className)) {
            // multiplier = parseInt(e.className.match(/colspan\d+/ig)[0].match(/\d+/ig)[0])
            colspan = true;
            colspanFound = true;
          }
        } catch (err) {}
        perc = (100 / columnLenght) * multiplier;
        if (!colspan) {
          cell.css({
            maxWidth: `${perc}%`,
            flex: `0 0 ${perc}%`
          });
        }
      });

      if (!colspanFound) {
        rootTable.addClass('no-colspan-cells-js');
      }

      rootTable.find('.table-row').attr({
        role: 'row'
      });
      rootTable.find('.table-rowgroup').attr({
        role: 'rowgroup'
      });
      rootTable.find('.table-cell').attr({
        role: 'cell'
      });
      rootTable.find('.table-columnheader').attr({
        role: 'columnheader'
      });
    };

  $(document).ready(() => {
    let tables = $('.table')
      .on('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
      })
      .on('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        handleGesture($(e.currentTarget));
      })
      .attr({
        role: 'table'
      });

    tables.each((ind, el) => {
      initTable(el);

      let table = $(el);
      tableId = table.attr('class').match(/idclass\-([^\s]+)/gi);
      if (tableId !== null) tableId = tableId[0].replace('idclass-', '');
      else
        tableId = `table${(Math.random() * 1000000000000).toFixed(
          0
        )}${new Date().getTime()}`;

      table.attr('id', tableId);

      window.bpComponents.tables[tableId] = el;
    });
  });
})(Cog.jQuery());
