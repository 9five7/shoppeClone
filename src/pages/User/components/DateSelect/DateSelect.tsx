import { range } from 'lodash'
import { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ value, onChange, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value?.getDate(),
        month: value?.getMonth(),
        year: value?.getFullYear()
      })
    }
  }, [value])
  const handChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-4 flex flex-wrap'>
      <div className='w-[20%] truncate  text-right caption-bottom'>Ngày sinh </div>
      <div className='w-[80%] pl-5'>
        <div className='flex justify-between'>
          <select
            onChange={handChange}
            name='date'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange'
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngay</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handChange}
            name='month'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange'
            value={value?.getMonth() || date.month}
          >
            <option disabled>thang</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handChange}
            name='year'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange'
            value={value?.getFullYear() || date.year}
          >
            <option disabled>nam</option>
            {range(1990, 2025).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-500'>{errorMessage}</div>
    </div>
  )
}
