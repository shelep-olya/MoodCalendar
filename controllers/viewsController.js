const mainLayout = "../views/layouts/main.ejs";
const authLayout = "../views/layouts/auth.ejs";

exports.getMainPage = (req, res) => {
    res.status(200).render("calendar", {layout: mainLayout});
};