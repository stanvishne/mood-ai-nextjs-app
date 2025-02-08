import { useEffect } from 'react'

const debounce = (fn: Function, timeout: number) => {
  let id: NodeJS.Timeout | undefined
  return (str: any) => {
    id && clearInterval(id)
    id = setTimeout(() => {
      fn(str)
    }, timeout)
  }
}

export const useAutosave = ({
  data,
  onSave,
}: {
  data: any
  onSave: Function
}) => {
  const debouncedSave = debounce(onSave, 500)
  useEffect(() => {
    debouncedSave(data)
  }, [data])
}
