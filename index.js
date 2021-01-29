(function () {
  const regexClassSchedules = /^([2-7]{1,6})([M|T|N])([1-7]{1,7})$/;

  const mapDays = {
    2: 'SEG',
    3: 'TER',
    4: 'QUA',
    5: 'QUI',
    6: 'SEX',
    7: 'SAB'
  }

  const mapPeriods = {
    'M': [
      { start: '08:00', end: '08:50' },
      { start: '09:00', end: '09:50' },
      { start: '10:00', end: '10:50' },
      { start: '11:00', end: '11:50' },
      { start: '12:00', end: '13:00' }
    ],
    'T': [
      { start: '13:00', end: '13:50' },
      { start: '14:00', end: '14:50' },
      { start: '15:00', end: '15:50' },
      { start: '16:00', end: '16:50' },
      { start: '17:00', end: '17:50' },
      { start: '18:00', end: '18:50' },
      { start: '19:00', end: '19:50' },
    ],
    'N': [
      { start: '19:00', end: '19:50' },
      { start: '20:00', end: '20:40' },
      { start: '20:50', end: '21:40' },
      { start: '21:50', end: '22:30' }
    ]
  }

  fixClassSchedule()

  function getStartAndEndTimeFromSchedule(period, hour, finalHour) {
    const periodArray = mapPeriods[period];
    const startHourIndex = parseInt(hour[0]) - 1
    const endHourIndex = parseInt(hour[finalHour]) - 1
    const startTime = periodArray[startHourIndex].start;
    const endTime = periodArray[endHourIndex].end;
    return { startTime, endTime }
  }

  function parseClassSchedules(classScheduleParams) {
    let { day, period, hour } = classScheduleParams
    const classDay = mapDays[day]
    const finalHour = hour.length - 1;
    const { startTime, endTime } = getStartAndEndTimeFromSchedule(period, hour, finalHour)
    const newSchedule = `<span>${classDay} ${startTime}-${endTime}</span>`
    return newSchedule;
  }
  function fixClassSchedule() {
    let hasScheduleColumn = false;
    let columnIndex = null;
    let columnScheduleElement = null;
    let scheduleTable = null

    $('table thead tr th:contains(Horário)').each(function () {
      hasScheduleColumn = true;
      columnIndex = $(this).index() + 1;
      columnScheduleElement = $(this)
      const firstTh = $(this).siblings().first()
      if (firstTh.attr('colspan')) {
        const colspanValue = firstTh.attr('colspan')
        columnIndex += parseInt(colspanValue) - 1
      }
      scheduleTable = $(this).parents('table')
    })

    if (hasScheduleColumn && scheduleTable) {
      const scheduleSelector = `tbody tr td:nth-child(${columnIndex})`;
      const scheduleElements = scheduleTable.find(scheduleSelector)

      scheduleElements.each(function () {
        const el = $(this)
        let validSchedule = false;
        const popUp = el.find('img')
        const hasPopUp = popUp[0] != undefined && popUp[0].src.includes('ajuda.gif')
        let schedules = null;
        if (hasPopUp) {
          schedules = popUp[0].parentNode.firstChild.nodeValue.trim().replace(/\r/g, "").split(' ')
        } else {
          schedules = el.text().trim().split(' ')
        }
        const newSchedules = []
        for (let i in schedules) {
          let classSchedule = schedules[i].replace(/\r/g, "");
          if (regexClassSchedules.test(classSchedule)) {
            let [match, day, period, hour] = regexClassSchedules.exec(classSchedule)
            validSchedule = true;
            if (day.length == 1) {
              newSchedules.push(parseClassSchedules({ day, period, hour }))
            } else {
              day.split('').map(function (day) {
                newSchedules.push(parseClassSchedules({ day, period, hour }))
              })
            }

          }
        }

        if (validSchedule) {
          el.html(newSchedules.join('<br>'))
        }
        validSchedule = false;
      })
    }
  }
})()