# Learn by doing Project - ForeverTool (version 2)

### Clients management application, with firebase database (authentication, realtime database, storage).
  ### Main functionalities:
    - get list of clients
      - filter:
        - list of clients by year and month
        - list of clients that don't contain specific tag text
        - list of clients that contain a specific text from a search input
        - combination of all of the above
    - update informations for each client
    - import new clients
      - from json file
        - replace of special characters (mostly diacritics) with normal characters (ex. ă => a)


## Technologies used:
<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" title="HTML5" alt="HTML" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-plain-wordmark.svg"  title="CSS3" alt="CSS" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/bootstrap/bootstrap-original.svg "  title="Bootstrap" alt="Bootstrap" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-original.svg" title="TypeScript" alt="TypeScript" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/angularjs/angularjs-original.svg" title="Angular" alt="Angular" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/firebase/firebase-plain-wordmark.svg" title="Firebase" alt="Firebase" width="40" height="40"/>&nbsp;
</div>


  ## ToDOne's:
  - search when pressing enter in search input
  - desktop view, fix Log-out button text position
  - filter button:
    - filter by month and year
    - special filters: nu e avatar, unfriended
  - loading screen
  
  ## ToDo's:
  - import downloaded json file
    - json file:
      - replace escape characters with their normal character (ex. ă = a):
        - \u00c4\u0083 : ă
        - \u00c3\u00a3 : ã
        - \u00c4\u0081 : ā
        - \u00c3\u00a2 : â
        - \u00c3\u00a1 : á
        - \u00c4\u0082 : Ă
        - \u00c3\u0081 : Á
        - \u00c3\u00a9 : é
        - \u00c3\u0089 : É
        - \u00c3\u00ae : î
        - \u00c3\u008e : Î
        - \u00c3\u00b6 : ö
        - \u00c3\u0096 : Ö
        - \u00c8\u0099 : ș
        - \u00c5\u009f : ș
        - \u00c8\u0098 : Ș
        - \u00c5\u009e : Ş
        - \u00c8\u009b : ț
        - \u00c5\u00a3 : ț
        - \u00c5\u00a2 : Ț
        - \u00c8\u009a : Ț
      - add importet source property: facebook/linkedin/manual
    - update current json database
  - convert to pwa
  - nice to have's:
    - save filter data to localstorage
    - pagination
    - loading screen what hides after data loaded (w/o timeout!)
    - page not found
