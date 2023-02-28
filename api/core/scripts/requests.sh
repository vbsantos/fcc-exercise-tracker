#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d '{"username":"vinicius"}' http://localhost:4000/users

curl -X GET http://localhost:4000/users
