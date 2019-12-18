FROM node:12.8.0

WORKDIR /api

COPY package.json /api
RUN npm install\
    && npm i tsc typescript -g

COPY . /api
RUN tsc && mkdir /api/build/public
COPY swagger.yaml /api/build
COPY public/ /api/build/public

EXPOSE 3000

## Wait for db to be up
# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
# RUN chmod +x /wait

## Launch the wait tool and then your application
# CMD /wait
CMD npm start

