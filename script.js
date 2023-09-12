"use strict";
//Appwrite code
//----------------------
const { Client, Account, Databases, ID, Query } = Appwrite;
const client = new Client();
//----------------------
var playerName = prompt("Enter Player Name");

//------------------------------------------------------
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let currScore = 20;
let currHighScore = 0;

const displayMessage = function (message) {
    document.querySelector(".message").textContent = message;
};

//-----------------------------------------------------------
document.querySelector(".check").addEventListener("click", function () {
    let guess = Number(document.querySelector(".guess").value);
    if (currScore > 0) {
        if (!guess) {
            
            displayMessage("⛔No number!");
        } else if (guess === secretNumber) {
            
            displayMessage("😎 Correct Number ");
            document.querySelector(".number").textContent = secretNumber;
            if (currScore > currHighScore) {
                currHighScore = currScore;
                document.querySelector(".highscore").textContent = currHighScore;
            }
            setScoreOnServer();
            document.querySelector("body").style.backgroundColor = "#60b347";
        } else {
            displayMessage(guess > secretNumber ? "📈 Too high" : "📉 Too low ");
            currScore--;
            document.querySelector(".score").textContent = currScore;
        }
    } else {
        displayMessage("🚨 you lost the Game! ");
    }
});

//---------------------------------------------------------------------------
document.querySelector(".again").addEventListener("click", function () {
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    currScore = 20;
    document.querySelector(".message").textContent = "🎮Start guessing...";
    document.querySelector(".score").textContent = currScore;
    document.querySelector(".number").textContent = "?";
    document.querySelector(".guess").value = "";
    document.querySelector("body").style.backgroundColor = "#333";
});
//----------------------------------------------------
// Appwrite
getMaxScoreUser();
function getMaxScoreUser() {
    client
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("64d750b23ab72c7b992d");
    //---------------------------------
    const databases = new Databases(client);
    //-----------------------------------
    const date = new Date(Date.now());
    const key = `${date.getDate()}/${date.getFullYear()}`;
    //---------------------------------
    databases
        .getDocument("65006548babd8ba40c94", "65006568df7f60eb8777", "", [
            Query.equal("date", key),
        ])
        .then((obj) => {
            // console.log(obj.documents);

            let array = obj.documents;
            let len = array.length;
            if (len == 0) {
                document.querySelector(".highscore").textContent = currHighScore;
            } else {
                let obj = JSON.parse(JSON.stringify(array[0]));
                currHighScore = Math.max(currHighScore,obj.value)
                document.querySelector(".highscore").textContent = currHighScore;
                document.querySelector(".name").textContent = obj.name;
                
            }
        });
}
//--------------------------------
getMaxScoreUser();
//-------------------------------
function setScoreOnServer() {
    client
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("64d750b23ab72c7b992d");
    //---------------------------------
    const databases = new Databases(client);
    //-----------------------------------
    const date = new Date(Date.now());
    const key = `${date.getDate()}/${date.getFullYear()}`;
    //---------------------------------
    databases
        .getDocument("65006548babd8ba40c94", "65006568df7f60eb8777", "", [
            Query.equal("date", key),
        ])
        .then((obj) => {
            let array = obj.documents;
            let len = array.length;
            if (len == 0) {
                const promise = databases.createDocument(
                    "65006548babd8ba40c94", 
                    "65006568df7f60eb8777",
                    ID.unique(),
                    {
                        date: key,
                        value: currScore,
                        name: playerName,
                    }
                );
                promise.then(
                    function (response) {
                        // console.log(response);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            } else {
                
                let obj = JSON.parse(JSON.stringify(array[0]));
                currHighScore = Math.max(currHighScore,obj.value)
                document.querySelector(".highscore").textContent = currHighScore;
               
                let theirName = obj.name;
                let theirValue = obj.value;
                let d_id = array[0].$id;
                
                if (currScore >= theirValue) {
                    theirName = playerName;
                    theirValue = currScore;
                    const promise = databases.updateDocument(
                        "65006548babd8ba40c94",
                        "65006568df7f60eb8777",
                        d_id,
                        {
                            date: key,
                            value: theirValue,
                            name: theirName,
                        }
                    );
                    promise.then((obj) => {
                        getMaxScoreUser();
                    });
                }
            }
        });
    //----------------------------------------------------
}

