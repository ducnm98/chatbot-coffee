var moment = require('moment');
module.exports = {
    getTime: () => {
        let today = new Date(moment().utc(7))
        let hour = today.getHours();
        let mins = today.getMinutes();
        let chooseTime = [];
        let maxHours = 20;
        
        if (mins >= 0 && mins < 15) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`từ ${i}:15 đến ${i}:30`)
            }
        }
        if (mins >= 15 && mins < 30) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`từ ${i}:30 đến ${i}:45`)
            }
        }

        if (mins >= 30 && mins < 45) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`từ ${i}:45 đến ${i + 1}:00`)
            }
        }

        if (mins >= 45 && mins <= 59) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`từ ${i+1}:00 đến ${i+1}:15`)
            }
        }

        return chooseTime
    }
}