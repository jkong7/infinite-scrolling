import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(()=>{
        setBooks([])
    }, [query])

    useEffect(()=>{
        setLoading(true)
        setError(false)
        let cancel 
        axios.get('http://openlibrary.org/search.json', {
            params: { q: query, page: pageNumber }, 
            cancelToken: new axios.CancelToken(c=>cancel=c)
        }).then(res=>{
            setBooks(prevBooks=>{
                return [...new Set([...prevBooks, ...res.data.docs.map(b=>b.title)])]
            })
            setLoading(false)
            setHasMore(res.data.docs.length)
        }).catch(e=>{
            if (axios.isCancel(e)) return 
            setError(true)
        })
        return ()=>cancel()
    }, [query, pageNumber])


  return { loading, error, books, hasMore }
}


