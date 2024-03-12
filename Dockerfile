COPY  . . 
# 构建  
FROM node:20.10.0-alpine3.17 as build-stage  
  
WORKDIR /app  
  
COPY package*.json ./  
  
RUN npm config set registry http://registry.npmmirror.com/  
RUN npm install  
  
COPY . .  

RUN npm run build:pro

# 生产
FROM node:20.10.0-alpine3.17 as production-build

ARG APP_ENV=production  
  
ENV NODE_ENV=${APP_ENV}  

WORKDIR /app

COPY --from=build-stage /app/dist ./  
COPY --from=build-stage /app/package.json ./

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --only=--production

# 安装一个静态文件服务器，如serve  
RUN npm install -g serve  
  
EXPOSE 8848  
  
# 使用serve启动应用程序，监听8848端口  
CMD ["serve", "-s", "-l", "8848", "dist"]
