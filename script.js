const puppy = require("puppeteer");
const fs=require("fs");
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
    await symptoms(tab);
}
async function gotogoogle(tab)
{
    await tab.goto("https://www.google.com/");
    await tab.type(".gLFyf.gsfi", "Coronavirus cases in India");
    await tab.keyboard.press("Enter");
}
async function covidcase(tab)
{
    let covidcases = [];
    await tab.waitForNavigation({ waitUntil: "networkidle2" });
    await tab.evaluate(() => {
        window.scrollBy(0, 1000);
    });
    let rows = await tab.$$("tbody tr.viwUIc");
   
    for(let i=0;i<rows.length;i++)
    { 
      let columns=await rows[i].$$('td >div >div >span');
      let location=await tab.evaluate(function(ele)
        {
            return ele.innerText;
        },columns[0]);

        let cases=await tab.evaluate(function(ele)
        {
            return ele.innerText;
        },columns[1]);
        let recovered=await tab.evaluate(function(ele)
        {
            return ele.innerText;
        },columns[3]);
        let deaths=await tab.evaluate(function(ele)
        {
            return ele.innerText;
        },columns[5]);
        covidcases.push({
            "locations":location,
            "cases":cases,
            "recovered":recovered,
            "deaths":deaths
        });
        if(i==rows.length-1)
       fs.writeFileSync("CovidCases.json",JSON.stringify(covidcases));  
    }
}
async function testing(tab)
{
    await tab.click('span[title="Testing"]');    
    await tab.waitForSelector(".dbg0pd");
    await tab.click(".dbg0pd");
    await tab.waitForNavigation({waitUntil:"networkidle2"});

    let rows=await tab.$$(".cXedhc");
    let names=await tab.$$(".cXedhc div.dbg0pd div ");
    let informations=await tab.$$(".f5Sf1");
    let types=await tab.$$(".dXnVAb");
    let hospitaldetails=[];

    for(let i=0;i<rows.length;i++)
    {
        let name=await tab.evaluate(function(ele){
            return ele.innerText;
        },names[i]);
        let information=await tab.evaluate(function(ele){
            return ele.innerText;
        },informations[i]);
        let type=await tab.evaluate(function(ele){
            return ele.innerText;
        },types[i]);
        let separator=type.split('\n');
        let eligibility=separator[0];
        let mode=separator[1];
        hospitaldetails.push({
            "name":name,
            "information":information,
            "eligibility":eligibility,
            "mode":mode
        });
        if(i==rows.length-1)
        {
            fs.writeFileSync("TestingCenters.json",JSON.stringify(hospitaldetails));
        }
    }
}
async function symptoms(tab)
{
    await tab.waitForSelector('span[title="Symptoms"]');
    await tab.click('span[title="Symptoms"]');
    // await tab.waitForSelector(".Z0mB9b .PZPZlf");
    await tab.waitForNavigation({waitUntil:"networkidle2"});
    let symptoms=await tab.$$(".Z0mB9b .PZPZlf");
    fs.writeFileSync("symptom.txt","Symptoms of Covid 19");
   for(let i=0;i<symptoms.length;i++)
   {
    let symptom=await tab.evaluate(function(ele){
        return ele.innerText;
    },symptoms[i]);
    let prevdata=fs.readFileSync("symptom.txt","utf-8");
    fs.writeFileSync("symptom.txt",prevdata+"\n"+symptom);
    }
} 

main();