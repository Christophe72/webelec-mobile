# ============================
#      BUILD (Maven)
# ============================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copier le pom.xml d'abord
COPY pom.xml .

# Télécharger les dépendances Maven (cache)
RUN mvn -B dependency:go-offline

# Copier le reste du code
COPY src ./src

# Construire l'application Spring Boot (JAR)
RUN mvn -B clean package -DskipTests

# ============================
#      RUNTIME (JDK 21)
# ============================
FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

# Copier le jar compilé
COPY --from=build /app/target/*.jar app.jar

# Exposer le port Spring
EXPOSE 8080

# Lancer Spring Boot
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
