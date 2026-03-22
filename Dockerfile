FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/ .
ARG CACHEBUST=1
RUN mvn clean package -DskipTests
RUN ls target/

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/anotaJa-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
