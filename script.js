const puppy = require("puppeteer");
const fs = require("fs");
async function main() {
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await gotogoogle(tab);
    await covidcase(tab);
    await delay(4000);
    await testing(tab);
    await delay(4000);
    await symptoms(tab, "Symptoms");
   // await delay(4000);
    await tab.click('span[title="Prevention"]');
    await prevention(tab);
   // await delay(4000);
    await treatments(tab);
    await delay(5000);
    await news(tab);
    await delay(5000);
    await coping(tab);
    await delay(5000);
    await vaccineCenters(tab);
    await delay(4000);
    await vaccineSideEffects(tab);
    await delay(4000);
    await vaccineRecords(tab, "VaccineRecords");
    await delay(4000);
    await tab.goto("https://alpha2320.github.io/covid-19.io/");
    await covidResources(tab, "OxygenCylinders", 0);
    await covidResources(tab, "Hospitalbeds", 2);
    await covidResources(tab, "Onlineconsultation", 3);
    await covidResources(tab, "FoodSupply", 4);
    await covidResources(tab, "HomeQuarantine", 5);
    await covidResources(tab, "AmbulanceService", 6);
}
async function gotogoogle(tab) {
    await tab.goto("https://www.google.com/");
    await tab.type(".gLFyf.gsfi", "Coronavirus");
    await tab.keyboard.press("Enter");
}
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
async function covidcase(tab) {
    let covidcases = [];
    await tab.waitForNavigation({ waitUntil: "networkidle2" });
    await tab.click('span[title="Statistics"]');
    await tab.waitForSelector("tbody tr.viwUIc", { visible: true });
    await tab.evaluate(() => {
        window.scrollBy(0, 1000);
    });
    let rows = await tab.$$("tbody tr.viwUIc");

    for (let i = 0; i < rows.length; i++) {
        let columns = await rows[i].$$('td >div >div >span');
        let location = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, columns[0]);

        let cases = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, columns[1]);
        let recovered = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, columns[3]);
        let deaths = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, columns[5]);
        covidcases.push({
            "locations": location,
            "cases": cases,
            "recovered": recovered,
            "deaths": deaths
        });
        if (i == rows.length - 1)
            fs.writeFileSync("CovidCases.json", JSON.stringify(covidcases));
    }
}
async function testing(tab) {
    await tab.click('span[title="Testing"]');
    await tab.waitForSelector(".dbg0pd", { visible: true });
    await tab.click(".dbg0pd");
    await tab.waitForNavigation({ waitUntil: "networkidle2" });

    let rows = await tab.$$(".cXedhc");
    let names = await tab.$$(".cXedhc div.dbg0pd div ");
    let informations = await tab.$$(".f5Sf1");
    let types = await tab.$$(".dXnVAb");
    let hospitaldetails = [];

    for (let i = 0; i < rows.length; i++) {
        let name = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, names[i]);
        let information = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, informations[i]);
        let type = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, types[i]);
        let separator = type.split('\n');
        let eligibility = separator[0];
        let mode = separator[1];
        hospitaldetails.push({
            "name": name,
            "information": information,
            "eligibility": eligibility,
            "mode": mode
        });
        if (i == rows.length - 1) {
            fs.writeFileSync("TestingCenters.json", JSON.stringify(hospitaldetails));
        }
    }
    await tab.goBack();
}
async function symptoms(tab, word) {
    await tab.click('span[title="Symptoms"]');
    let data = await tab.$$("div.Z0mB9b div.PZPZlf span");
    let str = "";
    for (let i = 13; i < data.length; i++) {
        let variable = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, data[i]);
        if (i == 14 || i == 18 || i == 26)
            str += "\n* " + variable + "\n";
        else if (i >= 30)
            str += "\n# " + variable + "\n";
        else
            str += "=> " + variable + "\n";
        fs.writeFileSync(word + ".txt", "=> " + word + "\n\n" + str);
    }
}
async function prevention(tab) {
    let data = await tab.$$(".bVNaN .PZPZlf");
    let str = "";
    for (let i = 12; i < data.length; i++) {
        let line = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, data[i]);
        if (i == 13 || i == 22) {
            str += "\n\n* " + line;
        }
        else if (i == 21) {
            str += "\n\n" + line;
        }
        else
            str += "\n=> " + line;
    }
    fs.writeFileSync("Prevention.txt", "=>Prevention\n" + str);
}
async function treatments(tab) {
    await tab.click('span[title="Treatments"]');
  //  await tab.waitForSelector(".mWyH1d.FXMOpb .R7GtFd.PZPZlf", { visible: true });
    let headings = await tab.$$(".mWyH1d.FXMOpb .R7GtFd.PZPZlf"); //2 headings
    let str = "";
    let heading1 = await tab.evaluate(function (ele) {
        return ele.innerText;
    }, headings[2]);
    str += heading1 + "\n";
    let data = await tab.$$(".gy6Qzb.oNjtBb.V1sL5c .BpuzOe .PZPZlf");
    for (let i = 28; i < data.length - 1; i++) {
        let line = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, data[i]);
        if (i == 28 || i == 40 || i == 45 || i == 50) {
            str += "\n* " + line + "\n";
        }
        else if (i == 44) {
            let heading2 = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, headings[3]);
            str += "\n" + heading2 + "\n";
        }
        else
            str += "=> " + line + "\n";
    }
    fs.writeFileSync("Treatments.txt", "=> Treatments\n\n" + str);
}
async function news(tab) {
    await tab.click('span[title="News"]');
    await tab.waitForSelector(".JheGif.nDgy9d", { visible: true });
    let totalnews = await tab.$$(".JheGif.nDgy9d");
    let str = "";
    for (let i = 0; i < totalnews.length; i++) {
        let news = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, totalnews[i]);
        str = str + (i + 1) + ". " + news + "\n\n";
    }
    fs.writeFileSync("News.txt", "=> News\n\n" + str);
}
async function coping(tab) {
    await tab.click('span[title="Coping"]');
   // await tab.waitForSelector(".juDAUd .krw0Mb", { visible: true });
    let ans = "=> Coping\n\n";
    let general = await tab.$$(".bXATZd.j29TPc .PZPZlf");
    for (let i = 0; i < general.length; i++) {
        let line = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, general[i]);
        ans += "# " + line + "\n";
    }
    ans = ans + "\n";
    let subheadings = await tab.$$(".R7GtFd.PZPZlf.AioC1");
    for (let i = 0; i < subheadings.length; i++) {
        let subheading = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, subheadings[i]);
        ans += (i + 1) + ". " + subheading + "\n";
    }
    fs.writeFileSync("Coping.txt", ans);
}
async function vaccineCenters(tab) {
    await tab.click("input.gLFyf.gsfi");
    await tab.keyboard.down("Control");
    await tab.keyboard.press("A");
    await tab.keyboard.press("X");
    await tab.keyboard.up("Control");
    await tab.type("input.gLFyf.gsfi", "vaccine centre near me");
    await tab.keyboard.press("Enter");
    await tab.waitForSelector(".MXl0lf.mtqGb.EhIML .wUrVib", { visible: true });
    await delay(4000);
    let clickdata = await tab.$(".MXl0lf.mtqGb.EhIML .wUrVib");
    await tab.evaluate(function (ele) {
        ele.click();
    }, clickdata);
    await tab.waitForSelector("div.dbg0pd", { visible: true });
    let names = await tab.$$("div.dbg0pd");
    let info = await tab.$$("div.f5Sf1");
    let access = await tab.$$("div.dXnVAb");
    let vaccineCenters = [];
    for (let i = 0; i < names.length; i++) {
        let name = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, names[i]);
        let information;
        if (i == 1 || i == 15 || i == 17)
            information = "Not available";
        else if (i >= 2 && i <= 14) {
            information = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, info[i - 1]);
        }
        else if (i == 16) {
            information = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, info[i - 2]);
        }
        else if (i >= 18) {
            information = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, info[i - 3]);
        }
        else if (i == 0) {
            information = await tab.evaluate(function (ele) {
                return ele.innerText;
            }, info[i]);
        }
        let req = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, access[i]);
        let arr = req.split("\n");
        let requirement = arr[0];
        let limit = arr[1];
        vaccineCenters.push({
            "Name": name,
            "Info": information,
            "Requirement": requirement,
            "Limit": limit
        });
        if (i == names.length - 1)
            fs.writeFileSync("VaccineCenters.json", JSON.stringify(vaccineCenters));
    }
    await tab.goBack();
}
async function vaccineSideEffects(tab) {
    await tab.click('span[title="Side effects"]');
    await tab.waitForSelector(".QsuZMe.oLxzIf", { visible: true });
    let data = await tab.$(".QsuZMe.oLxzIf");
    let data1 = await tab.evaluate(function (ele) {
        return ele.innerText;
    }, data);
    fs.writeFileSync("VaccineSideEffects.txt", data1);
}
async function vaccineRecords(tab, word) {
    let arr = [];
    await tab.click('span[title="Statistics"]');
    await tab.waitForSelector("tbody .viwUIc", { visible: true });
    let rows = await tab.$$("tbody .viwUIc");
    for (let i = 0; i < rows.length; i++) {
        let columns = await rows[i].$$("td >div> div >span");
        let location = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, columns[0]);

        let dosesGiven = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, columns[1]);
        arr.push({
            "Location": location,
            "Doses given": dosesGiven,
        });
        if (i == rows.length - 1)
            fs.writeFileSync(word + ".json", JSON.stringify(arr));
    }
}
async function covidResources(tab, boxname, i) {
   // await tab.waitForSelector(".text-2xl.font-semibold.items-center.py-6", { visible: true });
    let boxes = await tab.$$(".text-2xl.font-semibold.items-center.py-6");
    await tab.evaluate(function (ele) {
        ele.click();
    }, boxes[i]);
    await tab.waitForSelector(".text-xl.font-semibold.my-2", { visible: true });
    let names = await tab.$$(".text-xl.font-semibold.my-2");
    let info = await tab.$$(".flex.space-x-2.text-gray-400.text-sm");
    let verifiedAt = await tab.$$(".text-base.text-gray-400.font-semibold");
    let k = 0;
    let box = [];
    for (let i = 0; i < names.length; i++) {
        let name = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, names[i]);
        k = 2 * i;
        let information1 = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, info[k]);
        let arr = information1.split("\n");
        let info1 = arr.join("");
        let information2 = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, info[k + 1]);
        let verify = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, verifiedAt[i]);
        box.push({
            "Name": name,
            "Info1": info1,
            "Info2": information2,
            "Verified At": verify
        });
        if (i == names.length - 1)
            fs.writeFileSync(boxname + ".json", JSON.stringify(box));
    }
    await tab.click('a[href="./index.html"]');
}
main();