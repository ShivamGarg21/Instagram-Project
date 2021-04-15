const puppy = require("puppeteer");
const fs = require("fs");   
const username = "your username";
const pass = "your password";
let finalfollowers = [];
let finalfollowing = [];
let unfollowers = [];
let tab;
async function main(){
    let browser = await puppy.launch({
        headless : false,
        defaultViewport: false,
    });
    let pages = await browser.pages();
    tab = pages[0];
    await tab.goto("https://www.instagram.com/accounts/login/");
    await tab.waitForSelector("input[name='username']",{visible:true});
    await tab.type('input[name="username"]',username);
    await tab.type('input[name="password"]',pass);
    await tab.click(".sqdOP.L3NKy.y3zKF");
    await tab.waitForNavigation({waitUntil : "networkidle2"});
    let notify2 = await tab.$(".sqdOP.yWX7d.y3zKF");
    if(notify2!=undefined)
        await notify2.click(); 
    await tab.waitForNavigation({waitUntil : "networkidle2"});
    let notify = await tab.$(".aOOlW.HoLwm");
    if(notify!=undefined)
        await notify.click(); 
            
    await tab.click(".gmFkV");
    await tab.waitForNavigation({waitUntil : "networkidle2"});
    let number = await tab.$$(".g47SY");
    let followernumber = await tab.evaluate(function(ele){
        return ele.textContent;
    },number[1]);
    let followingnumber = await tab.evaluate(function(ele){
        return ele.textContent;
    },number[2]);
    let follow = await tab.$$(".Y8-fY");
    myfollowersfollowing(followernumber,followingnumber);
    
}
async function myfollowersfollowing(followernumber,followingnumber){
    let follow = await tab.$$(".Y8-fY");
    await follow[1].click();
    console.log(followernumber);
    await tab.waitForSelector(".jSC57._6xe7A",{visible:true});
    await tab.click(".jSC57._6xe7A");
    for(let i=0;i<(3*followernumber)/2;i++){
        if(i==7 || i==10){
            await tab.waitForSelector(".jSC57._6xe7A",{visible:true});
            await tab.click(".jSC57._6xe7A");
        }
        await tab.waitForTimeout("200"); 
        await tab.keyboard.press("ArrowDown");
    }
    await tab.waitForSelector(".FPmhX.notranslate._0imsa",{visible : true}); 
    let followersmailanchor = await tab.$$(".FPmhX.notranslate._0imsa");
    for(let i=0;i<followersmailanchor.length;i++){
            let followers = await tab.evaluate(function(ele){
                return ele.innerHTML;
        }, followersmailanchor[i]);
        finalfollowers.push(followers);
    }
    console.log(finalfollowers);
    await tab.waitForSelector(".WaOAr .wpO6b"); 
    await tab.click(".WaOAr .wpO6b");
    await tab.waitForTimeout("2000");
    await tab.waitForSelector(".Y8-fY",{visible:true});
    let follow1 = await tab.$$(".Y8-fY");
    await follow1[2].click();
    console.log(followingnumber);
    await tab.waitForSelector(".jSC57._6xe7A",{visible:true});
    await tab.click(".jSC57._6xe7A");
    for(let i=0;i<(3*followingnumber)/2;i++){
        if(i==7 || i==10){
            await tab.waitForSelector(".jSC57._6xe7A",{visible:true});
            await tab.click(".jSC57._6xe7A");
        }
        await tab.waitForTimeout("200"); 
        await tab.keyboard.press("ArrowDown");
    }
    await tab.waitForSelector(".FPmhX.notranslate._0imsa",{visible : true}); 
    let followingmailanchor = await tab.$$(".FPmhX.notranslate._0imsa");
    for(let i=0;i<followingmailanchor.length;i++){
            let following = await tab.evaluate(function(ele){
                return ele.innerHTML;
        }, followingmailanchor[i]);
        finalfollowing.push(following);
    }
    console.log(finalfollowing);
    for(let i=0;i<finalfollowing.length;i++){
        let flag = 0;
        for(let j=0;j<finalfollowing.length;j++){
            flag = finalfollowing[i].localeCompare(finalfollowers[j])
            if(flag==0)
                break;
        }
        if(flag!=0)
            unfollowers.push(finalfollowing[i]); 
    }
    fs.writeFileSync("unfollowers.json",JSON.stringify(unfollowers));
    
}


main();
