(function () {
    angular.module("pick-a-park").controller("municipalityAnalyticsCtrl", municipalityAnalyticsCtrl);
    municipalityAnalyticsCtrl.$inject = ["$window", "$location", "$routeParams", "$scope", "authentication", "stopService", "parkingService"];
    function municipalityAnalyticsCtrl($window, $location, $routeParams, $scope, authentication, stopService, parkingService) {

        var vm = this;
        vm.parkingCompany = $routeParams.name;
        vm.parkingId = $routeParams.id;
        vm.parking = {}; //Current parking
        vm.parkingStops = []; //Current parking stops

        //Init data for doughnut chart
        const doughnutChartData = [
            { label: "Sunday", value: 0 },
            { label: "Monday", value: 0 },
            { label: "Tuesday", value: 0 },
            { label: "Wednesday", value: 0 },
            { label: "Thursday", value: 0 },
            { label: "Friday", value: 0 },
            { label: "Saturday", value: 0 }
        ];

        //Init data for column chart
        const columnChartData = [
            { label: "Sun", value: 0 },
            { label: "Mon", value: 0 },
            { label: "Tue", value: 0 },
            { label: "Wed", value: 0 },
            { label: "Thu", value: 0 },
            { label: "Fri", value: 0 },
            { label: "Sat", value: 0 }
        ];

        initController();

        function initController() {
            //Retrieve parking data
            parkingService.getParking(vm.parkingCompany, vm.parkingId).then(function (result) {
                vm.parking = result;
            }).then(function () {
                //Retrieve completed stops
                stopService.getStops(vm.parkingCompany).then(function (stops) {
                    stops.forEach(s => {
                        if (s.parkingId == vm.parkingId && s.end != null)
                            vm.parkingStops.push(s);
                    });
                }).then(function () {
                    initChartData();
                })
            })
        }

        //Initialize charts
        function initChartData() {
            //Total number of stops per day
            var numberOfStops = [0, 0, 0, 0, 0, 0, 0];
            //Total stop duration per day (minutes)
            var totDuration = [0, 0, 0, 0, 0, 0, 0];

            vm.parkingStops.forEach(stop => {
                var startDate = new Date(stop.start);
                var d = (Math.abs(new Date(stop.end) - new Date(stop.start)) / 3600000).toFixed(2);
                var duration = parseFloat(d);
                var dayOfWeek = startDate.getDay();//0 = sunday, 1 = monday ...

                numberOfStops[dayOfWeek] = numberOfStops[dayOfWeek] + 1;
                totDuration[dayOfWeek] = totDuration[dayOfWeek] + duration;
            });

            for (let index = 0; index < numberOfStops.length; index++) {
                //Average stop usage
                doughnutChartData[index].value = numberOfStops[index];
                //Average stop time
                columnChartData[index].value = totDuration[index] / numberOfStops[index];
            }
            //Render charts
            doughnutChartConfig.data = doughnutChartData;
            columnChartConfig.data = columnChartData;
            var doughnutChartInstance = new FusionCharts(doughnutChartConfig);
            var columnChartInstance = new FusionCharts(columnChartConfig);
            doughnutChartInstance.render()
            columnChartInstance.render();
        }


        const doughnutChartConfig = {

            type: "doughnut2d",
            renderAt: "doughnut-chart-container",
            width: "90%",
            height: "400",
            dataFormat: "json",
            dataSource: {
                chart: {
                    caption: "Parking Usage",
                    subCaption: "Average parking usage during the week",
                    showpercentvalues: "1",
                    showBorder: "1",
                    defaultcenterlabel: "Parking Usage",
                    aligncaptionwithcanvas: "0",
                    captionpadding: "0",
                    decimals: "1",
                    plottooltext:
                        "<b>$percentValue</b> of stops happen on <b>$label</b>",
                    centerlabel: "# Stops: $value",
                    theme: "candy"
                },
                data: doughnutChartData
            }
        };

        const columnChartConfig = {
            type: "column2d",
            renderAt: "column-chart-container",
            width: "90%",
            height: "400",
            dataFormat: "json",
            dataSource: {
                chart: {
                    caption: "Parking Stop Time",
                    subCaption: "Average stop time during the week",
                    xAxisName: "Day",
                    yAxisName: "Time",
                    numberSuffix: " hr",
                    showBorder: "1",
                    theme: "candy"
                },
                data: columnChartData
            }
        };
    }
})();