const notFoundPage = (req, res) => {
    return res.status(404).send("No Page Found");
}

export default notFoundPage;