# http-service-proxy-debugger

Used to debug http traffic between docker-compose services

# Quick Start

Stay you have the following Fuseki server which runs on port 3030.

```yaml
version: '3'
services:

  fuseki:
    image: ucdlib/rp-ucd-fuseki:jena-3.15.0-c-0.0.2
    env_file:
      - .env
```

If you wanted to debug traffic without modifing any other service, you could do the following:


```yaml
version: '3'
services:

  fuseki-backend:
    image: ucdlib/rp-ucd-fuseki:jena-3.15.0-c-0.0.2
    env_file:
      - .env

  fuseki:
    image: ucdlib/http-service-proxy-debugger:latest
    environment:
      - TARGET=http://fuseki-backend:3030
      - PORT=3030
    ports:
      - 3030:3030
```

Note the renaming of the Fuseki service to `fuseki-backend` and setting the name of the `http-service-proxy-debugger` image to `fuseki`.  Finally, you set the `TARGET` for the proxy and the `PORT` the debugger should listen on.