module.exports = {
    getTime: () => {
        let today = new Date();
        let hour = today.getHours();
        let mins = today.getMinutes();
        let chooseTime = [];
        let maxHours = 20;
        
        if (mins >= 0 && mins < 15) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`${i}:15 - ${i}:30`)
            }
        }
        if (mins >= 15 && mins < 30) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`${i}:30 - ${i}:45`)
            }
        }

        if (mins >= 30 && mins < 45) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`${i}:45 - ${i + 1}:00`)
            }
        }

        if (mins >= 45 && mins <= 59) {
            for (let i = hour; i <= maxHours; i++) {
                chooseTime.push(`${i+1}:00 - ${i+1}:15`)
            }
        }

        return chooseTime
    }
}