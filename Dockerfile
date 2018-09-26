FROM node:8.12.0-jessie AS frontend-build

WORKDIR /app

ADD Frontend/package.json Frontend/yarn.lock ./
RUN yarn install

ADD Frontend .
RUN yarn run build


FROM microsoft/dotnet:2.1.402-sdk-stretch as backend-build

WORKDIR /app

ADD Backend/Backend.csproj .
RUN dotnet restore

ADD Backend .
RUN dotnet publish --output ./dist --configuration Release


FROM microsoft/dotnet:2.1.4-aspnetcore-runtime-stretch-slim

WORKDIR /app

COPY --from=backend-build /app/dist .
COPY --from=frontend-build /app/dist ./wwwroot

EXPOSE 80

ENTRYPOINT ["dotnet", "Backend.dll"]
