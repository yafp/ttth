//tests are currently disabled
// to reenable the following dependencies need to be re-added
//
// DEvDependencies
// - spectron
// - mocha
// - chai
// - chai-as-promised

console.log("Executing: test/spec.js");

const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron"); // Require Electron from the binaries included in node_modules.
const path = require("path");

// Load chai assertions
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

var expect = chai.expect;

describe("Application Window", function ()
{
    this.timeout(20000);

    after(function ()
    {
        if (this.app && this.app.isRunning())
        {
          return this.app.stop();
        }
    });

    beforeEach(function ()
    {
        this.app = new Application(
        {
            // Your electron path can be any binary
            // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
            // But for the sake of the example we fetch it from our node_modules.
            path: electronPath,

            // The following line tells spectron to look and use the main.js file
            // and the package.json located 1 level above.
            args: [path.join(__dirname, "..")]
        });
        return this.app.start();
    });

    afterEach(function ()
    {
        if (this.app && this.app.isRunning())
        {
            return this.app.stop();
        }
    });

    // TEST: Check launching the app window
    //
    /*
    it("Open application window", function ()
    {
        //this.timeout(10000);

        // at least 1 window should be counted
        return this.app.client.getWindowCount().should.not.equal(0);
    });
    */

    // TEST: Check the window title
    //
    /*
    it("Check window title", function ()
    {
        return this.app.client.browserWindow.getTitle().then(function(title)
        {
            expect(title).to.contain("ttth");
            return Promise.resolve();
        });
    });
    */
});
