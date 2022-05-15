FROM buildkite/puppeteer:latest

RUN apt update
RUN apt-get install -y git
RUN git clone https://github.com/Fazil-vk/News-Scrapper /root/News-Scrapper
WORKDIR /root/News-Scrapper/
RUN npm install supervisor -g
RUN apt install -y libgbm-dev

RUN npm install
CMD ["npm", "start"]
