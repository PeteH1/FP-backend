const { expect, assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

chai.use(chaiHttp);

describe('route testing', function () {

    it('Should return a list of names', function (done) {

        chai.request(server)

            .get('/suspect/:name')

            .end((error, response) => {

                if (error) {
                    console.log("error occurred")
                    done(error);
                };

                const responseBody = response.body;
                expect(response).to.have.status(200);
                expect(responseBody).to.not.be.null;

                responseBody.map((data) => {
                    expect(data).to.be.a("Object");
                    expect(data).to.contain.keys("citizen_id");
                    expect(data).to.contain.keys("forenames");
                    expect(data).to.contain.keys("surname");
                    expect(data).to.contain.keys("home_address");
                    expect(data).to.contain.keys("date_of_birth");
                    expect(data).to.contain.keys("place_of_birth");
                    expect(data).to.contain.keys("sex");
                });
                done();
            });
    });
});