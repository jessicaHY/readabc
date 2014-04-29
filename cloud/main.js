require("cloud/app.js");
require("cloud/services/pay.js")
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("getIcon", function(req, res) {
    var Test = AV.Object.extend("Test2");
    var query = new AV.Query(Test);
    query.get("535f3803e4b0e22e3fad181d", {
        success: function(test) {
            test.destroy({
                success: function(myobject) {
                    console.dir(arguments);
                    res.success("del success");
                },
                error: function(myobject, error) {
                    console.dir(arguments);
                    res.error(error.message);
                }
            })
            var avFile = test.get("icon");
            res.success(avFile.thumbnailURL(50, 50, 100, true, "jpg"));
        },
        error: function(object, error) {
            console.dir(arguments);
            res.error(error.message);
        }
    })
})

AV.Cloud.define("hello", function(request, response) {
    var query = new AV.Query(AV.User);
    query.get("535dbaf9e4b09238db270846", {
        success: function(u) {
            u.setUsername("test");
            u.save().then(function(user){
                response.success(user.id);
            }, function(err) {
//                console.dir(arguments);
                response.error(err.message);
            });
        },
        error: function(u, err) {
//            console.dir(arguments);
            response.error(err.message);
        }
    })
});

AV.Cloud.define("roleInit", function(req, res) {

    var user = new AV.User();
    var userId = "";
    user.setUsername("admin@heiyan.com");
    user.setPassword("admin");
    user.setEmail("admin@heiyan.com");

    user.signUp(null, {
        success:function(u) {
            userId = u.id;

            var userAcl = new AV.ACL();
            userAcl.setWriteAccess(userId, true);
            userAcl.setReadAccess(userId, true);
            u.setACL(userAcl);
            u.save();

            var adminAcl = new AV.ACL();
            adminAcl.setWriteAccess(userId, true);
            adminAcl.setReadAccess(userId, true);

            var admin = new AV.Role("admin", adminAcl);

            var staffAcl = new AV.ACL();
            staffAcl.setRoleReadAccess(admin, true);
            staffAcl.setRoleWriteAccess(admin, true);
            var staff = new AV.Role("staff", staffAcl);

            var siteAcl = new AV.ACL();
            siteAcl.setRoleReadAccess(admin, true);
            siteAcl.setRoleReadAccess(staff, true);
            siteAcl.setRoleWriteAccess(admin, true);
            siteAcl.setRoleWriteAccess(staff, true);
            var site = new AV.Role("site", siteAcl);

            admin.getUsers().add(u);
            admin.save();
            staff.save();
            site.save();

            res.success("success");
        },
        error:function(u, err) {
            res.error(err.message);
        }
    });

    console.dir(user);
})