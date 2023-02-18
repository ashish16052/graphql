import React, { useEffect, useState } from 'react'
import { useMutation, gql } from '@apollo/client'

const Form = () => {
    const [name, setName] = useState("")
    const [authorId, setAuthorId] = useState("")

    const createBookMutation = gql`
        mutation addBook(
            $name:String! 
            $authorId:Int!
            ){
            addBook(name:$name,authorId:$authorId){
                id
                name
                authorId
            }
        }   
    `
    const [createBook, { data, error }] = useMutation(createBookMutation)

    useEffect(() => {
        if (error)
            console.error(error);
        if (data)
            console.log(data);
    }, [data, error]);

    const submit = () => {
        createBook({
            variables: {
                name: name,
                authorId: parseInt(authorId)
            }
        })
    }

    return (
        <div>
            <input onChange={(e) => setName(e.target.value)} value={name} name='name' type='text' placeholder='name' />
            <input onChange={(e) => setAuthorId(e.target.value)} value={authorId} name='authorId' type='text' placeholder='authorId' />
            <button onClick={submit}>Add Book</button>
        </div>
    )
}

export default Form