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
    await testing(tab);
    await gotogoogle(tab);
    await tab.waitForSelector('span[title="Symptoms"]');
    await tab.click('span[title="Symptoms"]');
    await generic(tab, "Symptoms");
    await tab.click('span[title="Prevention"]');
    await generic(tab, "Prevention");
    await treatments(tab);
    await news(tab); 
    await coping(tab);
}
async function gotogoogle(tab) {
    await tab.goto("https://www.google.com/");
    await tab.type(".gLFyf.gsfi", "Coronavirus cases in India");
    await tab.keyboard.press("Enter");
}
async function covidcase(tab) {
    let covidcases = [];
    await tab.waitForNavigation({ waitUntil: "networkidle2" });
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
async function generic(tab, word) {
    await tab.evaluate(() => {
        window.scrollBy(0, 500);
    });
    await tab.waitForSelector(".bVNaN .PZPZlf");
    let data = await tab.$$(".bVNaN .PZPZlf");
    fs.writeFileSync(word + ".txt", word);
    let str="";
    for (let i = 0; i < data.length; i++) {
        let variable = await tab.evaluate(function (ele) {
            return ele.innerText;
        }, data[i]);
        str+=(i+1)+". "+variable+"\n\n";
        fs.writeFileSync(word + ".txt","=> "+word+"\n\n"+str);
    }
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
    },headings[0]);
    str+=heading1+"\n\n";
    let data=await tab.$$(".gy6Qzb.oNjtBb.V1sL5c .BpuzOe .PZPZlf");
    for(let i=0;i<16;i++)
    {
        let line=await tab.evaluate(function(ele){
            return ele.innerText;
        },data[i]);
        if(i==0)
        {
            str+="* "+line+"\n\n";
        }
        else
        str+=i+". "+line+"\n";
    }
    let heading2=await tab.evaluate(function(ele){
        return ele.innerText;
    },headings[1]);
    str+="\n"+heading2+"\n\n";
    for(let i=17;i<data.length-1;i++)
    {
        let line=await tab.evaluate(function(ele){
            return ele.innerText;
        },data[i]);
        if(i==17)
        {
            str+="* "+line+"\n\n";
        }
        else
        str+=(i-17)+". "+line+"\n";
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
    },heading[2]);
    ans+="=> "+heading1+"\n\n";
    let general=await tab.$$(".bXATZd.j29TPc .PZPZlf");
    for(let i=0;i<general.length;i++)
    {
        let line=await tab.evaluate(function(ele)
        {
            return ele.innerText;
        },general[i]);
        ans+="# "+line+"\n";
    }
    ans=ans+"\n";
    let subheadings=await tab.$$(".R7GtFd.PZPZlf.AioC1");
    for(let i=0;i<subheadings.length;i++)
    {
        let subheading=await tab.evaluate(function(ele){
            return ele.innerText;
        },subheadings[i]);
        ans+=(i+1) + ". "+subheading+"\n";
    }
    fs.writeFileSync("Coping.txt",ans);
}
main();