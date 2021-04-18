// Request endpoints
const Endpoints = {
  users: {
    create: {
      link: "https://startup.lielamar.com/api/v1.0/users",
      method: "post"
    },
    vault: {
      load: {
        link: "https://startup.lielamar.com/api/v1.0/users/vault",
        method: "post"
      },
      update: {
        link: "https://startup.lielamar.com/api/v1.0/users/vault",
        method: "patch"
      }
    }
  },
  auth: {
    accessToken: {
      link: "https://startup.lielamar.com/api/v1.0/auth/access-token",
      method: "post"
    }
  }
}

// // Request tokens
// const Tokens: any = {}

export { Endpoints }