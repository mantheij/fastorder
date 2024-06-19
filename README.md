
# FastOrder

FastOrder revolutioniert das Erlebnis in Bars grundlegend. Mit unserer benutzerfreundlichen Web-App können Gäste ihre Getränke direkt von ihrem Endgerät aus bestellen, ohne auf die Aufmerksamkeit des Personals warten zu müssen. Für Kellner und Barkeeper bedeutet das eine effizientere Arbeitsweise, weniger Stress und die Möglichkeit, sich auf das zu konzentrieren, was wirklich zählt – erstklassigen Service bieten.

## Features

- **Einfach und Schnell**: Vergessen Sie lange Wartezeiten und das Winken nach dem Personal. Ein paar Klicks in der App, und Ihr Getränk ist unterwegs.
- **Volle Kontrolle**: Durchstöbern Sie das komplette Getränkemenü mit Details und Preisen. Wissen Sie immer, was Sie bestellen und wie viel es kostet.
- **Nahtloses Erlebnis**: Egal, ob Sie an der Bar sitzen oder sich in der Lounge entspannen – Ihre Bestellung erreicht das Barpersonal direkt und ohne Umwege.

### Warum FastOrder?

- **Für Gäste**: Nie mehr Wartezeiten, mehr Genuss und ein modernes Barerlebnis.
- **Für Bars**: Effizientere Abläufe, zufriedenere Kunden und gesteigerte Umsätze.

## Link zur WebApp
```
http://3f1e7565-7313-480b-bd1b-7840190dc884.ma.bw-cloud-instance.org/
   ```

## Installation

### Voraussetzungen

- Docker
- Docker Compose
```
https://docs.docker.com/get-docker/
   ```
  

### Schritte

1. **Repository klonen**
   ```bash
   git clone https://git.it.hs-heilbronn.de/gerstlauer/labfastorder.git
   cd FastOrder
   ```

2. **Docker-Compose starten**
   ```bash
   docker-compose up
   ```

3. **Anwendung aufrufen**
    - Öffnen Sie Ihren Browser und gehen Sie zu `http://localhost:80` für das Frontend.
    - Das Backend ist unter `http://localhost:8080` erreichbar.

## Entwicklung

### Backend

Das Backend befindet sich im Ordner `backend/` und ist mit Spring Boot implementiert. Um das Backend lokal zu starten:

```bash
cd backend
./mvnw spring-boot:run
```
**Anwendung aufrufen**
   - Das Backend ist unter `http://localhost:8080` erreichbar.

### Frontend

Das Frontend befindet sich im Ordner `frontend/` und ist mit React implementiert. Um das Frontend lokal zu starten:

```bash
cd frontend
npm install
npm start
```
**Anwendung aufrufen**
- Öffnen Sie Ihren Browser und gehen Sie zu `http://localhost:3000` für das Frontend.


## Docker Build Anleitung

### Voraussetzungen

Stellen Sie sicher, dass Docker und Docker Compose installiert sind.

### Schritte zum Erstellen und Starten der Docker-Container

1. **Backend-Build**

   - Navigieren Sie zum `backend`-Verzeichnis und erstellen Sie die `.jar`-Datei:
     ```bash
     cd backend
     ./mvnw install
     ```
   - Stellen Sie sicher, dass die erstellte `.jar`-Datei im `backend`-Verzeichnis vorhanden ist.
   - Danach muss mithilfe der Dockerfile das Image gebildet werden
   ```bash
     docker build --build-arg JAR_FILE=target/*.jar -t labfast-backend .

     ```

2. **Frontend-Build**

   - Navigieren Sie zum `frontend`-Verzeichnis
     ```bash
     cd frontend
     ```
   - Danach muss mithilfe der Dockerfile das Image gebildet werden
   ```bash
     docker build -t labfast-frontend .
     ```

3. **docker-compose für Backend und Frontend starten**

   - Führen Sie Docker Compose im Hauptverzeichnis des Projekts aus:
     ```bash
     docker-compose -f docker-compose-localbuild.yml up
     ```

4. **Anwendung aufrufen**

   - Öffnen Sie Ihren Browser und gehen Sie zu `http://localhost:80` für das Frontend.
   - Das Backend ist unter `http://localhost:8080` erreichbar.

---

Vielen Dank für Ihr Interesse an FastOrder! Zusammen können wir das Barerlebnis revolutionieren.
