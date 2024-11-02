import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useBookSearch(query, pageNumber) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel 
        axios.get('http://openlibrary.org/search.json', {
            params: { q: query, page: pageNumber }, 
            cancelToken: new axios.CancelToken(c=>cancel=c)
        })
        .then(res => {
            setBooks(prevBooks=>{
                return [...new Set([...prevBooks, ...res.data.docs.map(b=>b.title)])]
            })
            setHasMore(res.data.docs.length)
            setLoading(false)
        }).catch(e=>{
            if (axios.isCancel(e)) return 
            setError(true)
        })
        return ()=>cancel()
    }, [query, pageNumber]); 

    return { loading, error, books, hasMore }
}

/*
axios.get('http://openlibrary.org/search.json', {
    params: { q: 'harry potter', page: 2 }
});

makes a request to: 

http://openlibrary.org/search.json?q=harry+potter&page=2

*/

//Cancel token associated with each call, and useEffects clean up 
//function calls cancel function, which runs when a new run of useEffect
//happens (when query or pageNumber changes), this cancels the request 
//and only the FINAL REQUEST (no new dep array change) gets called

//Now custom hook: we want to return state to use 