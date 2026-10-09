def paginate(
    items: list,
    page: int = 1,
    page_size: int = 10,
):
    if page < 1:
        page = 1

    if page_size < 1:
        page_size = 10

    start = (page - 1) * page_size
    end = start + page_size

    return {
        "items": items[start:end],
        "page": page,
        "page_size": page_size,
        "total": len(items),
        "total_pages": (
            (len(items) + page_size - 1)
            // page_size
        ),
    }