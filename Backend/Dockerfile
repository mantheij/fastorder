# ./mvnw install
# docker build --build-arg JAR_FILE=target/*.jar -t gerschdi/fastorderbackend:3 .
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]