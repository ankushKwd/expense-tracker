# Use a multi-stage build to keep the final image small

# Stage 1: Build the application
# Using Eclipse Temurin JDK 17 on a Focal (Ubuntu 20.04) base for building
FROM eclipse-temurin:17-jdk-focal AS build
WORKDIR /app

# Copy Maven wrapper files (if using Maven)
COPY mvnw .
COPY .mvn .mvn

# Copy pom.xml and build it to download dependencies (improves caching)
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Copy all source code
COPY src ./src

# Build the Spring Boot application
RUN ./mvnw clean install -DskipTests

# Stage 2: Create the final lightweight runtime image
# Using Eclipse Temurin JRE 17 on a Focal (Ubuntu 20.04) base for running
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Expose the port your Spring Boot app listens on (default is 8080)
EXPOSE 8080

# Copy the executable JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Define the entrypoint to run your Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]