import React from "react"

function TimeDisplay({ timeInSeconds }) {
  const hours = Math.floor(timeInSeconds / 3600) // Получаем количество часов
  const minutes = Math.floor((timeInSeconds % 3600) / 60) // Получаем количество минут

  let displayTime
  if (hours > 0) {
    displayTime = `${hours} ч ${minutes} мин`
  } else {
    displayTime = `${minutes} мин`
  }

  return <span>{displayTime}</span>
}

export default TimeDisplay
