import {useState} from "react";
import blogService from "../services/blogs.js";

const NewBlogForm = ({
    handleAlert,
    handleRefreshChange,
                     }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

    const handleCreateBlog = async (event) => {
        event.preventDefault()
        try {
            const blog = await blogService.create({
                title,
                author,
                url
            })
            handleAlert(`a new blog ${title}, by ${author} added`, 'success')
            setTitle('')
            setAuthor('')
            setUrl('')
            handleRefreshChange(true)
        } catch (exception) {
            handleAlert('could not create blog', 'error')
        }
    }

    return (
        <div>
            {!newBlogFormVisible && <button onClick={() => setNewBlogFormVisible(true)}>new blog</button>}
            {newBlogFormVisible ? (
                <div>
                    <h2>create new</h2>
                    <form onSubmit={handleCreateBlog}>
                        <div>
                            title:
                            <input
                                type="text"
                                value={title}
                                name="Title"
                                onChange={({target}) => setTitle(target.value)}
                            />
                        </div>
                        <div>
                            author:
                            <input
                                type="text"
                                value={author}
                                name="Author"
                                onChange={({target}) => setAuthor(target.value)}
                            />
                        </div>
                        <div>
                            url:
                            <input
                                type="text"
                                value={url}
                                name="Url"
                                onChange={({target}) => setUrl(target.value)}
                            />
                        </div>
                        <button type="submit">create</button>
                    </form>
                    <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
                </div>
            ) : null}
        </div>
    )
}

export default NewBlogForm