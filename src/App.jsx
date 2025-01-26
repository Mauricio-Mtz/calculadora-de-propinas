import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [totalTip, setTotalTip] = useState('')
  const [totalAttendees, setTotalAttendees] = useState('')
  const [tipForDay, setTipForDay] = useState([
    {day: 'Domingo', amount: '', attendees: 0, individualTip: 0},
    {day: 'Lunes', amount: '', attendees: 0, individualTip: 0},
    {day: 'Martes', amount: '', attendees: 0, individualTip: 0},
    {day: 'Miercoles', amount: '', attendees: 0, individualTip: 0},
    {day: 'Jueves', amount: '', attendees: 0, individualTip: 0},
    {day: 'Viernes', amount: '', attendees: 0, individualTip: 0},
    {day: 'Sabado', amount: '', attendees: 0, individualTip: 0},
  ])
  const [attendees, setAttendees] = useState([
    { 
      name: '', 
      days: [
        { day: 'Domingo', attended: false },
        { day: 'Lunes', attended: false },
        { day: 'Martes', attended: false },
        { day: 'Miercoles', attended: false },
        { day: 'Jueves', attended: false },
        { day: 'Viernes', attended: false },
        { day: 'Sabado', attended: false }
      ],
      totalTip: 0
    }
  ])

  // Update total tip per day per attendee when relevant states change
  useEffect(() => {
    const calculateTips = () => {
      const updatedTipForDay = tipForDay.map((dayTip, index) => ({
        ...dayTip,
        amount: dayTip.amount === '' ? 0 : parseFloat(dayTip.amount),
        individualTip: dayTip.attendees > 0 ? parseFloat(((dayTip.amount || 0) / dayTip.attendees).toFixed(2)) : 0
      }))
      setTipForDay(updatedTipForDay)

      const updatedAttendees = attendees.map(attendee => {
        let totalTip = 0
        updatedTipForDay.forEach((dayTip, index) => {
          if (attendee.days[index].attended && dayTip.attendees > 0) {
            totalTip += dayTip.amount / dayTip.attendees
          }
        })
        return { ...attendee, totalTip: parseFloat(totalTip.toFixed(2)) }
      })
      setAttendees(updatedAttendees)
    }

    calculateTips()
  }, [tipForDay, totalAttendees])

  // Update total attendees for each day when day attendance changes
  const updateDayAttendees = () => {
    const newTipForDay = tipForDay.map((day, dayIndex) => ({
      ...day,
      attendees: attendees.filter(attendee => 
        attendee.days[dayIndex].attended
      ).length
    }))
    setTipForDay(newTipForDay)
  }

  // Ensure attendees array matches total attendees
  useEffect(() => {
    const parsedTotalAttendees = totalAttendees === '' ? 2 : parseInt(totalAttendees)
    if (attendees.length < parsedTotalAttendees) {
      const newAttendees = [...attendees]
      while (newAttendees.length < parsedTotalAttendees) {
        newAttendees.push({ 
          name: '', 
          days: [
            { day: 'Domingo', attended: false },
            { day: 'Lunes', attended: false },
            { day: 'Martes', attended: false },
            { day: 'Miercoles', attended: false },
            { day: 'Jueves', attended: false },
            { day: 'Viernes', attended: false },
            { day: 'Sabado', attended: false }
          ],
          totalTip: 0
        })
      }
      setAttendees(newAttendees)
    } else if (attendees.length > parsedTotalAttendees) {
      setAttendees(attendees.slice(0, parsedTotalAttendees))
    }
  }, [totalAttendees])

  return (
    <div className="container mx-auto max-w-md p-2">
      <div className="flex flex-col gap-4">
        {/* Total Tip Input */}
        <div className='grid grid-cols-2 gap-2 border rounded-lg p-2'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm'>Total de propina</label>
            <input 
              className='bg-amber-100 text-black p-2 rounded-md text-center' 
              type="number" 
              placeholder="0"
              value={totalTip}
              onChange={(e) => setTotalTip(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm'>Total de asistentes</label>
            <input
              className='bg-amber-100 text-black p-2 rounded-md text-center'
              type="number"
              placeholder="2"
              value={totalAttendees}
              onChange={(e) => setTotalAttendees(e.target.value)}
            />
          </div>
        </div>

        {/* Daily Tip Breakdown */}
        <div className='border rounded-lg p-2'>
          <h2 className="text-lg font-bold mb-2 text-center">Propina por día</h2>
          <div className='space-y-2'>
            {tipForDay.map((tip, index) => (
              <div key={index} className='grid grid-cols-3 gap-2 items-center'>
                <div className='text-center'>
                  <label className='block text-sm mb-1'>{tip.day}</label>
                  <input
                    className='bg-amber-100 text-black p-1 w-full text-center rounded-md'
                    type="number"
                    placeholder="Propina"
                    value={tip.amount}
                    onChange={(e) => {
                      const newTipForDay = [...tipForDay]
                      newTipForDay[index].amount = e.target.value
                      setTipForDay(newTipForDay)
                    }}
                  />
                </div>
                <div className='text-center'>
                  <label className='block text-sm mb-1'>Asistentes</label>
                  <input 
                    className='bg-amber-100 text-black p-1 w-full text-center rounded-md'
                    type="text" 
                    value={tip.attendees}
                    disabled
                  />
                </div>
                <div className='text-center'>
                  <label className='block text-sm mb-1'>Individual</label>
                  <input 
                    className='bg-amber-100 text-black p-1 w-full text-center rounded-md'
                    type="text" 
                    value={"$" + tip.individualTip.toFixed(2)}
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendee Details */}
        <div className='border rounded-lg p-2'>
          <h2 className="text-lg font-bold mb-2 text-center">Detalles de Colaboradores</h2>
          {attendees.map((attendee, index) => (
            <div key={index} className='border-b pb-2 mb-2'>
              <div className='grid grid-cols-2 gap-2 mb-2'>
                <div className='flex flex-col'>
                  <label className='text-sm'>Nombre</label>
                  <input
                    className='bg-amber-100 text-black p-2 rounded-md'
                    type="text"
                    placeholder="Nombre"
                    value={attendee.name}
                    onChange={(e) => {
                      const newAttendees = [...attendees]
                      newAttendees[index].name = e.target.value
                      setAttendees(newAttendees)
                    }}
                  />
                </div>
                <div className='flex flex-col'>
                  <label className='text-sm'>Propina Total</label>
                  <input
                    className='bg-amber-100 text-black p-2 text-center rounded-md'
                    type="text"
                    value={"$" + attendee.totalTip.toFixed(2)}
                    readOnly
                  />
                </div>
              </div>
              <div className='flex flex-wrap gap-2 justify-center'>
                {attendee.days.map((day, dayIndex) => (
                  <div key={dayIndex} className='flex items-center'>
                    <input
                      type="checkbox"
                      id={`${index}-${dayIndex}`}
                      checked={day.attended}
                      onChange={(e) => {
                        const newAttendees = [...attendees]
                        newAttendees[index].days[dayIndex].attended = e.target.checked
                        setAttendees(newAttendees)
                        updateDayAttendees()
                      }}
                    />
                    <label htmlFor={`${index}-${dayIndex}`} className='ml-1 text-sm'>{day.day}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App