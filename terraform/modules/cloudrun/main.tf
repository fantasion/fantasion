locals {
  npm = jsondecode(file("${var.path}/package.json"))
  default_envs = [
    {
      name = "GCP_PROJECT"
      value = var.project
    }
  ]
}

locals {
  image_version = terraform.workspace == "production" ? local.npm.version : var.revision
}

locals {
  image_url = "${var.image_base_url}/${local.npm.name}:${local.image_version}"
}

resource "google_project_service" "cf" {
  project = var.project
  service = "run.googleapis.com"
}

resource "google_cloud_run_service" "service" {
  name = var.name
  location = var.region
  
  template {
    spec {
      containers {
        image = local.image_url

        dynamic "env" {
          for_each = concat(local.default_envs, var.envs)
          content {
            name = env.value.name
            value = env.value.value
          }
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = terraform.workspace == "production" ? "1" : "0"
        "autoscaling.knative.dev/maxScale" = terraform.workspace == "production" ? "100" : "1"
        "run.googleapis.com/cloudsql-instances" = var.connection_name
      }
    }
  }

  autogenerate_revision_name = true
}

data "google_iam_policy" "noauth" {
  binding { 
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth_policy" {
  count = var.auth ? 0 : 1
  location = google_cloud_run_service.service.location
  service = google_cloud_run_service.service.name
  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_domain_mapping" "default" {
  location = var.region
  name = var.hostname
  metadata {
    namespace = var.project
    labels = {
      "cloud.googleapis.com/location" = var.region
    }
  }
  spec {
    force_override = false
    route_name = google_cloud_run_service.service.name
  }
}
