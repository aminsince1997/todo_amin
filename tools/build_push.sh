#!/bin/bash

cd ../backend
docker build -t backend .
docker tag backend localhost:5000/backend
docker push localhost:5000/backend

cd ../frontend
docker build -t frontend .
docker tag frontend localhost:5000/frontend
docker push localhost:5000/frontend

cd ..
