FROM amd64/openjdk:17-slim

WORKDIR /app

COPY target/chatapp-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java" , "-jar" , "app.jar"]