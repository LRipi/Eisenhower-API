FROM mysql:5.7
ENV MYSQL_ROOT_PASSWORD=eisenhowerMatrix
ENV MYSQL_DATABASE=eisenhower
EXPOSE 3306
ADD eisenhowerDump.sql /docker-entrypoint-initdb.d
