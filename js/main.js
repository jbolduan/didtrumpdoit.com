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
    var kickstarterended = moment('2012-11-19');
		$('#days-since-kickstarter').html(today.diff(kickstarterended, 'days') > 0 ? today.diff(kickstarterended, 'days') : 0);
		$('#years-since-kickstarter').html(today.diff(kickstarterended, 'years') > 0 ? today.diff(kickstarterended, 'years') : 0);

    //Always show tooltip on confidence-btn
    //$('#confidence-btn').tooltip('show');
    
    // Select and replace maintained by name
    var maintainers = ["SomethingAwful Goons", "Low I.Q. Individuals Who Haven't Got a Clue", "Lowlifes With Zero Credibility", "Celestial Body Construction Team 09", "CryTek Legal Beagles", "Coutts & Co.", "10% for the Cayman", "Bitter EvE Goons", "Salty Asshats", "Goons stuck in checkmate", "T-posed Goons", "MY GIRLFRIEND", "The Fourth Stimpire", "WaffleImages", "COBOL Greybeards", "Blocked Buddies", "Thanks notepad", "Archive-Priests™", "Ryan Archer"]
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
      {"In_alpha":2,"Not_implemented":14,"Completed":1,"date":"2012-11-01T07:00:00.000Z"},{"Not_implemented":44,"Compromised":1,"Completed":7,"In_alpha":3,"date":"2012-12-01T08:00:00.000Z"},{"Not_implemented":44,"Compromised":1,"Completed":7,"In_alpha":3,"date":"2013-01-01T08:00:00.000Z"},{"Completed":8,"Not_implemented":45,"Compromised":1,"In_alpha":3,"date":"2013-02-01T08:00:00.000Z"},{"Completed":9,"Not_implemented":46,"Compromised":1,"In_alpha":3,"date":"2013-03-01T08:00:00.000Z"},{"In_alpha":4,"Not_implemented":47,"Completed":9,"Compromised":1,"date":"2013-04-01T07:00:00.000Z"},{"Not_implemented":54,"In_alpha":4,"Completed":9,"Compromised":1,"date":"2013-05-01T07:00:00.000Z"},{"Completed":11,"In_alpha":5,"Not_implemented":55,"Compromised":1,"date":"2013-06-01T07:00:00.000Z"},{"Not_implemented":66,"In_alpha":6,"Completed":11,"Compromised":1,"date":"2013-07-01T07:00:00.000Z"},{"Not_implemented":68,"In_alpha":6,"Completed":11,"Compromised":1,"date":"2013-08-01T07:00:00.000Z"},{"Not_implemented":70,"In_alpha":6,"Completed":11,"Compromised":1,"date":"2013-09-01T07:00:00.000Z"},{"Not_implemented":73,"Completed":12,"In_alpha":6,"Compromised":1,"date":"2013-10-01T07:00:00.000Z"},{"In_alpha":7,"Not_implemented":74,"Completed":12,"Compromised":1,"date":"2013-11-01T07:00:00.000Z"},{"Not_implemented":82,"In_alpha":7,"Completed":12,"Compromised":1,"date":"2013-12-01T08:00:00.000Z"},{"Completed":17,"Not_implemented":90,"In_alpha":9,"Compromised":1,"date":"2014-01-01T08:00:00.000Z"},{"Not_implemented":113,"Completed":29,"In_alpha":13,"Compromised":2,"Broken":1,"date":"2014-02-01T08:00:00.000Z"},{"Not_implemented":133,"In_alpha":15,"Completed":32,"Compromised":2,"Broken":1,"date":"2014-03-01T08:00:00.000Z"},{"Not_implemented":162,"In_alpha":20,"Completed":34,"Compromised":2,"Broken":1,"date":"2014-04-01T07:00:00.000Z"},{"Not_implemented":186,"Completed":37,"In_alpha":25,"Compromised":2,"Broken":1,"date":"2014-05-01T07:00:00.000Z"},{"Not_implemented":212,"Compromised":3,"In_alpha":27,"Completed":37,"Broken":1,"date":"2014-06-01T07:00:00.000Z"},{"Not_implemented":244,"Completed":40,"Compromised":3,"In_alpha":27,"Broken":2,"date":"2014-07-01T07:00:00.000Z"},{"In_alpha":28,"Not_implemented":256,"Completed":41,"Compromised":3,"Broken":2,"date":"2014-08-01T07:00:00.000Z"},{"Not_implemented":273,"Completed":44,"In_alpha":30,"Compromised":3,"Broken":2,"date":"2014-09-01T07:00:00.000Z"},{"Not_implemented":275,"In_alpha":31,"Completed":45,"Compromised":3,"Broken":2,"date":"2014-10-01T07:00:00.000Z"},{"Not_implemented":276,"In_alpha":31,"Completed":46,"Compromised":3,"Broken":2,"date":"2014-11-01T07:00:00.000Z"},{"Not_implemented":289,"In_alpha":33,"Completed":48,"Compromised":4,"Broken":2,"date":"2014-12-01T08:00:00.000Z"},{"Completed":49,"Not_implemented":291,"In_alpha":33,"Compromised":4,"Broken":2,"date":"2015-01-01T08:00:00.000Z"},{"Completed":56,"Not_implemented":284,"In_alpha":33,"Compromised":4,"Broken":8,"date":"2015-02-01T08:00:00.000Z"},{"In_alpha":35,"Completed":56,"Not_implemented":284,"Compromised":4,"Broken":8,"date":"2015-03-01T08:00:00.000Z"},{"Not_implemented":287,"In_alpha":35,"Completed":56,"Compromised":4,"Broken":8,"date":"2015-04-01T07:00:00.000Z"},{"Not_implemented":291,"In_alpha":35,"Completed":56,"Compromised":4,"Broken":8,"date":"2015-05-01T07:00:00.000Z"},{"Compromised":5,"Not_implemented":291,"In_alpha":35,"Completed":56,"Broken":9,"date":"2015-06-01T07:00:00.000Z"},{"Not_implemented":295,"Compromised":5,"In_alpha":35,"Completed":56,"Broken":10,"date":"2015-07-01T07:00:00.000Z"},{"Not_implemented":294,"Compromised":5,"In_alpha":35,"Completed":56,"Broken":11,"date":"2015-08-01T07:00:00.000Z"},{"In_alpha":37,"Not_implemented":299,"Compromised":5,"Completed":56,"Broken":11,"date":"2015-09-01T07:00:00.000Z"},{"Not_implemented":319,"In_alpha":38,"Compromised":5,"Completed":56,"Broken":12,"date":"2015-10-01T07:00:00.000Z"},{"Not_implemented":324,"In_alpha":38,"Compromised":5,"Completed":56,"Broken":12,"date":"2015-11-01T07:00:00.000Z"},{"Not_implemented":327,"In_alpha":38,"Compromised":5,"Completed":56,"Broken":12,"date":"2015-12-01T08:00:00.000Z"},{"Not_implemented":329,"In_alpha":38,"Compromised":5,"Completed":56,"Broken":13,"date":"2016-01-01T08:00:00.000Z"},{"Not_implemented":328,"Completed":57,"In_alpha":38,"Compromised":5,"Broken":19,"date":"2016-02-01T08:00:00.000Z"},{"Not_implemented":336,"In_alpha":39,"Completed":57,"Compromised":5,"Broken":19,"date":"2016-03-01T08:00:00.000Z"},{"Not_implemented":345,"In_alpha":40,"Completed":57,"Compromised":5,"Broken":19,"date":"2016-04-01T07:00:00.000Z"},{"Not_implemented":347,"In_alpha":40,"Completed":57,"Compromised":5,"Broken":19,"date":"2016-05-01T07:00:00.000Z"},{"Completed":59,"Not_implemented":345,"In_alpha":40,"Compromised":5,"Broken":20,"date":"2016-06-01T07:00:00.000Z"},{"Completed":60,"Not_implemented":344,"In_alpha":40,"Compromised":5,"Broken":20,"date":"2016-07-01T07:00:00.000Z"},{"Not_implemented":345,"Completed":60,"In_alpha":40,"Compromised":5,"Broken":20,"date":"2016-08-01T07:00:00.000Z"},{"Not_implemented":362,"In_alpha":44,"Compromised":6,"Completed":60,"Broken":20,"date":"2016-09-01T07:00:00.000Z"},{"In_alpha":45,"Not_implemented":363,"Compromised":6,"Completed":60,"Broken":20,"date":"2016-10-01T07:00:00.000Z"},{"Not_implemented":365,"In_alpha":45,"Compromised":6,"Completed":60,"Broken":20,"Stagnant":3,"date":"2016-11-01T07:00:00.000Z"},{"Not_implemented":349,"In_alpha":45,"Compromised":6,"Completed":60,"Broken":21,"Stagnant":19,"date":"2016-12-01T08:00:00.000Z"},{"Not_implemented":337,"In_alpha":45,"Compromised":6,"Completed":60,"Broken":21,"Stagnant":31,"date":"2017-01-01T08:00:00.000Z"},{"Not_implemented":329,"In_alpha":45,"Compromised":6,"Completed":62,"Broken":27,"Stagnant":32,"date":"2017-02-01T08:00:00.000Z"},{"Not_implemented":331,"In_alpha":45,"Compromised":6,"Completed":62,"Broken":27,"Stagnant":32,"date":"2017-03-01T08:00:00.000Z"},{"Not_implemented":329,"In_alpha":45,"Compromised":6,"Completed":62,"Broken":28,"Stagnant":33,"date":"2017-04-01T07:00:00.000Z"},{"Not_implemented":325,"Broken":30,"In_alpha":45,"Compromised":6,"Completed":62,"Stagnant":35,"date":"2017-05-01T07:00:00.000Z"},{"Not_implemented":320,"Broken":30,"In_alpha":45,"Compromised":6,"Completed":62,"Stagnant":40,"date":"2017-06-01T07:00:00.000Z"},{"Not_implemented":310,"Broken":30,"In_alpha":45,"Compromised":6,"Completed":62,"Stagnant":50,"date":"2017-07-01T07:00:00.000Z"},{"In_alpha":46,"Broken":31,"Not_implemented":307,"Compromised":6,"Completed":63,"Stagnant":51,"date":"2017-08-01T07:00:00.000Z"},{"Not_implemented":307,"In_alpha":46,"Broken":31,"Compromised":6,"Completed":63,"Stagnant":53,"date":"2017-09-01T07:00:00.000Z"},{"Not_implemented":305,"In_alpha":46,"Broken":31,"Compromised":6,"Completed":63,"Stagnant":55,"date":"2017-10-01T07:00:00.000Z"},{"Not_implemented":298,"In_alpha":46,"Broken":32,"Completed":69,"Compromised":6,"Stagnant":57,"date":"2017-11-01T07:00:00.000Z"},{"Not_implemented":298,"In_alpha":46,"Broken":32,"Completed":70,"Compromised":6,"Stagnant":57,"date":"2017-12-01T08:00:00.000Z"},{"Not_implemented":290,"In_alpha":47,"Broken":35,"Completed":70,"Compromised":6,"Stagnant":64,"date":"2018-01-01T08:00:00.000Z"},{"Not_implemented":283,"In_alpha":47,"Broken":35,"Completed":70,"Compromised":6,"Stagnant":72,"date":"2018-02-01T08:00:00.000Z"},{"Not_implemented":259,"In_alpha":47,"Broken":38,"Completed":70,"Compromised":6,"Stagnant":94,"date":"2018-03-01T08:00:00.000Z"},{"Completed":71,"Not_implemented":246,"In_alpha":47,"Broken":38,"Compromised":6,"Stagnant":114,"date":"2018-04-01T07:00:00.000Z"},{"Not_implemented":223,"Completed":71,"In_alpha":47,"Broken":38,"Compromised":6,"Stagnant":140,"date":"2018-05-01T07:00:00.000Z"},{"Not_implemented":200,"Completed":71,"In_alpha":47,"Broken":38,"Compromised":6,"Stagnant":163,"date":"2018-06-01T07:00:00.000Z"},{"Not_implemented":176,"Completed":71,"In_alpha":47,"Broken":38,"Compromised":6,"Stagnant":187,"date":"2018-07-01T07:00:00.000Z"},{"Not_implemented":146,"Completed":71,"In_alpha":47,"Broken":39,"Compromised":6,"Stagnant":217,"date":"2018-08-01T07:00:00.000Z"},{"In_alpha":48,"Not_implemented":138,"Completed":71,"Broken":39,"Compromised":6,"Stagnant":227,"date":"2018-09-01T07:00:00.000Z"},{"Not_implemented":122,"In_alpha":49,"Completed":71,"Broken":39,"Compromised":6,"Stagnant":244,"date":"2018-10-01T07:00:00.000Z"},{"Not_implemented":126,"In_alpha":49,"Completed":71,"Broken":39,"Compromised":6,"Stagnant":245,"date":"2018-11-01T07:00:00.000Z"},{"Not_implemented":123,"Completed":72,"In_alpha":49,"Broken":39,"Compromised":6,"Stagnant":248,"date":"2018-12-01T08:00:00.000Z"},{"Not_implemented":116,"Completed":72,"In_alpha":49,"Broken":39,"Compromised":6,"Stagnant":257,"date":"2019-01-01T08:00:00.000Z"},{"Not_implemented":114,"Completed":72,"In_alpha":49,"Broken":39,"Compromised":6,"Stagnant":259,"date":"2019-02-01T08:00:00.000Z"},{"Not_implemented":115,"Completed":72,"In_alpha":49,"Broken":39,"Compromised":6,"Stagnant":259,"date":"2019-03-01T08:00:00.000Z"},{"In_alpha":50,"Not_implemented":115,"Completed":72,"Broken":39,"Compromised":6,"Stagnant":259,"date":"2019-04-01T07:00:00.000Z"},{"In_alpha":50,"Not_implemented":115,"Completed":72,"Broken":39,"Compromised":6,"Stagnant":259,"date":"2019-05-01T07:00:00.000Z"},{"In_alpha":50,"Not_implemented":110,"Completed":72,"Broken":39,"Compromised":6,"Stagnant":264,"date":"2019-06-01T07:00:00.000Z"},{"Not_implemented":111,"In_alpha":50,"Completed":72,"Broken":39,"Compromised":6,"Stagnant":264,"date":"2019-07-01T07:00:00.000Z"},{"Not_implemented":106,"In_alpha":50,"Completed":72,"Broken":39,"Compromised":6,"Stagnant":269,"date":"2019-08-01T07:00:00.000Z"},{"Not_implemented":107,"In_alpha":50,"Completed":72,"Broken":39,"Compromised":6,"Stagnant":269,"date":"2019-09-01T07:00:00.000Z"},{"Not_implemented":104,"In_alpha":50,"Completed":72,"Broken":39,"Compromised":6,"Stagnant":273,"date":"2019-10-01T07:00:00.000Z"}]
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
