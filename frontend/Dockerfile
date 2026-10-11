FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default html files
RUN rm -rf ./*

# Copy pre-built production assets directly
COPY dist ./

# Copy SSL & Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
