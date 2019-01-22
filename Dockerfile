FROM node:10.15.0

WORKDIR /depoly/app/pada-api
# COPY . /depoly/app/pada-api

# RUN npm install --silent
# expose port
ARG PORT=31544
ENV PORT $PORT
EXPOSE $PORT

CMD ["npm", "run", "start:dev"]