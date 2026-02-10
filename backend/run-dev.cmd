A @echo off
setlocal

cd /d "%~dp0"

if exist mvnw.cmd (
    set "MVN_CMD=.\mvnw.cmd"
) else (
    set "MVN_CMD=mvn"
)

echo Running WebElec backend with dev profile...
call %MVN_CMD% spring-boot:run -Dspring-boot.run.profiles=dev

endlocal
