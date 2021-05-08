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
    await gotogoogle(tab);
    await tab.waitForSelector('span[title="Symptoms"]');
    await tab.click('span[title="Symptoms"]');
    await symptoms(tab, "Symptoms");
    await delay(2000);
    await tab.click('span[title="Prevention"]');
    await prevention(tab);
    await delay(4000);
    await treatments(tab);
    await delay(4000);
    await news(tab); 
    await delay(4000);
    await coping(tab);
}
async function gotogoogle(tab) {
    await tab.goto("https://www.google.com/");
    await tab.type(".gLFyf.gsfi", "Coronavirus");
    await tab.keyboard.press("Enter");
}
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
async function covidcase(tab) {
    let covidcases = [];
    await tab.waitForNavigation({ waitUntil: "networkidle2" });
    await tab.click('span[title="Statistics"]');
    await tab.waitForSelector("tbody tr.viwUIc",{visible:true});
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
    await tab.waitForSelector(".dbg0pd");
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
}
async function symptoms(tab, word) {
    // await tab.waitForSelector("div.Z0mB9b div.PZPZlf span");
    await tab.waitForNavigation({waitUntil:"networkidle2"});
    let data = await tab.$$("div.Z0mB9b div.PZPZlf span");
    let str="";
    for (let i = 13; i < data.length; i++) {
        let variable = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, data[i]);
        if(i==14||i==18||i==26)
        str+="\n* "+variable+"\n";
        else if(i>=30)
        str+="\n# "+variable+"\n";
        else
        str+="=> "+variable+"\n";
        fs.writeFileSync(word + ".txt","=> "+word+"\n\n"+str);
    }
}
async function prevention(tab)
{
    await tab.evaluate(() => {
        window.scrollBy(0, 500);
    });
    let data=await tab.$$(".bVNaN .PZPZlf");
    let str="";
    for(let i=12;i<data.length;i++)
    {
        let line= await tab.evaluate(function (ele) {
            return ele.innerText;
        }, data[i]);
        if(i==13||i==22)
        {
            str+="\n\n* "+line;
        }
        else if(i==21)
        {
            str+="\n\n"+line;
        }
        else
        str+="\n=> "+line;
    }
    fs.writeFileSync("Prevention.txt","=>Prevention\n"+str);
}
async function treatments(tab)
{
    await tab.click('span[title="Treatments"]');
    await tab.waitForSelector(".mWyH1d.FXMOpb .R7GtFd.PZPZlf");
    let headings=await tab.$$(".mWyH1d.FXMOpb .R7GtFd.PZPZlf"); //2 headings
    let str="";
    let heading1=await tab.evaluate(function(ele)
    {
        return ele.innerText;
    },headings[2]);
    str+=heading1+"\n";
    let data=await tab.$$(".gy6Qzb.oNjtBb.V1sL5c .BpuzOe .PZPZlf");
    for(let i=28;i<data.length-1;i++)
    {
        let line=await tab.evaluate(function(ele){
            return ele.innerText;
        },data[i]);
        if(i==28||i==40||i==45||i==50)
        {
            str+="\n* "+line+"\n";
        }
        else if(i==44)
        {
            let heading2=await tab.evaluate(function(ele){
                return ele.innerText;
            },headings[3]);
            str+="\n"+heading2+"\n";
        }
        else
        str+="=> "+line+"\n";
    }
    fs.writeFileSync("Treatments.txt","=> Treatments\n\n"+str);
}
async function news(tab)
{
    await tab.click('span[title="News"]');
    await tab.waitForSelector(".JheGif.nDgy9d");
    let totalnews=await tab.$$(".JheGif.nDgy9d");
    let str="";
    fs.writeFileSync("news.txt","News\n\n");
    for(let i=0;i<totalnews.length;i++)
    {
        let news=await tab.evaluate(function(ele){
            return ele.innerText;
        },totalnews[i]);
        str=str+(i+1)+". "+news+"\n\n";
    }
    fs.writeFileSync("News.txt","=> News\n\n"+str);
}
async function coping(tab)
{
    await tab.click('span[title="Coping"]');
    await tab.waitForSelector(".juDAUd .krw0Mb");
    let heading=await tab.$$(".juDAUd .krw0Mb");  //coping
    let ans="";
    let heading1=await tab.evaluate(function(ele){
        return ele.innerText;
    },heading[5]);
    ans+="=> "+heading1+"\n\n";
    let general=await tab.$$(".bXATZd.j29TPc .PZPZlf");
    for(let i=3;i<general.length;i++)
    {
        let line=await tab.evaluate(function(ele)
        {
            return ele.innerText;
        },general[i]);
        ans+="# "+line+"\n";
    }
    ans=ans+"\n";
    let subheadings=await tab.$$(".R7GtFd.PZPZlf.AioC1");
    for(let i=5;i<subheadings.length;i++)
    {
        let subheading=await tab.evaluate(function(ele){
            return ele.innerText;
        },subheadings[i]);
        ans+=(i-4) + ". "+subheading+"\n";
    }
    fs.writeFileSync("Coping.txt",ans);
}
main();