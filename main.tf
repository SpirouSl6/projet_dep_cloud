terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = ">= 3.0.0"
    }
  }
}

provider "docker" {}

# BACKEND IMAGE (build local)
resource "docker_image" "backend" {
  name = "spirousl6/backend-app:v1"

  build {
    context    = "${path.module}/backend"
    dockerfile = "Dockerfile"
  }

  keep_locally = true
}


# FRONTEND IMAGE (build local)
resource "docker_image" "frontend" {
  name = "spirousl6/frontend-app:v1"

  build {
    context    = "${path.module}/frontend"
    dockerfile = "Dockerfile"
  }

  keep_locally = true
}

# BACKEND CONTAINER
resource "docker_container" "backend" {
  name  = "backend-app"
  image = docker_image.backend.name

  ports {
    internal = 3000
    external = 5000
  }
}

# FRONTEND CONTAINER
resource "docker_container" "frontend" {
  name  = "frontend-app"
  image = docker_image.frontend.name

  ports {
    internal = 80
    external = 3000
  }

  env = [
    "VITE_BACKEND_URL=http://localhost:5000"
  ]

  depends_on = [docker_container.backend]
}

# OUTPUTS
output "backend_url" {
  value = "http://localhost:5000"
}

output "frontend_url" {
  value = "http://localhost:3000"
}

resource "docker_image" "mysql" {
  name = "mysql:8"
  keep_locally = true
}

resource "docker_container" "mysql" {
  name  = "mysql-db"
  image = docker_image.mysql.name

  env = [
    "MYSQL_ROOT_PASSWORD=rootpwd",
    "MYSQL_DATABASE=mydb"
  ]

  ports {
    internal = 3306
    external = 3306
  }
}
