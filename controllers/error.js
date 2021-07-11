module.exports.get404 = (req, res, next) =>{
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));

    res.render('404', {pageTitle: "Page Not Found", layout: false, path: '/404'});
    
};