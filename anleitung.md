
# FastOrder

FastOrder revolutioniert das Erlebnis in Bars grundlegend. Mit unserer benutzerfreundlichen Web-App können Gäste ihre Getränke direkt von ihrem Endgerät aus bestellen, ohne auf die Aufmerksamkeit des Personals warten zu müssen. Für Kellner und Barkeeper bedeutet das eine effizientere Arbeitsweise, weniger Stress und die Möglichkeit, sich auf das zu konzentrieren, was wirklich zählt – erstklassigen Service bieten.

---

## Start

Die App finden sie in der BW-Cloud unter ```http://3f1e7565-7313-480b-bd1b-7840190dc884.ma.bw-cloud-instance.org/product/1``` **Hierbei beachten:** es muss ein http:// vor dem Link stehen, dieses wird oft beim einfügen zu einem https://, außerdem muss das Netzwerk iPv6 unterstützen (Eduroam tut dies nicht).  

Alternative: Wenn Sie das Programm lokal starten (Siehe _README.md_ für genauere Anweisungen), sollte sich automatisch in Ihrem Browser ein Fenster mit der App öffnen. Falls dies nicht der Fall ist, können Sie die App Lokal unter ```http://localhost:3000/``` erreichen.

### Startseite

Auf der Startseite sehen Sie einen Login-Screen, hier haben Sie die Auswahl zwischen einem Login (Schloss Symbol) oder einem Gastzugang (Gedacht für Besucher der Bar).

--- 

## Gastzugang

Im Gastzugang haben Sie begrenzte Funktionen: Die Auswahl eines Tisches (Gedacht als eine einmalige Aktion des Admins) und das Bestellen von Getränken.

### Bestellen

Nach der Tischwahl werden Sie im Menü landen, hier können Sie durch Kategorien und eine Such-Funktion die angebotenen Getränke filtern, oder die Gesamtauswahl durchschauen.

Um Getränke zum Warenkorb hinzuzufügen, klicken Sie auf ein Bild, dann wählen Sie Ihre Größe, die Menge und schreiben 
Extrawünsche, Hinweise oder sonstiges für die Barkeeper hinzu (Noch nicht implementiert; wird nicht an Barkeeper 
weitergegeben)

Wenn Sie alle Ihre Getränke ausgewählt haben, gehen Sie einfach in den Warenkorb (Einkaufswagen-Button) und Bestätigen Sie Ihre Bestellung.

Ausloggen und den Tisch wechseln können Sie über die Navigation Bar.

---

## Admin-Zugang

Mit den Login-Informationen 
```text
Name: admin
Passwort: admin 
```
Kommen Sie in die uneingeschränkte Version der App.

### Tisch-Ansicht

Sie starten in der Tisch-Ansicht. Hier können Sie gleich alle Tische sehen, die roten Tische, sind Tische mit offenen (also: nicht bezahlten) Bestellungen.

Mit einem Klick auf einen Tisch erhalten Sie eine Reihe von Aktionen, die Sie für diesen Tisch ausführen können, wie das Bezahlen, Bestellen, etc.  
Das Bezahlen in diesem Fall setzt einfach den Status der Bestellung auf erledigt: Der Bezahlvorgang selbst muss 
aktuell noch in Person durchgeführt werden.

### Mitarbeiter-Ansicht

In der Mitarbeiter-Ansicht gehen die offenen Bestellungen ein und werden in kleinen Boxen angezeigt.

Die einzelnen Getränke können nacheinander für bessere Übersicht abgehakt werden.

Die Boxen haben je drei Buttons:

**1. Cancel Order**  
Mit diesem Button wird, nach einer weiteren Bestätigung, die Bestellung unwiderruflich gelöscht.  
**2. In work**  
Hiermit wird die Bestellung grau, was anderen Mitarbeitern helfen soll, zu erkennen, welche Bestellungen bereits bearbeitet werden und welche nicht. Dieser Button kann getoggled werden.  
**3. Complete Order**
Durch einen Knopfdruck wird die Bestellung als erledigt markiert. Dadurch verschwindet Sie von den offenen Bestellungen, allerdings ist Sie immernoch auffindbar unter den erledigten Bestellungen.

#### Erledigte Bestellungen

Die erledigten Bestellungen sind unter dem Button **Completed Orders** auffindbar.

Mit dem Button, die jeweils jede Box hat, kann diese Bestellung wieder als offen gesetzt werden, falls sie versehentlich als erledigt gesetzt wurde.

