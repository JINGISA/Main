var home = require('../../controllers/home'),
    image = require("../../controllers/image"),
    routes = require("../../server/routes");


describe('Routes', function(){
    var app = {
        get : sinon.spy(),
        post : sinon.spy(),
        delete : sinon.spy()
    }

    this.beforeEach(function(){
        routes.initialize(app);
    })
    describe("GET_t", function(){
        it("should handle /", function(){
            expect(app.get).to.be.calledWith('/', home.index) //app.get 한게 hoaaaaaaaaaaaaaaaaa
        })
        it("should handle /images/:image_id", function(){
            expect(app.get).to.be.calledWith('/images/:image_id', image.index);
        })
        
    })

})  