
const PORT = process.env.PORT || 8000

//required modules
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

//call express
const app = express()

const newspapers =[
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/search?source=nav-desktop&q=bees',
        base: 'https://www.thetimes.co.uk/'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/bees',
        base: '',
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/topic/subject/bees',
        base: 'https://www.nytimes.com/',
    },
    {
        name: 'thescientist',
        address: 'https://www.the-scientist.com/tag/honey-bees',
        base: '',
    },
    {
        name: 'euronews',
        address: 'https://www.euronews.com/tag/bees',
        base: 'https://www.euronews.com/',
    },

]

const articles =[]

// //get the news from the Guardian
// app.get('/news', (req, res) => {
//     axios.get('https://www.theguardian.com/environment/bees')
//         .then((response) =>{
//             const html = response.data
//            // console.log(html);

//             //cheerio load html that contains in tag <a> word 'bee', then for each element grabs the title and url and push into articles array
//             const $ = cheerio.load(html)
//             $('a:contains("bee")', html).each(function() {
//                 const title = $(this).text()
//                 const url = $(this).attr('href')
//                 articles.push({
//                     title,
//                     url
//                 })
//             }) 
//             res.json(articles) // this response we see in our browser when visit localhost:8000/news
//         })
//         .catch((err) =>console.log(err))
// })
    
//get news from all the sites
newspapers.forEach( newspaper =>{
    axios.get(newspaper.address)
        .then(response =>{
            const html =response.data;
            const $ = cheerio.load(html)
            $('a:contains("bees")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res)=>{
    res.json('Welcome to the Bees News API. Get with /news all of them, or just for a specific newspaper use route /news/thetimes');
})

//get the news
app.get('/news', (req, res) => {
    res.json(articles);
})

//get the news from just one newspaper
app.get('/news/:newspaperID', (req, res)=>{
    //console.log(req.params.newspaperID);
    const newspaperID = req.params.newspaperID;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address //if we get the name and the Id matching we put this in variable
    // console.log(newspaperAddress);

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base
    // const newspaperURL = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].url
    
    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $('a:contains("bees")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperID
                })//.replace(/\\n\s+/gm, '').trim()
            })
            res.json(specificArticles)
            
        }).catch(err => console.log(err))
        
    })

app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))