// pagination will be handled here  quite nicely 

let paginator = function(books,page)
{
    // some code have to written here
    const booksPerPage = 2
    let size = books.length 
    let parts = Math.ceil(size/booksPerPage)
    if(page>parts)
        page = 1 
    let start = (page-1)*booksPerPage
    let end = page*booksPerPage
    let req_books = books.slice(start,end)
    //determining the showing pages
    let active = page,next = -1,prev = -1 
    let page_arr  = []
    if(parts == 1)
    {
        next = -1
        prev = -1
        page_arr = [1]
    }
    else if(parts == 2)
    {
        if(page == 2)
        {
            next = -1
            prev = 1
            page_arr=[1,2]
        }
        else 
        {
            next = 2
            prev=-1
            page_arr=[1,2]
        }
    }
    else 
    {
        if(page == 1)
        {
            prev = -1
            next = page+1 
            page_arr =[1,2,3]
        }
        else if(page== parts)
        {
            prev= page-1
            next = -1
            page_arr = [page-2,page-1,page]
        }
        else 
        {
            prev = page-1
            next = page+1
            page_arr = [page-1,page,page+1]
        }
    }
    let pageObj = {
        books:req_books,
        active:active,
        prev:prev,
        next:next,
        page_arr : page_arr,
        pagination:true
    }
    return pageObj
}



module.exports = paginator