import React, { Component } from 'react';
import './styles/app.less';
import Menu from './components/Menu';
import ComicSearch from './components/ComicSearch';
import ComicList from './components/ComicList';
import MarvelApi from 'marvel-comics-api';

// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

class App extends Component {
    constructor (props) {
        super(props);
        // In the following line, you should include the prefixes of implementations you want to test.

        if('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').
            then(function(reg){
                console.log('Service Worker Registered...');

                reg.onupdatefound = function(){
                    let installingWorker = reg.installing;
                    installingWorker.onstatechange = function(){
                        switch (installingWorker.state) {
                            case 'installed':
                            if(navigator.serviceWorker.controller){
                                console.log("A new version is available.");
                            } else {
                                console.log("App is now OFFLINE!");
                            }
                            break;

                            case 'redundant':
                            console.log("SW Intalling is redundant.");
                            break;
                        }
                    }
                }
            }).
            catch(function(e){
                console.log('Error registering service works', e);
            });
        }


        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //January is 0!
        let yyyy = today.getFullYear();
        let currentDate = yyyy+""+""+mm+""+dd;
        let dbname = "comics-inc";

        this.state = { comics: [] };

        // this.state = {
        //     comics: [
        //         {
        //             "id": 51846,
        //             "digitalId": 0,
        //             "title": "Gamora (2016) #4",
        //             "thumbnail": {
        //                 "path": "http://i.annihil.us/u/prod/marvel/i/mg/c/40/58cac3ad39d25",
        //                 "extension": "jpg"
        //             }
        //         },
        //         {
        //             "id": 63035,
        //             "digitalId": 0,
        //             "title": "Doctor Strange/Punisher: Magic Bullets (2016) #4",
        //             "thumbnail": {
        //                 "path": "http://i.annihil.us/u/prod/marvel/i/mg/9/30/58cc42db69a21",
        //                 "extension": "jpg"
        //             }
        //         }
        //     ]
        // };
        //need redux to get data
        MarvelApi('comics', {
            publicKey: 'XXXXXXXXXXXXXX',
            privateKey: 'xxxxxxxxxxxxxxxxxx',
            timeout: 4000,
            query: {
                dateRange: '2017-03-19,2017-04-01',
                orderBy: 'onsaleDate',
                limit: 10
            }
        }, (err, body) => {
            let self = this;
            if (err) {
                console.log('Error...');
                //fetch from indexedDB
                if (window.indexedDB) {
                    let request = indexedDB.open(dbname, 3);
                    let db;

                    request.onerror = function(event) {
                        console.log("Why didn't you allow my web app to use IndexedDB?!");
                    };
                    request.onsuccess = function(event) {
                        console.log("Success - indexedDB.");
                        db = event.target.result;

                        let transaction = db.transaction(["newcomics" + currentDate],"readwrite");
                        let store = transaction.objectStore("newcomics" + currentDate);

                        let storeCount = store.count();
                        storeCount.onsuccess = function(){
                            if(storeCount.result && storeCount.result > 0){
                                store.getAll().onsuccess = function(event) {
                                    console.log("Got all comics: " + event.target.result);
                                    self.setState({
                                        comics: event.target.result
                                    });
                                };
                            }
                            console.log("get the count: " + JSON.stringify(storeCount.result));
                        }

                        storeCount.onerror = function(){
                            console.log("Error with getting count...");
                        }
                    };

                }
                return;
            }
            console.log(body.data.total)
            console.log(body.data.results)
            // insert data into indexedDB
            let newcomics = body.data.results;
            this.setState({
                comics: newcomics
            });

            if (window.indexedDB) {
                let request = indexedDB.open(dbname, 3);
                let db;

                request.onerror = function(event) {
                    console.log("Why didn't you allow my web app to use IndexedDB?!");
                };
                request.onsuccess = function(event) {
                    console.log("Success - indexedDB.");
                    db = event.target.result;

                    let transaction = db.transaction(["newcomics" + currentDate],"readwrite");
                    let store = transaction.objectStore("newcomics" + currentDate);

                    let storeCount = store.count();
                    storeCount.onsuccess = function(){
                        console.log("on count success. inserting data. Count is : " + storeCount.result );
                        if(storeCount.result === 0){
                            for (let i in newcomics) {
                                store.add(newcomics[i]);
                            }
                        }

                    }

                    storeCount.onerror = function(){
                        console.log("Error with getting count...");
                    }


                };

                // This event is only implemented in recent browsers
                request.onupgradeneeded = function(event) {
                    let db = event.target.result;

                    // Create an objectStore for this database
                    console.log("creating database");
                    let objectStore = db.createObjectStore("newcomics" + currentDate, { keyPath: "id" });
                };
            }
        })

    }

    render() {
        return (
            <div className="App">
                <header>
                    <Menu />
                    <ComicSearch />
                </header>

                <section className="section-releases">
                    <h2>This weeks releases!</h2>
                    <ComicList comics={this.state.comics} />
                </section>
            </div>
        );
    }
}

export default App;
