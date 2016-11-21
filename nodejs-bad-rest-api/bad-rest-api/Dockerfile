FROM node:latest

ENV user node
ENV appdir /home/node/

COPY . $appdir
RUN chown $user:$user --recursive $appdir

WORKDIR $appdir
USER $user
RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
