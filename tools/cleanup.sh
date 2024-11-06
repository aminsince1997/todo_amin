docker-compose down -v
docker stack rm $(docker stack ls --format '{{.Name}}')

docker ps | awk {'print $1'} | xargs -n 1 docker stop
docker system prune -fa
docker ps | awk {'print $1'} | xargs -n 1 docker rm

docker volume ls | awk {'print $2'} | xargs -n 1 docker volume rm