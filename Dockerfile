FROM onlinelabs/ubuntu

# Create app directory
WORKDIR /opt/video-tools-backend

# Install app dependencies
COPY package.json .
COPY package.json package-lock.json ./

# software-properties-common
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install software-properties-common
RUN add-apt-repository -y ppa:jonathonf/ffmpeg-3
RUN apt install -y ffmpeg libav-tools x264 x265
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]

