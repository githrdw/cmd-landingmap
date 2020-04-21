
# Challenge 3 Landingmap
> Ruben de Wit // 18054048

# Opdracht
In 2068 SpaceX keert het Interplanetary Transport System (ITS) terug op Aarde. Elon
heeft de Marsreis altijd gezien als een reis met een retourticket. Na een tijd op Mars te
hebben gewoond keren nu 32 mensen terug naar Aarde.
Elon Musk heeft de Haagse Hogeschool weer gevraagd om deze ex-Marsbewoners te
helpen. Hij wil dat we de meest ‘ideale’ landingsplaats vinden op het aardoppervlak
met behulp van een live dashboard. Op dit dashboard komt in een visuele vorm advies
voor een landingsplaats met informatie voor de terugkerende Marsbewoners uit een
externe bron.

# Uitwerking
Ontwerpkeuzes
-------------
De belangrijkste functie van deze webapplicatie is het inzien van landingsplaatsen op een wereldkaart.  
Ik heb er bewust voor gekozen niet de stijl van vorige challenges over te nemen. Zo heb ik meer vrijheid gehad om te experimenteren met indeling en opmaak.
Toch wilde ik wel graag het verband met Challenge 1 leggen en heb daarvan de chat functionaliteit meegenomen.
Zodoende kunnen reizigers op de heen- en terugweg via hetzelfde kanaal communiceren.  

De wereldkaart is gemaakt in Mapbox en is gebaseerd op het thema Decimal.
Om het overeen te laten komen met het ontwerp zijn kleuren aangepast en labels weggelaten.

In deze applicatie worden de volgende API's gebruikt:
* Mapbox GL
* Mapbox Geocoding
* OpenWeatherMap
* Statisch bestand (api/sites.json) voor dynamische bron voor landingsplaatsen
* ITSI websocket

Wat betreft breakpoints heb ik dit keer gekozen om niet vast te klampen aan vaste breedtes, maar aan de aspect-ratio.
Omdat de kaart cirkelvormig wordt afgebeeld bij het openen van een landingsplaats is het van belang dat de cirkel juist gepositioneerd wordt aan de hand van de ratio (links bij breed scherm, boven bij smal scherm; in verhouding).
Dat was voor mij een nieuw principe maar ik vind het handig om gebruikt te hebben.