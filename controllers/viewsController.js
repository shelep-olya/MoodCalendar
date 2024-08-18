const mainLayout = "../views/layouts/main.ejs";
const authLayout = "../views/layouts/auth.ejs";

exports.getMainPage = (req, res) => {
    res.status(200).render("calendar", {layout: mainLayout});
};

exports.getSignupPage = (req, res) => {
    res.status(200).render("signup", {layout: mainLayout});
};

exports.getLoginPage = (req, res) => {
    res.status(200).render("login", {layout: mainLayout});
};
