var proxyquire, expressStub, configStub, mongooseStub, app; 
var server = function(){
        proxyquire('../../server',{
            'express' : expressStub,
            './server/configure' : configStub,
            'mongoose': mongooseStub
        });
    };

describe('Server_t', function(){
    beforeEach(function(){
        proxyquire = require('proxyquire'),
        app = {
            set : sinon.spy(),
            get : sinon.stub().returns(3400),
            listen : sinon.spy()
        },

        expressStub = sinon.stub().returns(app);
        configStub = sinon.stub().returns(app);
        mongooseStub= {
            connect : sinon.spy(),
            connection : {
                on : sinon.spy()
            }
        };
        delete process.env.PORT;
    });
        describe('Bootstrapping_t', function(){
            it('should create the "app"', function(){
                server();
                expect(expressStub).to.be.called;
            });
            it('should set the view',function(){
                server();
                expect(app.set.secondCall.args[0].to.equal('views'));
            });
            it('should configure the app',function(){
                server();
                expect(configStub).to.be.calledWith(app);
            })
            it('should connect with mongoose', function(){
                server();
                expect(mongooseStub.connect).to.be.calledWith(sinon.match.string);
            })
            it("should lauch the app", function(){
                server();
                expect(app.get).to.be.calledWith('port');
                expect(app.listen).to.be.calledWith(3400, sinon.match.func);
            })
        })



})