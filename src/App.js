import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber)

  function handleChange(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  const observer=useRef()
  const useLastElementRef = useCallback(node=>{
    if (loading) return 
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries=>{
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prev=>prev+1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  return (
    <>
      <input type="text" value={query} onChange={handleChange}></input>

      {books.map((book, index)=>{
        if (books.length===index+1) {
          return <div key={book} ref={useLastElementRef}>{book}</div>
        } else {
          return <div key={book}>{book}</div>
        }
      })}

      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error...'}</div>
    </>
  )
}


