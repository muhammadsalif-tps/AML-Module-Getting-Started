docker build -t api-gateway .
docker run -p 3000:3000 --name api-gateway api-gateway
docker stop api-gateway
docker start api-gateway
docker logs api-gateway
docker rm api-gateway