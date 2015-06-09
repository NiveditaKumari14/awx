/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import smartStatusController from 'tower/smart-status/smart-status.controller';
export default [  function() {
    return {
        scope: {
            jobs: '='
        },
        restrict: 'E',
        link: function (scope, element){
            scope.formatter = function(sparklines, options, point){
                var status = options.userOptions.tooltipValueLookups.status[point.offset],
                finished = options.userOptions.tooltipValueLookups.finished[point.offset];
                //capitalize first letter
                if (status) {
                    status = status.charAt(0).toUpperCase() + status.slice(1);
                    var tooltip = "<div class=\"smart-status-tooltip\">Job ID: " +
                      options.userOptions.tooltipValueLookups.jobs[point.offset] +
                      "<br>Status: <span style=\"color: " + point.color + "\">&#9679;</span>"+status;
                    if (finished !== "running") {
                        tooltip += "<br>Finished: " + finished +"</div>" ;
                    }
                    return tooltip;
                }
            };

            element.sparkline(scope.sparkArray, {
                type: 'tristate',
                width: '4em',
                height: '2em',
                barWidth: 7,
                barSpacing: 2,
                zeroBarColor: 'grey',
                posBarColor: '#60D66F',
                negBarColor: '#ff5850',
                tooltipFormatter: scope.formatter,
                tooltipFormat: '{{value:jobs}}',
                tooltipValueLookups: {
                    jobs: scope.jobIds,
                    status: scope.smartStatus,
                    finished: scope.finished
                }
            });

            element.bind('sparklineClick', function(ev) {
                var sparkline = ev.sparklines[0],
                    job = sparkline.getCurrentRegionFields(),
                    id;
                id = sparkline.options.userOptions.tooltipValueLookups.jobs[job.offset];
                if(id === undefined){
                    return;
                }
                else {
                    location.href = '/#/jobs/' + id;
                }
            });

        },
        controller: smartStatusController
    };
}];
