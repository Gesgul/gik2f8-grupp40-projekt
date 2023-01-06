/* I denna fil finns en klass för att hantera API-förfrågningar mot server (servern är det backend som skapades i lektion 5).
Om ni vill starta precis denna kod måste ni först installera om node-paket och starta upp servern. Servern, såsom den ser ut i slutet av Lektion 6, finns i denna samma zip-fil. Om ni skulle köra denna kod mot backend såsom det såg ut efter Lektion 5, skulle det inte fungera, eftersom detta är koden såsom den ser ut efter Lektion 6 och några små förändringar gjordes även i servern under Lektion 6. 
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
    /* Medlemsvariabeln url sätts till den sträng som man skickar in när man skapar en instans av klassen (det görs i script.js). Detta upplägg är för att göra denna klass generell. Tanken är att det ska gå att använda vår api-klass till olika HTTP-anrop, inte bara sådana för våran todo-applikation.   */
    this.url = url;
  }

  /* Metod för att hatera att skapa resurser (Create i CRUD). Motsvarar ett anrop med metoden POST.   
  
  Create = POST
  */
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
    /* I detta fetch-anrop behövs inga särskilda inställningar. Fetch kan ta bara url:en som parameter också, istället för att man skapar ett helt request-objekt och skickar in det. */
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  remove(id) {
    /*  Innan ni går vidare med remove, så måste ni se till att server-koden från L5 har en sak från L5 fixad: 
      I server/app.js ska  
        res.header('Access-Control-Allow-Method', '*') 
      ha ändrats till till 
        res.header('Access-Control-Allow-Methods', '*'); (Method->Methods, alltså)  */

    /* Log för att se att rätt uppgift är på väg att tas bort */
    console.log(`Removing task with id ${id}`);

    /* Här behövs, precis som vid POST, lite mer inställningar. Fetch behöver dock inte heller här ett requestobjekt. Det går bra att skicka de sakerna som man skulle ha skickat till requestobjektets konstruktor direkt till fetch-funktionen. 
    Det som skickas in som förfrågan är alltså url, som första argument och en uppsättning inställningar i ett objekt, som andra argument. Precis som när POST-requesten skapades ovan, i create ovan. 
    Det enda som finns i objektet, som skickas in som andra argument till fetch, är att sätta method till delete, eftersom det är den HTTP-metoden som ska användas här. 
    Egentligen skulle jag ha kunnat satt exakt samma kedja av then-anrop här som vid create (POST) och getAll (READ), men det är inte helt relevant vad som kommer till baka från ett delete-anrop. 
    */
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }

  update(data){
    console.log(`Updating task with id ${data.id}`);

    const JSONData = JSON.stringify(data);
    const request = new Request(this.url, {
      method: 'PATCH',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    return fetch(`${this.url}/${JSONData}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }
  /***********************Labb 2 ***********************/
  /* Här skulle det vara lämpligt att skriva en metod likt getAll,                        fetch(url, {options}) 
  create och delete anropas från script.js när någon har markerat en uppgift som färdig. 
  Denna metod bör ansvara för att göra en PUT eller PATCH-förfrågan till vårt backend, precis som create-metoden ansvarar för att göra ett POST-anrop.
   Metoden här ska alltså motsvara Update = PUT/PATCH. En sådan förfrågan görs med hjälp av fetch(). 
  
  Beroende på om ni gör frontend eller backend först i labben behöver ni på något av ställena bestämma er för en av metoderna PUT
   eller PATCH för denna förfrågan. (Du får välja själv, läs på om vad som verkar mest vettigt för din lösning). 
   Använder du metoden PATCH här behöver i alla fall det vara patch som tas emot i servern också, app.patch(...), och vice versa om du väljer PUT. 
  */

  /*   
  För att utföra en förfrågan med hjälp av fetch() behöver servern veta några saker om förfrågan (request). 
  Först och främst behövs en url dit förfrågan ska skickas, 
  sedan behövs också ett objekt med inställningar och detaljer om förfrågan,
   detta objekt kallas vidare "{options}". Url och {options} kan sättas antingen i ett requestobjekts konstruktor; new Request(url, 
    {options}), såsom det görs i create-metoden. Eller så skulle man kunna ange allt som annars skulle ha skickats till Request-objektets 
    konstruktor inom parenteserna hos fetch() istället; fetch(url, {options})
  
  Här finns mer info om fetch-metoden: 
  https://developer.mozilla.org/en-US/docs/Web/API/fetch.
  */

  /* Precis som vid create behöver även här {options} innehålla egenskapen body - dvs. de data som ska skickas till server. */

  /* Det finns några sätt att utforma det som ska skickas i förfrågans body. Oavsett vad vi väljer ska det först översättas till JSON. 
  
  Alternativ 1: body består av ett helt task-objekt, som också inkluderar förändringen. Exempel: 
  {id: 1,  title: "x", description: "x", dueDate: "x", completed: true/false}
  Alternativ 2: request-objektets body består bara av förändringarna och vilken uppgift som ska förändras. Exempel:
   {id: 1, completed: true/false }
  
  Om du hittar något annat sätt som funkar för dig, använd för all del det, så länge det uppnår samma sak. :)
  
  */

  /***********************Labb 2 ***********************/
}