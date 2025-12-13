terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = ">= 3.0.0"
    }
  }
}

provider "docker" {}


# RÉSEAU DOCKER
resource "docker_network" "edutech" {
  name = "edutech-net"
}

# BACKEND IMAGE (build local)
resource "docker_image" "backend" {
  name = "spirousl6/backend-app:v1"

  build {
    context    = "${path.module}/backend"
    dockerfile = "Dockerfile"
  }
}


# FRONTEND IMAGE (build local)
resource "docker_image" "frontend" {
  name = "spirousl6/frontend-app:v1"

  build {
    context    = "${path.module}/frontend"
    dockerfile = "Dockerfile"
  }
}

# MySQL IMAGE
resource "docker_image" "mysql" {
  name         = "mysql:8"
}


# MYSQL CONTAINER
resource "docker_container" "mysql" {
  name  = "mysql-db"
  image = docker_image.mysql.name

  env = [
    "MYSQL_ROOT_PASSWORD=password",
    "MYSQL_DATABASE=edutech"
  ]

  ports {
    internal = 3306
    external = 3306
  }

  networks_advanced {
    name = docker_network.edutech.name
  }

  mounts {
    target = "/docker-entrypoint-initdb.d"
    source = abspath("${path.module}/init")
    type   = "bind"
  }
}


# BACKEND CONTAINER
resource "docker_container" "backend" {
  name  = "backend-app"
  image = docker_image.backend.name

  ports {
    internal = 3000
    external = 5000
  }

  env = [
    "MYSQL_HOST=mysql-db",
    "MYSQL_USER=root",
    "MYSQL_PASSWORD=password",
    "MYSQL_DB=edutech"
  ]

  networks_advanced {
    name = docker_network.edutech.name
  }

  depends_on = [
    docker_container.mysql
  ]
}

# FRONTEND CONTAINER
resource "docker_container" "frontend" {
  name  = "frontend-app"
  image = docker_image.frontend.name

  ports {
    internal = 80
    external = 3000
  }

  networks_advanced {
    name = docker_network.edutech.name
  }

  depends_on = [
    docker_container.backend
  ]
}

# OUTPUTS
output "backend_url" {
  value = "http://localhost:5000"
}

output "frontend_url" {
  value = "http://localhost:3000"
}

