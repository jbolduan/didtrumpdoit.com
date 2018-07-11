//Defaults
(function($, List, _, moment) {
  // List.js classes to use for search elements
  var listOptions = {
    valueNames: [
      'js-promise-text',
      'js-promise-category',
      'js-promise-status'
    ]
  };

  // tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // tabs
  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  // Find any within a facet
  function foundAny(facets, compareItem) {
    // No facets selected, show all for this facet
    if (_.isEmpty(facets)) {
      return true;
    }
    // Otherwise, show this item if it contains any of the selected facets
    return facets.reduce(function(found, facet) {
      if (found) {
        return found;
      }
      return compareItem[facet['facet']] === facet['value'];
    }, false);
  }
  
  //Startup + Misc
  $(function() {
    // Dates
    var today = moment();
    var inauguration = moment('2012-11-19');
    $('#inauguration-days').html(inauguration.diff(today, 'days') > 0 ? inauguration.diff(today, 'days') : 'NA');
    $('#inauguration-time-container').hide(); //TEMP FIX 
    $('#days-in-office').html(today.diff(inauguration, 'days') > 0 ? today.diff(inauguration, 'days') : 0);

    //Always show tooltip on confidence-btn
    //$('#confidence-btn').tooltip('show');
    
    // Select and replace maintained by name
    var maintainers = ["CryTek Legal Beagles", "Coutts & Co.", "Bitter EvE Goons", "SomethingAwful Goons", "Salty Asshats", "Goons (who know nothing about game development)", "Goons stuck in checkmate", "T-posed Goons", "MY GIRLFRIEND", "The Fourth Stimpire", "WaffleImages", "COBOL Greybeards", "Blocked Buddies", "Thanks notepad", "Archive-Priests™", "Ryan Archer"]
    var maintainer = maintainers[Math.floor(Math.random() * maintainers.length)];
    $('.maintainer-name').html(maintainer);

    // List.js object that we can filter upon
    var promiseList = new List('promises', listOptions).on('updated', function(list) {
      $('#count').html(list.visibleItems.length);
    });

    var $search = $('#search');
    var $facets = $('[data-list-facet]'); // All buttons that can filter

    // Clear all
    function resetFilter(e) {
      e.preventDefault();
      // Visually reset buttons
      $facets.removeClass('active');
      // Clear out text field
      $search.val('');
      // Wipe all filters
      promiseList.search();
      promiseList.filter();
      // Wipe graph to default
      Build_and_fill_Chart();
    }

    // Hard reset all the buttons
    $('.promises__category--reset').on('click', resetFilter);

    var anchorhash = window.location.hash.substr(1);
    if (anchorhash) {
      anchorhash = _.replace(anchorhash, new RegExp("_","g")," ");
      $search.val(anchorhash.toString());
      promiseList.search(anchorhash);
      // promiseList.filter();
      // promiseList.update();
      // promiseList = new List('promises', listOptions).on('updated', function(list) {
      //   $('#count').html(list.visibleItems.length);
      // });
    }

    // Any facet filter button
    $facets.on('click', function(e) {

      var facet = $(this).data('list-facet'); // ie 'js-promise-category'
      var value = $(this).data('facet-value'); // ie 'Culture'
      var isSingle = !!$(this).data('select-single'); // ie true/false for if there can only be one of this filter

      // Single-select categories should have their active state wiped
      if (isSingle) {
        $facets
          .filter(function() { return $(this).data('list-facet') === facet; })
          .removeClass('active');
      }

      // Flag as active
      $(this).toggleClass('active');

      // Array of active
      var facets = $facets.filter('.active').map(function() {
        // return object instead with facet/value
        return {
          facet: $(this).data('list-facet'),
          value: $(this).data('facet-value'),
          isSingle: !!$(this).data('select-single')
        };
      }).get();
      
      // console.log(facets);
      //Update graph on "js-promise-status" changes
      if (facets[0].facet == "js-promise-status") {
        Build_and_fill_Chart(facets[0].value);
      }
      
      // When deselecting last, clear all filters
      if (facets.length === 0) {
        promiseList.filter();
        return; // Eject now
      }

      // Otherwise, filter on the array
      promiseList.filter(function(item) {

        var itemValues = item.values();

        // Single selects, eg "Not started"
        var single = _.filter(facets, ['isSingle', true]);
        var foundSingle = foundAny(single, itemValues);
        // Single-selection items hide if false no matter what, so eject if not found here
        if (!foundSingle) {
          return false;
        }

        // Full categories can have multiples show, list out here
        var multis = _.filter(facets, ['isSingle', false]);
        return foundAny(multis, itemValues);

      }); // promiseList.filter()

    });
  });

})(jQuery, List, _, moment);


//Chart
function Build_and_fill_Chart(para_Type) {
    if (para_Type === void 0) { para_Type = "all"; }
    var History = [
      {"Not_implemented":0,"Completed":0,"date":"2012-10-01T07:00:00.000Z"},
      {"Not_implemented":13,"In_alpha":1,"Completed":2,"date":"2012-11-01T07:00:00.000Z"},{"Not_implemented":44,"Compromised":1,"Completed":8,"In_alpha":2,"date":"2012-12-01T08:00:00.000Z"},{"Not_implemented":44,"Compromised":1,"Completed":8,"In_alpha":2,"date":"2013-01-01T08:00:00.000Z"},{"Not_implemented":54,"Completed":9,"Compromised":1,"In_alpha":2,"date":"2013-02-01T08:00:00.000Z"},{"Not_implemented":56,"Completed":10,"Compromised":1,"In_alpha":2,"date":"2013-03-01T08:00:00.000Z"},{"Not_implemented":58,"Completed":10,"Compromised":1,"In_alpha":2,"date":"2013-04-01T07:00:00.000Z"},{"Not_implemented":64,"Completed":10,"Compromised":1,"In_alpha":2,"date":"2013-05-01T07:00:00.000Z"},{"Not_implemented":66,"Completed":12,"Compromised":1,"In_alpha":2,"date":"2013-06-01T07:00:00.000Z"},{"Not_implemented":78,"In_alpha":3,"Completed":12,"Compromised":1,"date":"2013-07-01T07:00:00.000Z"},{"Not_implemented":80,"In_alpha":3,"Completed":12,"Compromised":1,"date":"2013-08-01T07:00:00.000Z"},{"Not_implemented":85,"In_alpha":3,"Completed":12,"Compromised":1,"date":"2013-09-01T07:00:00.000Z"},{"Not_implemented":88,"Completed":13,"In_alpha":3,"Compromised":1,"date":"2013-10-01T07:00:00.000Z"},{"In_alpha":4,"Not_implemented":90,"Completed":13,"Compromised":1,"date":"2013-11-01T07:00:00.000Z"},{"Not_implemented":98,"In_alpha":4,"Completed":13,"Compromised":1,"date":"2013-12-01T08:00:00.000Z"},{"Not_implemented":105,"Completed":18,"In_alpha":6,"Compromised":1,"date":"2014-01-01T08:00:00.000Z"},{"Not_implemented":129,"In_alpha":10,"Completed":30,"Compromised":2,"Broken":1,"date":"2014-02-01T08:00:00.000Z"},{"Not_implemented":149,"In_alpha":12,"Completed":33,"Compromised":2,"Broken":1,"date":"2014-03-01T08:00:00.000Z"},{"Not_implemented":172,"Completed":35,"In_alpha":13,"Compromised":2,"Broken":1,"date":"2014-04-01T07:00:00.000Z"},{"Not_implemented":197,"In_alpha":18,"Completed":38,"Compromised":2,"Broken":1,"date":"2014-05-01T07:00:00.000Z"},{"Not_implemented":223,"Compromised":3,"In_alpha":20,"Completed":38,"Broken":1,"date":"2014-06-01T07:00:00.000Z"},{"Not_implemented":256,"Completed":41,"Compromised":3,"In_alpha":20,"Broken":2,"date":"2014-07-01T07:00:00.000Z"},{"In_alpha":21,"Not_implemented":266,"Completed":42,"Compromised":3,"Broken":2,"date":"2014-08-01T07:00:00.000Z"},{"Not_implemented":286,"In_alpha":22,"Completed":44,"Compromised":3,"Broken":2,"date":"2014-09-01T07:00:00.000Z"},{"Not_implemented":288,"Completed":48,"In_alpha":23,"Compromised":3,"Broken":2,"date":"2014-10-01T07:00:00.000Z"},{"Not_implemented":291,"Completed":49,"In_alpha":23,"Compromised":3,"Broken":2,"date":"2014-11-01T07:00:00.000Z"},{"Not_implemented":309,"In_alpha":25,"Completed":50,"Compromised":4,"Broken":2,"date":"2014-12-01T08:00:00.000Z"},{"Completed":52,"Not_implemented":311,"In_alpha":25,"Compromised":4,"Broken":2,"date":"2015-01-01T08:00:00.000Z"},{"Completed":64,"Not_implemented":309,"In_alpha":25,"Compromised":4,"Broken":8,"date":"2015-02-01T08:00:00.000Z"},{"Not_implemented":310,"In_alpha":27,"Completed":64,"Compromised":4,"Broken":8,"date":"2015-03-01T08:00:00.000Z"},{"Not_implemented":313,"In_alpha":27,"Completed":64,"Compromised":4,"Broken":8,"date":"2015-04-01T07:00:00.000Z"},{"Not_implemented":314,"In_alpha":27,"Completed":65,"Compromised":4,"Broken":8,"date":"2015-05-01T07:00:00.000Z"},{"Compromised":5,"Not_implemented":314,"In_alpha":27,"Completed":65,"Broken":9,"date":"2015-06-01T07:00:00.000Z"},{"Not_implemented":318,"Compromised":5,"In_alpha":27,"Completed":65,"Broken":10,"date":"2015-07-01T07:00:00.000Z"},{"Not_implemented":316,"Compromised":5,"In_alpha":27,"Completed":66,"Broken":11,"date":"2015-08-01T07:00:00.000Z"},{"In_alpha":29,"Not_implemented":320,"Compromised":5,"Completed":67,"Broken":11,"date":"2015-09-01T07:00:00.000Z"},{"Not_implemented":340,"In_alpha":30,"Compromised":5,"Completed":67,"Broken":12,"date":"2015-10-01T07:00:00.000Z"},{"Not_implemented":345,"In_alpha":30,"Compromised":5,"Completed":67,"Broken":12,"date":"2015-11-01T07:00:00.000Z"},{"Not_implemented":345,"In_alpha":30,"Compromised":5,"Completed":67,"Broken":12,"date":"2015-12-01T08:00:00.000Z"},{"Not_implemented":346,"In_alpha":30,"Compromised":5,"Completed":68,"Broken":13,"date":"2016-01-01T08:00:00.000Z"},{"Not_implemented":344,"Completed":71,"In_alpha":30,"Compromised":5,"Broken":19,"date":"2016-02-01T08:00:00.000Z"},{"Not_implemented":352,"In_alpha":31,"Completed":71,"Compromised":5,"Broken":19,"date":"2016-03-01T08:00:00.000Z"},{"Completed":74,"Not_implemented":361,"In_alpha":31,"Compromised":5,"Broken":19,"date":"2016-04-01T07:00:00.000Z"},{"Not_implemented":363,"Completed":74,"In_alpha":31,"Compromised":5,"Broken":19,"date":"2016-05-01T07:00:00.000Z"},{"Completed":76,"Not_implemented":361,"In_alpha":31,"Compromised":5,"Broken":20,"date":"2016-06-01T07:00:00.000Z"},{"Completed":78,"Not_implemented":359,"In_alpha":31,"Compromised":5,"Broken":20,"date":"2016-07-01T07:00:00.000Z"},{"Not_implemented":360,"Completed":78,"In_alpha":31,"Compromised":5,"Broken":20,"date":"2016-08-01T07:00:00.000Z"},{"Not_implemented":384,"In_alpha":35,"Compromised":6,"Completed":79,"Broken":20,"date":"2016-09-01T07:00:00.000Z"},{"In_alpha":36,"Not_implemented":385,"Compromised":6,"Completed":79,"Broken":20,"date":"2016-10-01T07:00:00.000Z"},{"Not_implemented":388,"In_alpha":36,"Compromised":6,"Completed":79,"Broken":20,"Stagnant":3,"date":"2016-11-01T07:00:00.000Z"},{"Not_implemented":371,"In_alpha":36,"Compromised":6,"Completed":80,"Broken":21,"Stagnant":19,"date":"2016-12-01T08:00:00.000Z"},{"Not_implemented":358,"In_alpha":36,"Compromised":6,"Completed":82,"Broken":21,"Stagnant":31,"date":"2017-01-01T08:00:00.000Z"},{"Not_implemented":350,"In_alpha":36,"Compromised":6,"Completed":84,"Broken":27,"Stagnant":33,"date":"2017-02-01T08:00:00.000Z"},{"Not_implemented":352,"In_alpha":36,"Compromised":6,"Completed":84,"Broken":27,"Stagnant":33,"date":"2017-03-01T08:00:00.000Z"},{"Not_implemented":344,"In_alpha":36,"Compromised":6,"Broken":32,"Completed":85,"Stagnant":35,"date":"2017-04-01T07:00:00.000Z"},{"Not_implemented":340,"Broken":34,"In_alpha":36,"Compromised":6,"Completed":85,"Stagnant":38,"date":"2017-05-01T07:00:00.000Z"},{"Not_implemented":334,"Broken":34,"In_alpha":36,"Compromised":6,"Completed":85,"Stagnant":44,"date":"2017-06-01T07:00:00.000Z"},{"Not_implemented":325,"Broken":34,"In_alpha":36,"Compromised":6,"Completed":85,"Stagnant":54,"date":"2017-07-01T07:00:00.000Z"},{"In_alpha":37,"Completed":87,"Not_implemented":321,"Broken":35,"Compromised":6,"Stagnant":56,"date":"2017-08-01T07:00:00.000Z"},{"Completed":88,"Not_implemented":321,"In_alpha":37,"Broken":35,"Compromised":6,"Stagnant":59,"date":"2017-09-01T07:00:00.000Z"},{"Completed":88,"Not_implemented":318,"In_alpha":37,"Broken":35,"Compromised":6,"Stagnant":62,"date":"2017-10-01T07:00:00.000Z"},{"Not_implemented":305,"Completed":94,"In_alpha":37,"Broken":44,"Compromised":6,"Stagnant":64,"date":"2017-11-01T07:00:00.000Z"},{"Not_implemented":307,"Completed":95,"In_alpha":37,"Broken":44,"Compromised":6,"Stagnant":64,"date":"2017-12-01T08:00:00.000Z"},{"In_alpha":38,"Not_implemented":294,"Completed":100,"Broken":47,"Compromised":6,"Stagnant":71,"date":"2018-01-01T08:00:00.000Z"},{"In_alpha":38,"Not_implemented":287,"Completed":100,"Broken":47,"Compromised":6,"Stagnant":78,"date":"2018-02-01T08:00:00.000Z"},{"Not_implemented":264,"In_alpha":38,"Completed":100,"Broken":50,"Compromised":6,"Stagnant":100,"date":"2018-03-01T08:00:00.000Z"},{"Not_implemented":251,"In_alpha":38,"Completed":101,"Broken":50,"Compromised":6,"Stagnant":120,"date":"2018-04-01T07:00:00.000Z"},{"Not_implemented":233,"In_alpha":38,"Completed":102,"Broken":50,"Compromised":6,"Stagnant":140,"date":"2018-05-01T07:00:00.000Z"},{"Not_implemented":209,"In_alpha":38,"Completed":102,"Broken":50,"Compromised":6,"Stagnant":164,"date":"2018-06-01T07:00:00.000Z"},{"Not_implemented":181,"In_alpha":38,"Completed":103,"Broken":54,"Compromised":6,"Stagnant":188,"date":"2018-07-01T07:00:00.000Z"}
    ]; 
    var brokenArray = [], stagnantArray = [], notimplementedArray = [], inalphaArray = [], compromisedArray = [], completedArray = [], labels = [];
    //build data arrays
    for (var _i = 0, History_1 = History; _i < History_1.length; _i++) {
        var month = History_1[_i];
        switch (para_Type) {
            default:
                brokenArray.push(month.Broken);
                stagnantArray.push(month.Stagnant);
                notimplementedArray.push(month.Not_implemented);
                inalphaArray.push(month.In_alpha);
                compromisedArray.push(month.Compromised);
                completedArray.push(month.Completed);
                break;
            case "Broken":
                brokenArray.push(month.Broken);
                break;
            case "Stagnant":
                stagnantArray.push(month.Stagnant);
                break;
            case "Not implemented":
                notimplementedArray.push(month.Not_implemented);
                break;
            case "In alpha":
                inalphaArray.push(month.In_alpha);
                break;
            case "Compromised":
                compromisedArray.push(month.Compromised);
                break;
            case "Completed":
                completedArray.push(month.Completed);
                break;
        }
        //Labels always needed to mark each tick on the graph
        labels.push(month.date);
    }
    //Charts Data
    var ctx = document.getElementById("timechart");
    var data = {
        labels: labels,
        datasets: [{
                label: "Broken",
                backgroundColor: "#f2dede",
                borderColor: "#c56d6d",
                borderWidth: 1,
                data: brokenArray,
                spanGaps: true,
            }, {
                label: "Stagnant",
                backgroundColor: "#fcddc4",
                borderColor: "#f5903d",
                data: stagnantArray
            }, {
                label: "Not implemented",
                backgroundColor: "#fcf8e3",
                borderColor: "#ecd046",
                data: notimplementedArray
            }, {
                label: "In alpha",
                backgroundColor: "#d9edf7",
                borderColor: "#57afdb",
                data: inalphaArray
            }, {
                label: "Compromised",
                backgroundColor: "#ccdde8",
                borderColor: "#72a1c0",
                data: compromisedArray
            }, {
                label: "Completed",
                backgroundColor: "#dff0d8",
                borderColor: "#86c66c",
                data: completedArray
            }]
    };
    //add any shared elements to all datasets
    for (var i = 0; i < data.datasets.length; i++) {
        data.datasets[i].borderWidth = 1;
        data.datasets[i].pointRadius = 1;
        data.datasets[i].pointHitRadius = 10;
        data.datasets[i].pointHoverRadius = 6;
        data.datasets[i].pointHoverBorderWidth = 3;
    }
    //update chart data if already created
    if (typeof (AllChart) == "object") {
        AllChart.config.data = data;
        AllChart.update();
    }
    else {
        // console.log("Created empty chart");
        Chart.defaults.global.legend.display = false;
        AllChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                tooltips: {
                    mode: "label",
                    position: "nearest",
                    callbacks: {
                        title: function(data) {
                            return moment(data["0"].xLabel).format("MMMM YYYY");
                        }
                    }
                },
                scales: {
                    xAxes: [{   stacked: true, 
                                ticks: {autoSkip: false},
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        'millisecond': 'MMM YYYY',
                                        'second': 'MMM YYYY',
                                        'minute': 'MMM YYYY',
                                        'hour': 'MMM YYYY',
                                        'day': 'MMM YYYY',
                                        'week': 'MMM YYYY',
                                        'month': 'MMM YYYY',
                                        'quarter': 'MMM YYYY',
                                        'year': 'MMM YYYY',
                                    }
                                }
                           }],
                    yAxes: [{stacked: true}]
                }
            }
        });
    }
}
//Build AllChart with default input
Build_and_fill_Chart();
