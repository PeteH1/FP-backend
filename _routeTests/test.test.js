const { expect, assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');

chai.use(chaiHttp);

describe('Test for name search', function () {
    it('Should return a list of names', function (done) {
        chai.request(server)
            .get('/suspect/search/Peter Hutchison')
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
                    expect(data).to.contain.keys(["citizen_id", "forenames", "surname", "home_address", "date_of_birth", "place_of_birth", "sex"]);
                });
                done();
            });
    });
});

describe('Test for reg search', function () {
    it('Should return a person matching the reg searched', function (done) {
        chai.request(server)
            .get('/suspect/regsearch/QT06 HUG')
            .end((error, response) => {

                if (error) {
                    console.log("error occurred");
                    done(error);
                };

                const responseBody = response.body;
                expect(response).to.have.status(200);
                expect(responseBody).to.not.be.null;

                responseBody.map((data) => {
                    expect(data).to.be.a("Object");
                    expect(data).to.contain.keys(["citizen_id", "forenames", "surname", "home_address", "date_of_birth", "place_of_birth", "sex", "vehicle_registration_no", "make", "model", "colour"]);
                });
                done();
            });
    });
});

describe('Test for individual data retrieval', function () {
    it('Should return all data on an individual', function (done) {
        chai.request(server)
            .get('/suspect/readById/:citizenId')
            .end((error, response) => {
                if (error) {
                    console.log("error occurred");
                    done(error);
                };

                const responseBody = response.body;
                expect(response).to.have.status(200);
                expect(responseBody).to.not.be.null;
                expect(responseBody).to.be.a("Object");

                done();
            });
    });
});
