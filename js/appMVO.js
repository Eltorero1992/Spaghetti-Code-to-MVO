/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */

(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

/* =========== Model =========== */

(function() {

    const model = {

        init : function () {
            return JSON.parse(localStorage.attendance)
        }
    }

/* =========== Octopus =========== */

    const octopus = {

        init : function () {
            model.init();
            view.init();
            this.countMissing();
            this.checkBoxes();
        },

        checkBoxes : function () {
            let attendance = model.init();

            $.each(attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });
        },

        countMissing : function() {

            const allMissed = view.getAllMissed()

            allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });

                $(this).text(numMissed);
            });
        }
    }

/* =========== View =========== */

    const view = {

        init: function () {
            const allMissed = this.getAllMissed();
            const allCheckboxes = this.getAllCheckboxes();

            allCheckboxes.on('click', function() {

                var studentRows = $('tbody .student'),
                newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text(),
                    allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });
                octopus.countMissing();
                localStorage.attendance = JSON.stringify(newAttendance);
            });
        },

        getAllMissed : function () {
         return $('tbody .missed-col');
       },

       getAllCheckboxes : function () {
        return $('tbody input');
       }
    }

octopus.init()


}())

