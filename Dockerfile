FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/ .
RUN mvn clean package -DskipTests || (cat /root/.m2/repository && exit 1)

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
