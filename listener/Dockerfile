FROM node:22

RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libpango-1.0-0 \
    libgbm1 \
    libxshmfence1 \
    openssl \
    ssh \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash puppeteeruser
RUN echo "puppeteeruser:password" | chpasswd

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY server.js /usr/src/app/server.js

CMD ["node", "server.js"]
