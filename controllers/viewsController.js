const mainLayout = "../views/layouts/main.ejs";
const authLayout = "../views/layouts/auth.ejs";

exports.getMainPage = (req, res) => {
    res.status(200).render("signup", {layout: mainLayout});
};


exports.getLoginPage = (req, res) => {
    res.status(200).render("login", {layout: mainLayout});
};

exports.getCalendarPage = (req, res) => {
    res.status(200).render("calendar", {layout: authLayout});
};

exports.getSettingsPage = (req, res) => {
    res.status(200).render("settings", {layout: authLayout});
}


