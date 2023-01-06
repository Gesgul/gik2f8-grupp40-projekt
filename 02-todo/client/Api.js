/*Om ni vill starta precis denna kod måste ni först installera om node-paket och starta upp servern. Servern, såsom den ser ut i slutet av Lektion 6, finns i denna samma zip-fil. Om ni skulle köra denna kod mot backend såsom det såg ut efter Lektion 5, skulle det inte fungera, eftersom detta är koden såsom den ser ut efter Lektion 6 och några små förändringar gjordes även i servern under Lektion 6. 

Gör då följande här i VS Code: 
1. Öppna en terminal
2. Skriv "cd 02-todo/server" (utan citattecken) och sedan enter
3. Skriv "npm install" (utan citattecken) och sedan enter
3. Skriv "node app.js" (utan citattecken) och enter. 

Om servern startats korrekt syns nu texten "Server running on http://localhost:5000".

*/

/* För att skapa en klass används nyckelordet class följt av klassens namn. Klasser bör ha stor inledande bokstav och döpas enligt det som kallas PascalCase. Inga parenteser används vid skapande av en klass. */
class Api {
  /* Medlemsvariabel url, för att lagra en grund-url till servern. */
  url = '';

  /* När en instans av klassen skapas skickas url in som parametern */
  constructor(url) {
   
    this.url = url;
  }

  
  create(data) {
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);
    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });


    return (
      fetch(request)
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err))
    );
  }

  /* Read - GET */
  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }


  remove(id) {
   
    console.log(`Removing task with id ${id}`);

  
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }


}